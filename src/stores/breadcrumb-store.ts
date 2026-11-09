import { create } from 'zustand'

interface BreadcrumbState {
  labels: Record<string, string>
  owners: Record<string, symbol>
  setLabel: (path: string, label: string, owner: symbol) => void
  clearLabel: (path: string, owner: symbol) => void
}

/** Temporary display labels only; fetched records stay in their existing query cache. */
export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  labels: {},
  owners: {},
  setLabel: (path, label, owner) =>
    set((state) => ({
      labels: { ...state.labels, [path]: label },
      owners: { ...state.owners, [path]: owner },
    })),
  clearLabel: (path, owner) =>
    set((state) => {
      // A previous view's cleanup must not remove a newer view's label.
      if (state.owners[path] !== owner) return state
      const labels = { ...state.labels }
      const owners = { ...state.owners }
      delete labels[path]
      delete owners[path]
      return { labels, owners }
    }),
}))
