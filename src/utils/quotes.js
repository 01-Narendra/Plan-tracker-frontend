export const DISCIPLINE_QUOTES = [
  "Yesterday you finished what you started. That's the whole game — do it again today.",
  'Discipline is just a promise you keep to yourself when no one is watching. You kept it.',
  "Consistency compounds quietly. Yesterday's 100% is today's foundation.",
  'You showed up completely yesterday. Today only asks for the same.',
  'Motivation fades, systems remain. You proved your system works — run it back.',
  "A streak isn't luck, it's a decision repeated. Decide again.",
  'The days you finish are the days that add up. Keep stacking them.',
]

export function pickDailyQuote(seed = new Date().toISOString().slice(0, 10)) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return DISCIPLINE_QUOTES[hash % DISCIPLINE_QUOTES.length]
}
