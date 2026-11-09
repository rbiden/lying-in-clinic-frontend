import { queryClient } from '#/lib/query-client'
import { useAuthStore } from './auth.store'
import { authKeys } from './auth.session'

export function useSession() {
  const state = useAuthStore()

  const retry = () => {
    useAuthStore.setState({ status: 'checking' })
    void queryClient.refetchQueries({ queryKey: authKeys.me(), exact: true })
  }

  return { ...state, retry }
}
