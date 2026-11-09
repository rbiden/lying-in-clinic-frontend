import { useCallback } from 'react'
import { useConfirmationStore } from '@/stores'
import type { ConfirmOptions } from '@/types'

let hasWarnedUnmounted = false

export function useConfirmation() {
  const openConfirmation = useConfirmationStore((state) => state.openConfirmation)

  const confirm = useCallback(
    (options: ConfirmOptions = {}): Promise<boolean> => {
      if (process.env.NODE_ENV !== 'production') {
        const isMounted = useConfirmationStore.getState().isMounted
        if (!isMounted && !hasWarnedUnmounted) {
          hasWarnedUnmounted = true
          console.warn('confirm() called while <ConfirmationDialog /> is not mounted.')
        }
      }

      return new Promise<boolean>((resolve) => {
        openConfirmation(options, resolve)
      })
    },
    [openConfirmation],
  )

  return { confirm }
}
