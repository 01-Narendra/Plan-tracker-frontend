import React, { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { getCurrentStreak, getDailyCompletionMap, STREAK_THRESHOLD, getBestStreak } from '../utils/streak.js'
import DateDetailsPopup from './DateDetailsPopup.jsx'
import { api } from '../api/api.js'

export default function StreakCalendar({ plans }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [dailyMap, setDailyMap] = useState({})
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [threshold, setThreshold] = useState(50)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedPlanData, setSelectedPlanData] = useState(null)

  // Safety check
  const safePlans = Array.isArray(plans) ? plans : []

  useEffect(() => {
    if (safePlans.length === 0) {
      setDailyMap({})
      setStreak(0)
      setBestStreak(0)
      return
    }

    try {
      const map = getDailyCompletionMap(safePlans)
      setDailyMap(map || {})
      setStreak(getCurrentStreak(safePlans) || 0)
      setBestStreak(getBestStreak(safePlans) || 0)
      setThreshold(STREAK_THRESHOLD || 50)
    } catch (error) {
      console.error('Error updating streak data:', error)
      setDailyMap({})
      setStreak(0)
      setBestStreak(0)
    }
  }, [safePlans])

  function handleDateClick(dateStr) {
    try {
      if (!dailyMap || !dailyMap[dateStr]) return

      const planWithData = safePlans.find(p => {
        if (!p || !p.recurring) return false
        const history = Array.isArray(p.history) ? p.history : []
        const historyEntry = history.find(h => h && h.date === dateStr)
        return !!historyEntry
      })

      if (planWithData) {
        const history = Array.isArray(planWithData.history) ? planWithData.history : []
        const historyEntry = history.find(h => h && h.date === dateStr)
        setSelectedPlanData({
          date: dateStr,
          planName: planWithData.name || 'Unknown Plan',
          points: (historyEntry && Array.isArray(historyEntry.points)) ? historyEntry.points : [],
        })
        setSelectedDate(dateStr)
      }
    } catch (error) {
      console.error('Error clicking date:', error)
    }
  }

  // Rest of component stays the same
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <>
      <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame size={18} className={streak > 0 ? 'text-ledger-accent' : 'text-ledger-inkSoft'} fill={streak > 0 ? 'currentColor' : 'none'} />
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkSoft">Current</p>
                <span className="font-display text-lg font-semibold text-ledger-accent">{streak}</span>
              </div>
              <div className="w-px h-8 bg-ledger-rule"></div>
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-success">Best</p>
                <span className="font-display text-lg font-semibold text-ledger-success">{bestStreak}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewDate(new Date(year, month - 1))} className="p-2 hover:bg-ledger-rule/50 rounded-lg">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setViewDate(new Date())} className="px-3 py-2 text-sm font-semibold hover:bg-ledger-rule/50 rounded-lg">
              {new Date(year, month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </button>
            <button onClick={() => setViewDate(new Date(year, month + 1))} className="p-2 hover:bg-ledger-rule/50 rounded-lg">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center font-mono text-[10px] uppercase text-ledger-inkSoft py-2">
              {d}
            </div>
          ))}

          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const pct = dailyMap ? dailyMap[dateStr] : null
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

            let stateClasses = 'text-ledger-ink'
            if (pct === undefined) {
              stateClasses = 'bg-white text-ledger-inkSoft'
            } else if (pct >= 75) {
              stateClasses = 'bg-ledger-success text-white'
            } else if (pct >= 50) {
              stateClasses = 'bg-ledger-successSoft text-ledger-success'
            } else {
              stateClasses = 'bg-ledger-accentSoft text-ledger-accent'
            }

            const base = 'h-10 flex items-center justify-center rounded-lg font-semibold text-sm border border-ledger-rule'

            return (
              <div
                key={day}
                onClick={() => handleDateClick(dateStr)}
                title={pct !== null ? `${pct}% complete` : 'No data'}
                className={`${base} ${stateClasses} ${isToday ? 'ring-2 ring-ledger-ink ring-offset-1 ring-offset-ledger-panel' : ''} ${pct !== undefined ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {selectedDate && selectedPlanData && (
        <DateDetailsPopup
          date={selectedDate}
          planName={selectedPlanData.planName}
          points={selectedPlanData.points}
          onClose={() => {
            setSelectedDate(null)
            setSelectedPlanData(null)
          }}
        />
      )}
    </>
  )
}