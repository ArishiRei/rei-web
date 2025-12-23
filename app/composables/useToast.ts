import { useToastStore } from '../stores/toast'

export const useToast = () => {
  const store = useToastStore()

  return {
    info: (text: string, duration?: number) => store.add(text, 'info', duration),
    success: (text: string, duration?: number) => store.add(text, 'success', duration),
    warning: (text: string, duration?: number) => store.add(text, 'warning', duration),
    error: (text: string, duration?: number) => store.add(text, 'error', duration),
  }
}
