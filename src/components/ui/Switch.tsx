import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import type { SwitchRootProps } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'

export type SwitchProps = SwitchRootProps

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none select-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'bg-input data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background shadow-xs transition-transform',
          'translate-x-0 data-checked:translate-x-4',
        )}
      />
    </SwitchPrimitive.Root>
  )
}
