import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Tabs as TabsPrimitive,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/Tabs'
import type {
  TabItem,
  TabsOrientation,
  TabsProps,
  TabsSize,
  TabsVariant,
} from '../types/tabs.types'

const sizeStyles: Record<
  TabsSize,
  {
    list: string
    trigger: string
    icon: string
  }
> = {
  sm: {
    list: 'h-8 text-xs',
    trigger: 'h-7 px-2.5 py-1 text-xs gap-1',
    icon: 'h-3.5 w-3.5',
  },
  md: {
    list: 'h-9 text-sm',
    trigger: 'h-8 px-3 py-1.5 text-sm gap-1.5',
    icon: 'h-4 w-4',
  },
  lg: {
    list: 'h-10 text-base',
    trigger: 'h-9 px-4 py-2 text-base gap-2',
    icon: 'h-4.5 w-4.5',
  },
}

function getVariantClasses(
  variant: TabsVariant,
  orientation: TabsOrientation,
  itemCount: number,
) {
  if (variant === 'underline') {
    return {
      list: cn(
        'bg-transparent p-0 gap-4 rounded-none',
        orientation === 'horizontal'
          ? 'border-b border-border'
          : 'border-r border-border flex flex-col',
      ),
      trigger: cn(
        'bg-transparent rounded-none shadow-none',
        orientation === 'horizontal'
          ? 'px-1 pb-2 data-[selected]:border-b-2 data-[selected]:border-primary data-[selected]:text-primary data-[selected]:shadow-none'
          : 'px-3 py-2 justify-start data-[selected]:border-r-2 data-[selected]:border-primary data-[selected]:text-primary data-[selected]:shadow-none',
      ),
    }
  }

  if (variant === 'pills') {
    return {
      list: 'bg-transparent p-0 gap-1.5',
      trigger:
        'rounded-full px-3.5 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:shadow-xs',
    }
  }

  if (variant === 'segmented') {
    return {
      list: cn(
        'w-full bg-muted p-1 rounded-lg text-muted-foreground',
        orientation === 'horizontal' && 'grid',
      ),
      listStyle:
        orientation === 'horizontal'
          ? { gridTemplateColumns: `repeat(${itemCount}, minmax(0, 1fr))` }
          : undefined,
      trigger:
        'w-full rounded-md data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-xs',
    }
  }

  // 'default'
  return {
    list: 'bg-muted p-1 rounded-lg text-muted-foreground',
    trigger:
      'rounded-md data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-xs',
  }
}

export const Tabs = <TValue extends string = string>({
  items = [],
  value: valueProp,
  defaultValue,
  onChange,
  onValueChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  children,
}: TabsProps<TValue>) => {
  const initialValue =
    defaultValue ?? (items.length > 0 ? items[0].value : ('' as TValue))
  const [uncontrolledValue, setUncontrolledValue] =
    useState<TValue>(initialValue)

  const currentValue: TValue =
    valueProp !== undefined ? valueProp : uncontrolledValue

  const handleValueChange = (nextValue: unknown) => {
    const val = String(nextValue) as TValue
    if (valueProp === undefined) {
      setUncontrolledValue(val)
    }
    onChange?.(val)
    onValueChange?.(val)
  }

  const currentSize = sizeStyles[size]
  const variantStyles = getVariantClasses(variant, orientation, items.length)

  return (
    <TabsPrimitive
      value={currentValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      className={cn(
        orientation === 'vertical' ? 'flex gap-4' : 'flex flex-col',
        className,
      )}
    >
      <TabsList
        style={variantStyles.listStyle}
        className={cn(
          currentSize.list,
          variantStyles.list,
          orientation === 'vertical' && 'w-48 shrink-0 flex flex-col',
          listClassName,
        )}
      >
        {items.map((item: TabItem<TValue>) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              currentSize.trigger,
              variantStyles.trigger,
              triggerClassName,
            )}
          >
            {item.icon && (
              <span className={cn('shrink-0', currentSize.icon)}>
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-muted-foreground">
                {item.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div
        className={cn(orientation === 'vertical' ? 'flex-1 min-w-0' : 'w-full')}
      >
        {items.map((item: TabItem<TValue>) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className={cn('outline-none', contentClassName)}
          >
            {item.content}
          </TabsContent>
        ))}
        {children}
      </div>
    </TabsPrimitive>
  )
}
