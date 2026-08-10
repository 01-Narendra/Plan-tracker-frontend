export function toDateStr(date = new Date()) {
  try {
    if (!date || !(date instanceof Date)) {
      date = new Date()
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error converting date:', error)
    return new Date().toISOString().split('T')[0]
  }
}

export function calcPercentage(points) {
  try {
    if (!points || !Array.isArray(points) || points.length === 0) {
      return 0
    }
    const completed = points.filter(p => p && p.done).length
    return Math.round((completed / points.length) * 100)
  } catch (error) {
    console.error('Error calculating percentage:', error)
    return 0
  }
}
