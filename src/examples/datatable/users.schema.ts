import { z } from 'zod'

const calendarDate = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD for dates.')
    .refine((value) => {
      const [year, month, day] = value.split('-').map(Number)
      const date = new Date(0)
      date.setFullYear(year, month - 1, day)
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      )
    }, 'Choose a valid calendar date.')
    .optional(),
)

export const userFilterSchema = z
  .object({
    status: z.enum(['active', 'inactive']).optional(),
    joined: z
      .object({ from: calendarDate, to: calendarDate })
      .refine(
        ({ from, to }) => !from || !to || from <= to,
        'Joined date must end on or after its start.',
      )
      .optional(),
  })
  .strict()

export type UserFilters = z.infer<typeof userFilterSchema>
export const DEFAULT_USER_FILTERS: UserFilters = {}

export interface ExampleUser {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  joinedDate: string
}
