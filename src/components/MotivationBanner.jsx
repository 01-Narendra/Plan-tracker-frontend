import React from 'react'
import { pickDailyQuote } from '../utils/quotes.js'

export default function MotivationBanner({ planId }) {
  const quote = pickDailyQuote(`${planId}-${new Date().toISOString().slice(0, 10)}`)

  return (
    <div className="flex items-start gap-3 bg-ledger-successSoft border border-ledger-success/30 rounded-xl px-4 py-3 mt-3">
      <span className="text-lg leading-none">🔥</span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-success font-semibold">
          Yesterday: 100% complete
        </p>
        <p className="font-body text-sm text-ledger-ink mt-1 leading-snug">
          {quote}
        </p>
      </div>
    </div>
  )
}
