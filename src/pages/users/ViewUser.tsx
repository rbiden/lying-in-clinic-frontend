import { useBreadcrumb } from '#/hooks'

export const ViewUser = () => {
  const userFullName = 'John Doe'
  useBreadcrumb(userFullName)

  return (
    <div>
      <h1 className="text-4xl font-bold">{userFullName}</h1>
    </div>
  )
}
