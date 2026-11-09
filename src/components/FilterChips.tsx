import { X } from 'lucide-react'
import { cleanFilters, formatFilterValue } from '@/helpers'
import type { FilterValues } from '@/helpers'
import { Badge } from './ui/Badge'

interface FilterChipsProps {
  filters: FilterValues
  labels?: Record<string, string>
  formatValue?: (name: string, value: unknown) => string | undefined
  onRemove: (name: string) => void
  onClearAll: () => void
}

export const FilterChips = ({
  filters,
  labels,
  formatValue,
  onRemove,
  onClearAll,
}: FilterChipsProps) => {
  const entries = Object.entries(cleanFilters(filters))
  if (entries.length === 0) return null

  return (
    <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
      {entries.map(([name, value]) => {
        const label = labels?.[name] ?? name.replace(/[_.-]+/g, ' ')
        const text = formatValue?.(name, value) ?? formatFilterValue(value)
        return (
          <Badge key={name} title={`${label}: ${text}`} variant='outline' className='h-7'>
            <span className='font-medium text-muted-foreground capitalize shrink-0'>{label}:</span>
            <span className='truncate font-semibold max-w-44'>{text}</span>
            <button
              type='button'
              onClick={() => onRemove(name)}
              className='ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground shrink-0'
              aria-label={`Remove ${label} filter`}
            >
              <X className='size-3' />
            </button>
          </Badge>
        )
      })}
      <button
        type='button'
        onClick={onClearAll}
        className='ml-1.5 text-xs font-medium text-primary hover:underline'
      >
        Clear all
      </button>
    </div>
  )
}
