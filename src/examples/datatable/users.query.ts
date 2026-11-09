import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getExampleUsers } from './users.service'
import type { MockScenario, UserTableRequest } from './users.service'

export function useExampleUsersQuery(
  request: UserTableRequest,
  scenario: MockScenario,
  enabled: boolean,
) {
  const query = useQuery({
    queryKey: ['datatable-example', request.queryIdentity, scenario],
    queryFn: ({ signal }) => getExampleUsers(request, scenario, signal),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
  })
  const previous = useRef<
    Awaited<ReturnType<typeof getExampleUsers>> | undefined
  >(undefined)
  useEffect(() => {
    if (query.isSuccess && !query.isPlaceholderData)
      previous.current = query.data
  }, [query.isSuccess, query.isPlaceholderData, query.data])
  // Query placeholder data disappears on a new-key failure; retain the last success explicitly.
  return { ...query, data: query.data ?? previous.current }
}
