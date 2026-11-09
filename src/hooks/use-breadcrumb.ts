import { useEffect } from 'react'
import { useMatches } from 'react-router'
import { useBreadcrumbStore } from '#/stores/breadcrumb-store'
import { normalizeBreadcrumbPath } from '#/routes/breadcrumbs'

/** Publish an existing query's label for this view, clearing it on change/unmount. */
export function useBreadcrumb(label: string | null | undefined) {
  const matches = useMatches()
  const matchedPath = matches.at(-1)?.pathname
  const path = matchedPath ? normalizeBreadcrumbPath(matchedPath) : undefined
  const setLabel = useBreadcrumbStore((state) => state.setLabel)
  const clearLabel = useBreadcrumbStore((state) => state.clearLabel)

  useEffect(() => {
    if (!path || !label) return
    const owner = Symbol('breadcrumb')
    setLabel(path, label, owner)
    return () => clearLabel(path, owner)
  }, [path, label, setLabel, clearLabel])
}
