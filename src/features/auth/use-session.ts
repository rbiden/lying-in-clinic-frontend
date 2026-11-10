import { retrySessionReconciliation } from '#/lib/axios'
import { useAuthStore } from './auth.store'

export function useSession() {
  const state = useAuthStore()

  const retry = () => {
    void retrySessionReconciliation().catch(() => {})
  }

  return { ...state, retry }
}
