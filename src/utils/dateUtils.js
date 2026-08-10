export function extractAvailableMonthsAndYears(plans) {
  try {
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return {
        years: [],
        monthsForYear: () => [],
        currentYear: new Date().getFullYear(),
      }
    }

    const dates = new Set()

    plans.forEach(plan => {
      if (!plan) return
      const history = Array.isArray(plan.history) ? plan.history : []

      history.forEach(entry => {
        if (entry && typeof entry.date === 'string') {
          dates.add(entry.date)
        }
      })
    })

    const monthYearMap = new Map()

    Array.from(dates).forEach(dateStr => {
      try {
        const date = new Date(dateStr + 'T00:00:00')
        if (isNaN(date.getTime())) return

        const year = date.getFullYear()
        const month = date.getMonth()

        const key = `${year}-${month}`
        if (!monthYearMap.has(key)) {
          monthYearMap.set(key, { year, month })
        }
      } catch (e) {
        console.error('Date parse error:', e)
      }
    })

    const years = Array.from(new Set(Array.from(monthYearMap.values()).map(m => m.year))).sort((a, b) => b - a)

    const currentYear = new Date().getFullYear()

    const monthsForYear = (year) => {
      const months = Array.from(monthYearMap.values())
        .filter(m => m.year === year)
        .map(m => m.month)
        .sort((a, b) => b - a)

      return months.map(monthIndex => ({
        value: monthIndex,
        label: new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long' }),
      }))
    }

    return {
      years: years.length > 0 ? years : [currentYear],
      monthsForYear,
      currentYear,
    }
  } catch (error) {
    console.error('Error in extractAvailableMonthsAndYears:', error)
    return {
      years: [new Date().getFullYear()],
      monthsForYear: () => [],
      currentYear: new Date().getFullYear(),
    }
  }
}

export function getChartDataForMonthYear(plans, year, month) {
  try {
    if (!plans || !Array.isArray(plans)) return []
    if (typeof year !== 'number' || typeof month !== 'number') return []

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const data = []

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayData = { date: day }

      plans.forEach(plan => {
        if (!plan || !plan.recurring) return
        const history = Array.isArray(plan.history) ? plan.history : []

        const entry = history.find(h => h && h.date === dateStr)
        if (entry && typeof entry.percentage === 'number') {
          dayData[plan.name] = entry.percentage
        }
      })

      if (Object.keys(dayData).length > 1) {
        data.push(dayData)
      }
    }

    return data
  } catch (error) {
    console.error('Error in getChartDataForMonthYear:', error)
    return []
  }
}