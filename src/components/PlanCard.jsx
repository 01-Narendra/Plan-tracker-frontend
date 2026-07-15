import React, { useState } from 'react'
import ProgressRing from './ProgressRing.jsx'
import TrendChart from './TrendChart.jsx'
import MotivationBanner from './MotivationBanner.jsx'
import {
  calcPercentage,
  completedYesterday,
  trendDirection,
} from '../utils/api.js'

const TREND_ICON = { up: '↑', down: '↓', flat: '→' }
const TREND_COLOR = {
  up: 'text-ledger-success',
  down: 'text-ledger-accent',
  flat: 'text-ledger-inkSoft',
}

export default function PlanCard({ plan, onToggle, onAddPoint, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [newPointText, setNewPointText] = useState('')
  const [addingPoint, setAddingPoint] = useState(false)

  const percentage = calcPercentage(plan.points)
  const trend = trendDirection(plan)
  const showQuote = plan.recurring && completedYesterday(plan)

  async function handleAddPoint(e) {
    e.preventDefault()
    const text = newPointText.trim()
    if (!text) return
    setAddingPoint(true)
    try {
      await onAddPoint(plan._id, text)
      setNewPointText('')
    } finally {
      setAddingPoint(false)
    }
  }

  return (
    <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <ProgressRing percentage={percentage} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-ledger-ink truncate">
              {plan.name}
            </h3>
            {plan.recurring && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkSoft bg-ledger-rule/40 px-2 py-0.5 rounded-full">
                Daily
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-ledger-inkSoft mt-1">
            {plan.points.filter((p) => p.done).length}/{plan.points.length} points done
            <span className={`ml-2 font-semibold ${TREND_COLOR[trend]}`}>
              {TREND_ICON[trend]} {trend}
            </span>
          </p>
        </div>

        <span
          className={`text-ledger-inkSoft transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="border-t border-ledger-rule px-5 py-5">
          {showQuote && <MotivationBanner planId={plan._id} />}

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Left: checklist */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-3">
                Today's checklist
              </p>
              <ul className="space-y-2">
                {plan.points.map((point) => (
                  <li key={point._id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={point.done}
                        onChange={() => onToggle(plan._id, point._id)}
                        className="w-4 h-4 accent-ledger-success shrink-0"
                      />
                      <span
                        className={`text-sm transition ${
                          point.done
                            ? 'line-through text-ledger-inkSoft'
                            : 'text-ledger-ink'
                        }`}
                      >
                        {point.text}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleAddPoint} className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={newPointText}
                  onChange={(e) => setNewPointText(e.target.value)}
                  placeholder="Add another point…"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-ledger-rule bg-white/60 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
                />
                <button
                  type="submit"
                  disabled={addingPoint}
                  className="px-3 py-2 text-sm rounded-lg bg-ledger-ink text-ledger-bg font-medium hover:bg-ledger-ink/90 transition disabled:opacity-60"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Right: trend graph, right where the plan is listed */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-3">
                Completion trend
              </p>
              <div className="bg-white/50 border border-ledger-rule rounded-xl">
                <TrendChart history={plan.history} />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onDelete(plan._id)}
              className="text-xs font-mono uppercase tracking-widest text-ledger-inkSoft hover:text-ledger-accent transition"
            >
              Delete plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
