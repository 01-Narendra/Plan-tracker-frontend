import React from 'react'
import { X, Check, X as XIcon } from 'lucide-react'

export default function DateDetailsPopup({ date, planName, points, onClose }) {
  const completed = points?.filter(p => p.done).length || 0
  const total = points?.length || 0
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ledger-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft">{date}</p>
            <h3 className="font-display text-lg font-semibold text-ledger-ink mt-1">{planName}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ledger-rule/50">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-white/60 rounded-lg">
          <p className="font-mono text-sm font-semibold text-ledger-ink">
            {completed}/{total} completed ({percentage}%)
          </p>
          <div className="w-full bg-ledger-rule rounded-full h-2 mt-2">
            <div className="bg-ledger-success rounded-full h-2 transition-all" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {points && points.length > 0 ? (
            points.map((point) => (
              <div key={point._id} className="flex items-center gap-3 p-2 rounded-lg border border-ledger-rule/50">
                {point.done ? (
                  <Check size={18} className="text-ledger-success flex-shrink-0" />
                ) : (
                  <XIcon size={18} className="text-ledger-accent flex-shrink-0" />
                )}
                <span className={`text-sm ${point.done ? 'line-through text-ledger-inkSoft' : 'text-ledger-ink'}`}>
                  {point.text}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-ledger-inkSoft text-center py-4">No data for this date</p>
          )}
        </div>
      </div>
    </div>
  )
}