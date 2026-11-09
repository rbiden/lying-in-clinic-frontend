import { useConfirmation } from './use-confirmation'
import { useSafeMutate } from './use-safe-mutate'

export function useMutationTools() {
  const { confirm } = useConfirmation()
  const { safeMutate } = useSafeMutate()

  return {
    confirm,
    safeMutate,
  }
}
