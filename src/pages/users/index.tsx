import { Button } from '#/components/ui/Button'
import { TEXT_SYMBOLS } from '#/constants'
import { useSafeNavigate } from '#/hooks/use-safe-navigate'

export const Users = () => {
  const navigate = useSafeNavigate()

  const onViewUser = () => {
    navigate('/users/:id', { params: { id: '123' } })
  }

  return (
    <div>
      <Button onClick={onViewUser}>
        View User {TEXT_SYMBOLS.EM_DASH} John Doe
      </Button>
    </div>
  )
}
