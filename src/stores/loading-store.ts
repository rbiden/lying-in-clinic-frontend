import { create } from 'zustand'

export interface LoadingStore {
  pendingCount: number
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  pendingCount: 0,
  isLoading: false,
  showLoading: () =>
    set((state) => ({
      pendingCount: state.pendingCount + 1,
      isLoading: true,
    })),
  hideLoading: () =>
    set((state) => {
      const next = Math.max(0, state.pendingCount - 1)
      return {
        pendingCount: next,
        isLoading: next > 0,
      }
    }),
}))
