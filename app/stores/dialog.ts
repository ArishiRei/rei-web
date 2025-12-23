import { defineStore } from 'pinia'

export interface DialogOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  persistent?: boolean
}

interface DialogInstance extends DialogOptions {
  id: string
  resolve: (value: boolean) => void
}

export const useDialogStore = defineStore('dialog', () => {
  const dialogs = ref<DialogInstance[]>([])

  const open = (options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID()
      dialogs.value.push({ ...options, id, resolve })
    })
  }

  const close = (id: string, result: boolean) => {
    const index = dialogs.value.findIndex((d) => d.id === id)
    if (index !== -1) {
      const dialog = dialogs.value[index]
      dialog.resolve(result)
      dialogs.value.splice(index, 1)
    }
  }

  return { dialogs, open, close }
})
