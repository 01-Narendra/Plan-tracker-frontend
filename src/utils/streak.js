import { toDateStr } from './validation.js'

export const STREAK_THRESHOLD = 75

export function getDailyCompletionMap(plans) {
  try {
    if (!plans || !Array.isArray(plans) || plans.length === 0) return {}

    const recurringPlans = plans.filter(p => p && p.recurring)
    if (recurringPlans.length === 0) return {}

    const dailyMap = {}

    recurringPlans.forEach(plan => {
      if (!plan) return
      const history = Array.isArray(plan.history) ? plan.history : []

      history.forEach(h => {
        if (!h || typeof h.date !== 'string') return
        if (typeof h.percentage !== 'number') return

        if (!dailyMap[h.date]) {
          dailyMap[h.date] = []
        }
        dailyMap[h.date].push(h.percentage)
      })
    })

    const result = {}
    Object.entries(dailyMap).forEach(([date, percentages]) => {
      if (Array.isArray(percentages) && percentages.length > 0) {
        result[date] = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
      }
    })

    return result
  } catch (error) {
    console.error('Error in getDailyCompletionMap:', error)
    return {}
  }
}

export function getCurrentStreak(plans) {
  try {
    if (!plans || !Array.isArray(plans) || plans.length === 0) return 0

    const threshold = STREAK_THRESHOLD || 50
    const recurringPlans = plans.filter(p => p && p.recurring)

    if (recurringPlans.length === 0) return 0

    const dateMap = new Map()

    recurringPlans.forEach(plan => {
      if (!plan) return
      const history = Array.isArray(plan.history) ? plan.history : []

      history.forEach(h => {
        if (!h || typeof h.date !== 'string') return
        if (typeof h.percentage !== 'number') return

        if (!dateMap.has(h.date)) {
          dateMap.set(h.date, [])
        }
        dateMap.get(h.date).push(h.percentage)
      })
    })

    const completionByDate = new Map()
    dateMap.forEach((percentages, date) => {
      if (Array.isArray(percentages) && percentages.length > 0) {
        const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
        completionByDate.set(date, avg)
      }
    })

    const sortedDates = Array.from(completionByDate.keys()).sort().reverse()

    if (sortedDates.length === 0) return 0

    const today = toDateStr()
    const todayCompletion = completionByDate.get(today)

    let currentStreak = 0
    let startIndex = 0

    if (todayCompletion === undefined) {
      startIndex = 0
    } else if (todayCompletion >= threshold) {
      currentStreak = 1
      startIndex = 1
    } else {
      return 0
    }

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
  } catch (error) {
    console.error('Error in getCurrentStreak:', error)
    return 0
  }
}

export function getBestStreak(plans) {
  try {
    if (!plans || !Array.isArray(plans) || plans.length === 0) return 0

    let maxStreak = 0
    let currentStreak = 0
    const threshold = STREAK_THRESHOLD || 50

    const recurringPlans = plans.filter(p => p && p.recurring)
    if (recurringPlans.length === 0) return 0

    const dates = new Set()

    recurringPlans.forEach(plan => {
      if (!plan) return
      const history = Array.isArray(plan.history) ? plan.history : []

      history.forEach(h => {
        if (h && typeof h.date === 'string') {
          dates.add(h.date)
        }
      })
    })

    const sortedDates = Array.from(dates).sort()

    sortedDates.forEach(dateStr => {
      let dayTotal = 0
      let dayCount = 0

      recurringPlans.forEach(plan => {
        if (!plan) return
        const history = Array.isArray(plan.history) ? plan.history : []

        const entry = history.find(h => h && h.date === dateStr)
        if (entry && typeof entry.percentage === 'number') {
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
  } catch (error) {
    console.error('Error in getBestStreak:', error)
    return 0
  }
}