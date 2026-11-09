import type {
  FieldError,
  FieldValues,
  PathValue,
  RegisterOptions,
  SetValueConfig,
  UseFormRegisterReturn,
} from 'react-hook-form'
import { nestedObjValue } from '@/helpers'
import { useSafeFormContext } from './use-safe-form-context'

export interface UseFormFieldOptions {
  useForm?: boolean
  rules?: RegisterOptions<FieldValues, string>
}

export function useFormField<TValue = unknown>(
  name?: string,
  { useForm: enabled = true, rules }: UseFormFieldOptions = {},
) {
  const context = useSafeFormContext()
  const form = enabled && context ? context : null
  const isConnected = Boolean(form && name)

  const registeredProps: Partial<UseFormRegisterReturn> =
    form && name ? form.register(name, rules) : {}

  const fieldError = (form && name ? nestedObjValue(form.formState.errors, name) : null) as
    | FieldError
    | null
    | undefined
  const errorMessage = fieldError?.message
  const isDirty = form && name ? Boolean(nestedObjValue(form.formState.dirtyFields, name)) : false
  const isTouched = form && name ? Boolean(nestedObjValue(form.formState.touchedFields, name)) : false

  const value = (form && name ? form.watch(name) : undefined) as TValue | undefined

  const setValue = (next: TValue, options?: SetValueConfig) => {
    if (!form || !name) return
    form.setValue(name, next as PathValue<FieldValues, string>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
      ...options,
    })
  }

  return {
    form,
    isConnected,
    registeredProps,
    onChange: registeredProps.onChange,
    onBlur: registeredProps.onBlur,
    errorMessage,
    hasError: Boolean(errorMessage),
    isDirty,
    isTouched,
    value,
    setValue,
  }
}
