import { calcPercentage } from './planStorage.js'

const STREAK_THRESHOLD = 75 // % completion needed for a day to "count"

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

// Builds a map of { 'YYYY-MM-DD': averagePercentage } across every recurring
// plan, including today's live (not-yet-archived) progress.
export function getDailyCompletionMap(plans) {
  const recurring = plans.filter((p) => p.recurring)
  const map = {}
  const counts = {}

  recurring.forEach((plan) => {
    ;(plan.history || []).forEach(({ date, percentage }) => {
      map[date] = (map[date] || 0) + percentage
      counts[date] = (counts[date] || 0) + 1
    })

    const today = toDateStr(new Date())
    if (plan.lastActiveDate === today) {
      const livePct = calcPercentage(plan.points)
      map[today] = (map[today] || 0) + livePct
      counts[today] = (counts[today] || 0) + 1
    }
  })

  Object.keys(map).forEach((date) => {
    map[date] = Math.round(map[date] / counts[date])
  })

  return map
}

// Walks backward day-by-day from today counting consecutive days whose
// average completion was >= 75%. Stops at the first day that misses the bar
// or has no data — that's the "streak break".
export function getCurrentStreak(dailyMap) {
  let streak = 0
  const cursor = new Date()

  while (true) {
    const dateStr = toDateStr(cursor)
    const pct = dailyMap[dateStr]

    if (pct === undefined) {
      // Allow "today" to be blank (day still in progress) without breaking
      // a streak that was otherwise intact.
      if (dateStr === toDateStr(new Date())) {
        cursor.setDate(cursor.getDate() - 1)
        continue
      }
      break
    }

    if (pct >= STREAK_THRESHOLD) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function getBestStreak(plans) {
  let maxStreak = 0
  let currentStreak = 0
  const threshold = STREAK_THRESHOLD

  const recurringPlans = plans.filter(p => p.recurring)
  const dates = new Set()

  recurringPlans.forEach(plan => {
    ;(plan.history || []).forEach(h => dates.add(h.date))
  })

  const sortedDates = Array.from(dates).sort()

  sortedDates.forEach(dateStr => {
    let dayTotal = 0
    let dayCount = 0

    recurringPlans.forEach(plan => {
      const entry = plan.history?.find(h => h.date === dateStr)
      if (entry) {
        dayTotal += entry.percentage
        dayCount++
      }
    })

    const dayAverage = dayCount > 0 ? Math.round(dayTotal / dayCount) : 0

    if (dayAverage >= threshold) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  })

  return maxStreak
}

export { STREAK_THRESHOLD }
