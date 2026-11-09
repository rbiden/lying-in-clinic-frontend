import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 300,
): ((...args: TArgs) => void) & { cancel: () => void } {
  const fnRef = useRef(fn)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    fnRef.current = fn
  })

  useEffect(() => () => clearTimeout(timer.current), [])

  const cancel = useCallback(() => clearTimeout(timer.current), [])
  const callback = useCallback(
    (...args: TArgs) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay],
  )
  return Object.assign(callback, { cancel })
}
