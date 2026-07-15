import React, { useState } from 'react'

export default function CreatePlanModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [points, setPoints] = useState([''])
  const [recurring, setRecurring] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updatePoint(index, value) {
    setPoints((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  function addPointField() {
    setPoints((prev) => [...prev, ''])
  }

  function removePointField(index) {
    setPoints((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    const cleanPoints = points.map((p) => p.trim()).filter(Boolean)

    if (!trimmedName) {
      setError('Give your plan a name.')
      return
    }
    if (cleanPoints.length === 0) {
      setError('Add at least one plan point.')
      return
    }

    setSubmitting(true)
    try {
      await onCreate({ name: trimmedName, points: cleanPoints, recurring })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ledger-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ledger-ink">
            New plan
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ledger-rule/50 text-ledger-inkSoft transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2">
              Plan name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Routine"
              className="w-full px-4 py-2.5 rounded-lg border border-ledger-rule bg-white/60 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
            />
          </div>

          <div className="mb-4">
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2">
              Plan points
            </label>
            <div className="space-y-2">
              {points.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ledger-inkSoft w-5 text-right">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    placeholder="e.g. Drink a glass of water"
                    className="flex-1 px-3 py-2 rounded-lg border border-ledger-rule bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
                  />
                  {points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePointField(index)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-ledger-inkSoft hover:bg-ledger-rule/50 hover:text-ledger-accent transition"
                      aria-label="Remove point"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPointField}
              className="mt-3 text-sm font-medium text-ledger-accent hover:underline"
            >
              + Add another point
            </button>
          </div>

          <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="w-4 h-4 accent-ledger-accent"
            />
            <span className="text-sm text-ledger-inkSoft">
              Repeat this plan daily (resets checkmarks every new day)
            </span>
          </label>

          {error && (
            <p className="text-sm text-ledger-accent font-medium mb-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-ledger-rule text-ledger-ink font-medium hover:bg-ledger-rule/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-ledger-ink text-ledger-bg font-semibold hover:bg-ledger-ink/90 transition disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
