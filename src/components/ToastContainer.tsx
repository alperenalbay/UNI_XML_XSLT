import { AlertTriangle, X, Check, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '../store/toastStore'
import type { Toast } from '../store/toastStore'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const bgColor = {
    error: 'bg-red-950/95 border-red-900 text-red-100',
    success: 'bg-emerald-950/95 border-emerald-900 text-emerald-100',
    info: 'bg-blue-950/95 border-blue-900 text-blue-100',
    warning: 'bg-amber-950/95 border-amber-900 text-amber-100',
  }[toast.type]

  const Icon = {
    error: AlertTriangle,
    success: Check,
    info: Info,
    warning: AlertCircle,
  }[toast.type]

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${bgColor} animate-slide-in shadow-lg backdrop-blur-sm pointer-events-auto`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.message}</p>
        {toast.description && (
          <p className="text-xs opacity-90 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-current hover:opacity-75 transition flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Re-export the hook and store for backward compatibility
export { useToast, useToastStore } from '../store/toastStore'
export type { Toast } from '../store/toastStore'
