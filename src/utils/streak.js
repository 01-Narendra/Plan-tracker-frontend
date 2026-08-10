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
export function getCurrentStreak(plans) {
  if (!plans || plans.length === 0) return 0

  const threshold = STREAK_THRESHOLD
  const recurringPlans = plans.filter(p => p.recurring)

  if (recurringPlans.length === 0) return 0

  // Collect all dates with their completion percentage
  const dateMap = new Map()

  recurringPlans.forEach(plan => {
    ;(plan.history || []).forEach(h => {
      if (!dateMap.has(h.date)) {
        dateMap.set(h.date, [])
      }
      dateMap.get(h.date).push(h.percentage)
    })
  })

  // Calculate average completion for each day
  const completionByDate = new Map()
  dateMap.forEach((percentages, date) => {
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
    completionByDate.set(date, avg)
  })

  // Sort dates in descending order (newest first)
  const sortedDates = Array.from(completionByDate.keys()).sort().reverse()

  if (sortedDates.length === 0) return 0

  // Check if today is marked as complete
  const today = toDateStr()
  const todayCompletion = completionByDate.get(today)

  // If today has no data, start from yesterday
  let currentStreak = 0
  let startIndex = 0

  if (todayCompletion === undefined) {
    // Today has no data, start counting from yesterday
    startIndex = 0
  } else if (todayCompletion >= threshold) {
    // Today is marked, include it in streak
    currentStreak = 1
    startIndex = 1
  } else {
    // Today is marked but below threshold, streak is broken
    return 0
  }

  // Count consecutive days backwards
  for (let i = startIndex; i < sortedDates.length; i++) {
    const date = sortedDates[i]
    const completion = completionByDate.get(date)

    if (completion >= threshold) {
      currentStreak++
    } else {
      break
    }
  }

  return currentStreak
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
