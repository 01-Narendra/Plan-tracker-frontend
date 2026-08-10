export function extractAvailableMonthsAndYears(plans) {
  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return {
      years: [],
      monthsForYear: () => [],
      currentYear: new Date().getFullYear(),
    }
  }
  
  const dates = new Set()

  plans.forEach(plan => {
    if (!plan || !plan.history) return
    if (!Array.isArray(plan.history)) return

    plan.history.forEach(entry => {
      if (entry && entry.date) {
        dates.add(entry.date)
      }
    })
  })

  const monthYearMap = new Map()

  Array.from(dates).forEach(dateStr => {
    const date = new Date(dateStr + 'T00:00:00')
    const year = date.getFullYear()
    const month = date.getMonth()

    const key = `${year}-${month}`
    if (!monthYearMap.has(key)) {
      monthYearMap.set(key, { year, month })
    }
  })

  // Get unique years
  const years = Array.from(new Set(Array.from(monthYearMap.values()).map(m => m.year))).sort((a, b) => b - a)

  // Get months for current year
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
    years,
    monthsForYear,
    currentYear,
  }
}

export function filterDataByMonthYear(plans, year, month) {
  const filteredData = []

  plans.forEach(plan => {
    if (!plan.history) return

    const monthData = plan.history.filter(entry => {
      const date = new Date(entry.date + 'T00:00:00')
      return date.getFullYear() === year && date.getMonth() === month
    })

    if (monthData.length > 0) {
      filteredData.push({
        date: plan.name,
        ...Object.fromEntries(
          monthData.map(d => [
            new Date(d.date + 'T00:00:00').getDate(),
            d.percentage,
          ])
        ),
      })
    }
  })

  return filteredData
}

export function getChartDataForMonthYear(plans, year, month) {
  // Safety check
  if (!plans || !Array.isArray(plans)) return []

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const data = []

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayData = { date: day }

    plans.forEach(plan => {
      if (!plan || !plan.recurring) return
      const history = plan.history || []
      if (!Array.isArray(history)) return

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
}


