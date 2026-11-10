import { Baby } from 'lucide-react'
import type { LoginDto } from '../features/auth'
import { LoginSchema, useLoginMutation } from '../features/auth'
import { FormCard, Input } from '#/components'
import loginBackground from '#/assets/images/background/login-background.png'
import { useMutationTools } from '#/hooks'
import { toast } from 'sonner'
import { useState } from 'react'
import { brand } from '#/lib/brand'

export const Login = () => {
  const { safeMutate } = useMutationTools()
  const { mutateAsync: loginApi } = useLoginMutation()
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginDto, string>>
  >({})

  const handleLogin = async (data: LoginDto) => {
    setFieldErrors({})
    const { success, message } = await safeMutate(loginApi, data)
    if (!success) return toast.error(message)
  }

  return (
    <div className="relative isolate -m-4 flex min-h-svh w-[calc(100%+2rem)] flex-col bg-primary p-3 sm:p-5 sm:flex-row lg:p-7 items-center justify-center">
      <img
        className="pointer-events-none absolute inset-0 -z-20 size-full object-cover object-[58%_center] select-none"
        src={loginBackground}
        alt=""
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-primary/15 via-primary/75 to-primary/55"
      />

      <section
        className="flex min-w-0 flex-col h-fit rounded-sm border border-border bg-background p-6 lg:p-10 sm:w-xl lg:max-w-lg lg:w-full"
        aria-labelledby="login-title"
      >
        <div className="flex items-center gap-2.5 text-primary">
          <Baby aria-hidden="true" className="size-7" />
          <span className="font-heading text-lg font-bold">{brand.name}</span>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-4 sm:gap-7 py-8 sm:py-14">
          <header className="flex flex-col">
            <h1
              id="login-title"
              className="text-3xl leading-tight font-semibold tracking-tight lg:text-6xl"
            >
              {brand.welcomeTitle}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {brand.loginDescription}
            </p>
          </header>

          <FormCard
            schema={LoginSchema}
            onSubmit={handleLogin}
            aria-labelledby="login-title"
            cardClassName="max-w-none gap-6 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0"
            contentClassName="flex flex-col gap-5 px-0"
            footerClassName="px-0"
            size="sm"
            primaryAction={{
              label: 'Submit my credentials',
              className: 'h-11 w-full',
            }}
          >
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="username"
              wrapperClassName="w-full"
              customMessage={
                fieldErrors.email ? (
                  <span role="alert" className="text-destructive">
                    {fieldErrors.email}
                  </span>
                ) : null
              }
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              wrapperClassName="w-full"
              customMessage={
                fieldErrors.password ? (
                  <span role="alert" className="text-destructive">
                    {fieldErrors.password}
                  </span>
                ) : null
              }
            />
          </FormCard>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {brand.accessHelp}
          </p>
        </div>

        <footer className="flex items-center gap-1.5 text-xs leading-normal text-muted-foreground">
          <span>
            All rights reserved. {new Date().getFullYear()}{' '}
            {brand.copyrightHolder}
          </span>
        </footer>
      </section>

      <aside
        className="flex sm:min-h-64 min-w-0 flex-col sm:justify-end p-7 text-primary-foreground sm:p-10 lg:p-12"
        aria-label={brand.name}
      >
        <div className="flex max-w-md flex-col gap-4 sm:pt-12 lg:pt-60">
          <h2 className="whitespace-pre-line text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {brand.tagline}
          </h2>
          <p className="max-w-sm text-sm sm:text-base leading-relaxed text-primary-foreground/90">
            {brand.description}
          </p>
        </div>
      </aside>
    </div>
  )
}
