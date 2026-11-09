import { Baby, ShieldCheck, ArrowRight } from 'lucide-react'
import type { LoginDto } from '../features/auth'
import { LoginSchema, useLoginMutation } from '../features/auth'
import { GuestAtmosphere, FormCard, Input } from '#/components'
import { useMutationTools } from '#/hooks'
import { toast } from 'sonner'

export const Login = () => {
  const { safeMutate } = useMutationTools()
  const { mutateAsync: loginApi } = useLoginMutation()

  const handleLogin = async (data: LoginDto) => {
    const { success, message } = await safeMutate(loginApi, data)
    if (!success) return toast.error(message)
  }

  return (
    <main className="relative flex flex-col items-center justify-center h-full w-full min-h-[calc(100vh-2rem)] px-4">
      <GuestAtmosphere />

      {/* Brand Header Chip */}
      <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary shadow-xs backdrop-blur-md">
        <Baby className="h-4 w-4" />
        <span>POS & Inventory System</span>
      </div>

      <FormCard
        schema={LoginSchema}
        onSubmit={handleLogin}
        headerClassName="mb-2"
        title="Sign in to your account"
        titleClassName="text-3xl font-black tracking-tight text-center"
        description="Enter your credentials to access your inventory and POS workspace. All credentials are encrypted and secure."
        descriptionClassName="text-center"
        cardClassName="backdrop-blur-xl py-10 bg-card/85 border border-border/70 shadow-2xl shadow-primary/5 rounded-2xl"
        className="relative z-10 flex justify-center items-center w-full"
        contentClassName="space-y-4!"
        size="md"
        primaryAction={{
          label: (
            <span className="flex items-center gap-1 text-sm font-semibold font-heading">
              Submit Credentials
              <ArrowRight className="size-4" />
            </span>
          ),
          className: 'w-full h-10 shadow-md shadow-primary/20',
        }}
      >
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="admin@example.com"
          wrapperClassName="m-auto"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="*************"
          wrapperClassName="m-auto"
        />
      </FormCard>

      {/* Subtle Security / Compliance Footer */}
      <footer className="relative z-10 mt-6 flex items-center gap-1.5 text-xs text-muted-foreground/80">
        <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
        <span>Encrypted POS session • 2026 All rights reserved</span>
      </footer>
    </main>
  )
}
