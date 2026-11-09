import { create } from 'zustand'
import type { ConfirmOptions } from '@/types'

interface ConfirmationState {
  isOpen: boolean
  dialog: ConfirmOptions | null
  lastDialog: ConfirmOptions | null
  resolver: ((value: boolean) => void) | null
  isMounted: boolean
  openConfirmation: (options: ConfirmOptions, resolve: (value: boolean) => void) => void
  confirmAction: () => void
  cancelAction: () => void
  setIsMounted: (isMounted: boolean) => void
}

export const useConfirmationStore = create<ConfirmationState>((set, get) => ({
  isOpen: false,
  dialog: null,
  lastDialog: null,
  resolver: null,
  isMounted: false,

  openConfirmation: (options, resolve) => {
    const current = get()
    if (current.resolver) {
      current.resolver(false)
    }
    set({
      isOpen: true,
      dialog: options,
      lastDialog: options,
      resolver: resolve,
    })
  },

  confirmAction: () => {
    const { resolver } = get()
    if (resolver) {
      resolver(true)
    }
    set({
      isOpen: false,
      dialog: null,
      resolver: null,
    })
  },

  cancelAction: () => {
    const { resolver } = get()
    if (resolver) {
      resolver(false)
    }
    set({
      isOpen: false,
      dialog: null,
      resolver: null,
    })
  },

  setIsMounted: (isMounted) => set({ isMounted }),
}))
