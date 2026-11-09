import { AppRouter } from './routes'
import { Providers } from './app/Providers'
import { Toaster } from 'sonner'

export const App = () => {
  return (
    <Providers>
      <AppRouter />
      <Toaster richColors />
    </Providers>
  )
}
