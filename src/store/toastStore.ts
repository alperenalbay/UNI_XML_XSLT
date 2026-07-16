import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  description?: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const duration = toast.duration || (toast.type === 'error' ? 5000 : 3000)
    
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, duration }]
    }))

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, duration)
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  },
  clearToasts: () => {
    set({ toasts: [] })
  }
}))

// Helper hook for easier usage in components
export function useToast() {
  const { addToast } = useToastStore()

  return {
    addToast,
    error: (message: string, description?: string) =>
      addToast({ message, type: 'error', description, duration: 5000 }),
    success: (message: string, description?: string) =>
      addToast({ message, type: 'success', description, duration: 3000 }),
    info: (message: string, description?: string) =>
      addToast({ message, type: 'info', description, duration: 4000 }),
    warning: (message: string, description?: string) =>
      addToast({ message, type: 'warning', description, duration: 4000 })
  }
}
