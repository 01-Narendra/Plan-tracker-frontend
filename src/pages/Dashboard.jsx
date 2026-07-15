import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import PlanCard from '../components/PlanCard.jsx'
import CreatePlanModal from '../components/CreatePlanModal.jsx'
import StreakCalendar from '../components/StreakCalendar.jsx'
import Footer from '../components/Footer.jsx'
import { api } from '../api/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { setToastFunction } from '../api/api.js'


export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const { addToast } = useToast() 

  useEffect(() => {
    setToastFunction(addToast)              
  }, [addToast])

  useEffect(() => {
    if (token) {
      refresh()
    }
  }, [token])

  async function refresh() {
    setLoading(true)
    try {
      const data = await api.plans.getPlans()
      setPlans(data)
    } catch (err) {
      console.error('Failed to fetch plans:', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate({ name, points, recurring }) {
    try {
      await api.plans.createPlan(name, points, recurring)
      addToast('Plan created successfully!', 'success')
      await refresh()
    } catch (err) {
      console.error('Failed to create plan:', err.message)
      alert(err.message)
    }
  }

  async function handleToggle(planId, pointId) {
    try {
      // optimistic update so the checkbox feels instant
      setPlans((prev) =>
        prev.map((p) =>
          p._id !== planId
            ? p
            : {
                ...p,
                points: p.points.map((pt) =>
                  pt._id === pointId ? { ...pt, done: !pt.done } : pt,
                ),
              },
        ),
      )
      await api.points.togglePoint(planId, pointId)
    } catch (err) {
      console.error('Failed to toggle point:', err.message)
      await refresh()
    }
  }

  async function handleAddPoint(planId, text) {
    try {
      await api.points.addPoint(planId, text)
      await refresh()
    } catch (err) {
      console.error('Failed to add point:', err.message)
      alert(err.message)
    }
  }

  async function handleDelete(planId) {
    try {
      if (confirm('Are you sure you want to delete this plan?')) {
        await api.plans.deletePlan(planId)
        addToast('Plan deleted!', 'success')
        await refresh()
      }
    } catch (err) {
      console.error('Failed to delete plan:', err.message)
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ledger-rule bg-ledger-panel/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ledger-ink text-ledger-bg font-display flex items-center justify-center text-sm rotate-[-3deg]">
              L
            </div>
            <h1 className="font-display text-xl font-semibold text-ledger-ink">
              Ledger
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ledger-inkSoft hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-ledger-inkSoft hover:text-ledger-accent transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ledger-ink">
              Your plans
            </h2>
            <p className="font-mono text-xs text-ledger-inkSoft mt-1">
              {plans.length} active
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-ledger-accent text-white font-semibold hover:bg-ledger-accent/90 active:scale-[0.98] transition"
          >
            + Create plan
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            {loading ? (
              <p className="font-mono text-sm text-ledger-inkSoft">Loading…</p>
            ) : plans.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-ledger-rule rounded-2xl">
                <p className="font-display text-lg text-ledger-ink mb-2">
                  No plans yet
                </p>
                <p className="text-sm text-ledger-inkSoft mb-5">
                  Create your first plan and start building a streak.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-ledger-ink text-ledger-bg font-semibold hover:bg-ledger-ink/90 transition"
                >
                  + Create plan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onToggle={handleToggle}
                    onAddPoint={handleAddPoint}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <StreakCalendar plans={plans} token={token} />
          </div>
        </div>
      </main>

      {modalOpen && (
        <CreatePlanModal
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}

      <Footer />
    </div>
  )
}
