export function nestedObjValue(obj: unknown, path?: string): unknown {
  if (!obj || typeof obj !== 'object' || !path) return undefined
  const parts = path.split('.')
  let current: any = obj
  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }
  return current
}

export function sanitize(value: string): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[<>]/g, '')
}
