import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { getCurrentStreak, getDailyCompletionMap, STREAK_THRESHOLD, getBestStreak } from '../utils/streak.js'
import { api } from '../api/api.js'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toDateStr(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export default function StreakCalendar({ plans }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [dailyMap, setDailyMap] = useState({})
  const [threshold, setThreshold] = useState(75)

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await api.plans.getDailyStats()
        setDailyMap(stats.dailyCompletion || {})
        setThreshold(stats.threshold || 50)
      } catch (err) {
        console.error('Failed to fetch daily stats:', err.message)
      }
    }
    fetchStats()
  }, [plans])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateStr(new Date())

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  function dayStatus(day) {
    const dateStr = toDateStr(new Date(year, month, day))
    const pct = dailyMap[dateStr]
    if (pct === undefined) return { state: 'empty', pct: null }
    return { state: pct >= threshold ? 'hit' : 'missed', pct }
  }

  function changeMonth(delta) {
    setViewDate(new Date(year, month + delta, 1))
  }

  const streak = useMemo(() => getCurrentStreak(dailyMap), [dailyMap])
  const bestStreak = useMemo(() => getBestStreak(plans), [plans])


  return (
    <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-5">
      <div className="flex items-center mb-5">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkSoft">Current</p>
            <div className="flex items-center gap-1">
              <Flame
                size={18}
                className={streak > 0 ? 'text-ledger-accent' : 'text-ledger-inkSoft'}
                fill={streak > 0 ? 'currentColor' : 'none'}
              />
              <span className="font-display text-lg font-semibold text-ledger-accent">{streak}</span>
            </div>
            
          </div>
          <div className="w-px h-8 bg-ledger-rule"></div>
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-success">Best</p>
            <div className="flex items-center gap-2">
              <Flame
                size={18}
                className={streak > 0 ? 'text-ledger-accent' : 'text-ledger-inkSoft'}
                fill={streak > 0 ? 'currentColor' : 'none'}
              />
              <span className="font-display text-lg font-semibold text-ledger-success">{bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => changeMonth(-1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-ledger-rule/50 text-ledger-inkSoft transition"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-mono font-bold text-xs uppercase tracking-widest text-ledger-inkSoft">
          {monthLabel}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-ledger-rule/50 text-ledger-inkSoft transition"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="text-center font-mono text-[10px] text-ledger-inkSoft/70 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />

          const dateStr = toDateStr(new Date(year, month, day))
          const { state, pct } = dayStatus(day)
          const isToday = dateStr === todayStr

          const base =
            'aspect-square flex items-center justify-center rounded-md font-mono text-[11px] transition'
          const stateClasses =
            state === 'hit'
              ? 'bg-ledger-success text-white font-semibold'
              : state === 'missed'
              ? 'bg-ledger-accentSoft text-ledger-accent'
              : 'bg-ledger-rule/25 text-ledger-inkSoft/60'

          return (
            <div
              key={idx}
              title={pct !== null ? `${pct}% complete` : 'No data'}
              className={`${base} ${stateClasses} ${
                isToday ? 'ring-2 ring-ledger-ink ring-offset-1 ring-offset-ledger-panel' : ''
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-ledger-rule">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-ledger-success" />
          <span className="font-mono text-[10px] text-ledger-inkSoft">
            ≥{threshold}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-ledger-accentSoft" />
          <span className="font-mono text-[10px] text-ledger-inkSoft">
            &lt;{threshold}%
          </span>
        </div>
      </div>
    </div>
  )
}
