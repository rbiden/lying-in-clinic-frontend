// @vitest-environment happy-dom
import { act } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Search } from 'lucide-react'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'
import { PendingState } from './PendingState'
import { Empty } from './Empty'
import { EmptyState } from './EmptyState'
import { LoadingScreen } from './LoadingScreen'
import { SessionErrorScreen } from '@/features/auth/SessionErrorScreen'

let container: HTMLDivElement
let root: ReturnType<typeof createRoot>

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

async function render(content: ReactNode) {
  await act(async () => root.render(content))
}

it('announces loading once and hides spinner artwork', async () => {
  await render(
    <LoadingState title="Loading records" description="Please wait" />,
  )
  expect(container.querySelectorAll('[role="status"]')).toHaveLength(1)
  expect(container.querySelector('[role="status"]')?.textContent).toBe(
    'Loading recordsPlease wait',
  )
  expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
    'true',
  )
  expect(container.querySelector('svg')?.hasAttribute('aria-label')).toBe(false)
})

it.each(['modal', 'card', 'page'] as const)(
  'keeps %s placeholders decorative with status outside the busy region',
  async (variant) => {
    await render(
      <PendingState variant={variant} label="Loading clinic content" />,
    )
    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1)
    const busy = container.querySelector('[aria-busy="true"]')!
    expect(busy.getAttribute('aria-hidden')).toBe('true')
    expect(busy.querySelector('[role="status"]')).toBeNull()
    expect(
      busy.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0)
    expect(
      container.querySelector(
        'dialog, [role="dialog"], main, input, button, [tabindex]',
      ),
    ).toBeNull()
    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(
      variant === 'card' ? 1 : 0,
    )
  },
)

it('renders a single alert, uses the requested heading and enables Retry only with an available handler', async () => {
  const retry = vi.fn()
  await render(
    <ErrorState title="Connection lost" headingLevel={3} onRetry={retry} />,
  )
  expect(container.querySelectorAll('[role="alert"]')).toHaveLength(1)
  expect(container.querySelector('h3')?.textContent).toBe('Connection lost')
  await act(async () => container.querySelector('button')!.click())
  expect(retry).toHaveBeenCalledOnce()
  await render(<ErrorState onRetry={retry} retrying retryLabel="Try again" />)
  expect(container.querySelector('button')!.disabled).toBe(true)
  await act(async () => container.querySelector('button')!.click())
  expect(retry).toHaveBeenCalledOnce()
  expect(container.querySelectorAll('[role="status"]')).toHaveLength(0)
  await render(<ErrorState />)
  expect(container.querySelector('button')).toBeNull()
})

it('keeps Empty as the same implementation and preserves custom icons, actions, children and slots', async () => {
  expect(Empty).toBe(EmptyState)
  const action = vi.fn()
  await render(
    <Empty
      icon={Search}
      size="lg"
      variant="dashed"
      title="No matches"
      titleClassName="custom-title"
      description="Change your filters"
      action={{ label: 'Clear filters', onClick: action }}
      secondaryAction={<a href="#help">Help</a>}
    >
      <span>More guidance</span>
    </Empty>,
  )
  expect(container.querySelector('svg')).not.toBeNull()
  expect(
    container.querySelector('h3')?.classList.contains('custom-title'),
  ).toBe(true)
  expect(container.textContent).toContain('More guidance')
  expect(container.querySelector('a')?.getAttribute('href')).toBe('#help')
  await act(async () => container.querySelector('button')!.click())
  expect(action).toHaveBeenCalledOnce()
  await render(<Empty icon={null} />)
  expect(container.querySelector('svg')).toBeNull()
})

it('keeps the session loading brand static and the edited error heading intact', async () => {
  await render(<LoadingScreen />)
  expect(container.querySelector('h1')?.textContent).toBe(
    'Loading your workspace',
  )
  expect(container.querySelectorAll('[role="status"]')).toHaveLength(1)
  expect(container.querySelector('[data-slot="spinner"]')).not.toBeNull()
  expect(
    container
      .querySelector('svg:not([data-slot="spinner"])')
      ?.classList.contains('motion-safe:animate-spin'),
  ).toBe(false)
  const retry = vi.fn()
  await render(<SessionErrorScreen retry={retry} />)
  expect(container.querySelectorAll('[role="alert"]')).toHaveLength(1)
  expect(container.querySelector('h1')?.classList.contains('text-5xl')).toBe(
    true,
  )
  await act(async () => container.querySelector('button')!.click())
  expect(retry).toHaveBeenCalledOnce()
})
