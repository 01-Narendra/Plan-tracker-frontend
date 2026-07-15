// src/components/Toast.jsx
import React from 'react'
import { X, Check, AlertCircle, Info } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'

const ICONS = {
  success: Check,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const COLORS = {
  success: 'bg-ledger-successSoft border-ledger-success text-ledger-success',
  error: 'bg-red-50 border-red-300 text-red-700',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  info: 'bg-blue-50 border-blue-300 text-blue-700',
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={`border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2 ${COLORS[toast.type]}`}
          >
            <Icon size={20} className="mt-0.5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
