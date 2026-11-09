import { useFormContext } from 'react-hook-form'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export function useSafeFormContext<
  TFieldValues extends FieldValues = FieldValues,
>(): UseFormReturn<TFieldValues> | null {
  try {
    return useFormContext<TFieldValues>()
  } catch {
    return null
  }
}
