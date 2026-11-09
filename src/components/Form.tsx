import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
  DefaultValues,
  FieldErrors,
  FieldValues,
  Mode,
  Path,
  PathValue,
  Resolver,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import type { ZodType } from 'zod'

export interface FormProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'children'> {
  children?: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode)
  onSubmit: SubmitHandler<TFieldValues>
  onSuccess?: (form: UseFormReturn<TFieldValues>) => void
  onFailed?: (errors: FieldErrors<TFieldValues>) => void
  schema?: ZodType<any, any, any>
  defaultValues?: DefaultValues<TFieldValues>
  mode?: Mode
  debounce?: number | null
  relatedKeys?: Record<string, string | string[]>
  customResolver?: Resolver<TFieldValues>
}

export const Form = <TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  onSuccess,
  onFailed,
  schema,
  defaultValues = {} as DefaultValues<TFieldValues>,
  mode = 'onSubmit',
  debounce = null,
  relatedKeys = {},
  customResolver,
  ...props
}: FormProps<TFieldValues>) => {
  const form = useForm<TFieldValues>({
    resolver: customResolver ?? (schema ? zodResolver(schema) : undefined),
    defaultValues,
    mode,
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevValuesRef = useRef<Record<string, unknown>>({})
  const relatedKeysRef = useRef(relatedKeys)

  useEffect(() => {
    relatedKeysRef.current = relatedKeys
  })

  useEffect(() => {
    if (!Object.keys(relatedKeysRef.current).length) return

    prevValuesRef.current = form.getValues()

    const subscription = form.watch((value, { name }) => {
      if (name && relatedKeysRef.current[name]) {
        const currentValue = (value as Record<string, unknown>)[name]
        const previousValue = prevValuesRef.current[name]

        if (currentValue !== previousValue) {
          const fieldsToClear = [relatedKeysRef.current[name]].flat()

          fieldsToClear.forEach((relatedField) => {
            form.setValue(
              relatedField as Path<TFieldValues>,
              '' as PathValue<TFieldValues, Path<TFieldValues>>,
              { shouldDirty: true },
            )
            form.clearErrors(relatedField as Path<TFieldValues>)
          })

          prevValuesRef.current[name] = currentValue
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    if (!debounce) return

    const subscription = form.watch(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(
        () => form.handleSubmit(onSubmit)(),
        debounce * 1000,
      )
    })

    return () => {
      subscription.unsubscribe()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [debounce, form, onSubmit])

  const onFailedRef = useRef(onFailed)
  const onSuccessRef = useRef(onSuccess)

  useEffect(() => {
    onFailedRef.current = onFailed
    onSuccessRef.current = onSuccess
  })

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      onSuccessRef.current?.(form)
    }
  }, [form.formState.isSubmitSuccessful, form])

  const clearErrors = () => {
    form.clearErrors()
    onFailed?.({})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearErrors()
    form.handleSubmit(onSubmit, (errors) => onFailedRef.current?.(errors))(e)
  }

  const handleOnChange = (e: React.FormEvent<HTMLFormElement>) => {
    clearErrors()
    form.handleSubmit(onSubmit, (errors) => onFailedRef.current?.(errors))(e)
  }

  return (
    <FormProvider {...form}>
      <form
        className={`w-full ${props.className ?? ''}`.trim()}
        noValidate
        {...(debounce == null &&
          mode === 'onSubmit' && { onSubmit: handleSubmit })}
        {...(debounce == null &&
          mode === 'onChange' && { onChange: handleOnChange })}
        {...props}
      >
        {typeof children === 'function' ? children(form) : children}
      </form>
    </FormProvider>
  )
}
