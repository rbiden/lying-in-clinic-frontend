const ALLOWED_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
])

export function isAllowedInputKey(key: string, ctrlOrMeta: boolean): boolean {
  if (ctrlOrMeta) return true
  if (ALLOWED_KEYS.has(key)) return true
  return /^[0-9.]$/.test(key)
}

export function shouldBlockGradeDot(key: string, currentValue: string): boolean {
  return key === '.' && currentValue.includes('.')
}

export function cleanGradeValue(value: string): string {
  const parts = value.replace(/[^0-9.]/g, '').split('.')
  const integerPart = parts[0] === '100' ? '100' : (parts[0] || '').slice(0, 2)
  if (parts.length > 1) {
    const decimalPart = parts.slice(1).join('').slice(0, 2)
    return `${integerPart}.${decimalPart}`
  }
  return integerPart
}

export function cleanNumbersOnlyValue(value: string): string {
  return value.replace(/[^0-9.]/g, '')
}
