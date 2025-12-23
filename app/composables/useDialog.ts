import { useDialogStore, type DialogOptions } from '../stores/dialog'

export const useDialog = () => {
  const store = useDialogStore()

  return {
    confirm: (options: DialogOptions) => store.open(options),
    alert: (content: string, title?: string) =>
      store.open({
        content,
        title,
        confirmText: 'OK',
        cancelText: '', // Hide cancel button
      }),
  }
}
