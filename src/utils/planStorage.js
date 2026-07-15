// Data layer for plans. Everything here is written as small async functions
// on purpose — when the Express + MongoDB backend is ready, each function
// body gets swapped for a fetch() call to the matching REST endpoint, and
// nothing in the components needs to change.

const STORAGE_KEY = 'ledger_plans'

function todayStr() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function yesterdayStr(fromDate = new Date()) {
  const d = new Date(fromDate)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeRaw(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function calcPercentage(points) {
  if (!points || points.length === 0) return 0
  const done = points.filter((p) => p.done).length
  return Math.round((done / points.length) * 100)
}

// Checks every plan's lastActiveDate against today. If a plan was last
// touched on an earlier day, archive its final percentage into `history`
// for that day, then reset all checkboxes for the fresh day. This is what
// makes a daily/recurring plan "refresh" automatically.
function rolloverIfNeeded(plans) {
  const today = todayStr()
  let changed = false

  const rolled = plans.map((plan) => {
    if (!plan.recurring) return plan
    if (plan.lastActiveDate === today) return plan

    changed = true
    const percentage = calcPercentage(plan.points)
    const history = [...(plan.history || [])]

    // avoid duplicate entries if rollover runs more than once for the same gap
    const existingIdx = history.findIndex((h) => h.date === plan.lastActiveDate)
    const entry = { date: plan.lastActiveDate, percentage }
    if (existingIdx >= 0) history[existingIdx] = entry
    else history.push(entry)

    return {
      ...plan,
      points: plan.points.map((p) => ({ ...p, done: false })),
      history,
      lastActiveDate: today,
    }
  })

  if (changed) writeRaw(rolled)
  return rolled
}

export async function getPlans() {
  const plans = readRaw()
  return rolloverIfNeeded(plans)
}

export async function createPlan({ name, points, recurring = true }) {
  const plans = readRaw()
  const newPlan = {
    id: uid(),
    name,
    recurring,
    createdAt: new Date().toISOString(),
    lastActiveDate: todayStr(),
    points: points.map((text) => ({ id: uid(), text, done: false })),
    history: [],
  }
  const updated = [newPlan, ...plans]
  writeRaw(updated)
  return newPlan
}

export async function deletePlan(planId) {
  const plans = readRaw().filter((p) => p.id !== planId)
  writeRaw(plans)
  return true
}

export async function addPointToPlan(planId, text) {
  const plans = readRaw()
  const updated = plans.map((p) =>
    p.id === planId
      ? { ...p, points: [...p.points, { id: uid(), text, done: false }] }
      : p,
  )
  writeRaw(updated)
  return updated.find((p) => p.id === planId)
}

export async function togglePoint(planId, pointId) {
  const plans = readRaw()
  const updated = plans.map((p) => {
    if (p.id !== planId) return p
    return {
      ...p,
      points: p.points.map((pt) =>
        pt.id === pointId ? { ...pt, done: !pt.done } : pt,
      ),
    }
  })
  writeRaw(updated)
  return updated.find((p) => p.id === planId)
}

// Did this plan finish yesterday at 100%? Used to decide whether to show a
// motivation/discipline quote for today.
export function completedYesterday(plan) {
  const y = yesterdayStr()
  const entry = (plan.history || []).find((h) => h.date === y)
  return !!entry && entry.percentage === 100
}

// Trend direction: compares the last two history points so the UI can show
// a simple up / down / flat indicator alongside the chart.
export function trendDirection(plan) {
  const history = plan.history || []
  if (history.length < 2) return 'flat'
  const last = history[history.length - 1].percentage
  const prev = history[history.length - 2].percentage
  if (last > prev) return 'up'
  if (last < prev) return 'down'
  return 'flat'
}
