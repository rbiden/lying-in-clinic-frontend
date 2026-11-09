import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UsersTableExample } from './src/examples/datatable/UsersTableExample'
import { useTableQueryStore } from './src/stores/table-query-store'
import { useTableQuery } from './src/hooks/use-table-query'
import { userFilterSchema, DEFAULT_USER_FILTERS } from './src/examples/datatable/users.schema'
import './src/index.css'

const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } })
function Probe() {
  const table = useTableQuery({ tableKey: 'probe', filterSchema: userFilterSchema, defaultFilters: DEFAULT_USER_FILTERS, sortFields: ['name'] })
  useEffect(() => { Object.assign(window, { probe: table }) }, [table])
  return <p>Probe page {table.state.page}, limit {table.state.limit}</p>
}
function Harness() {
  const [visible, setVisible] = useState(true)
  const [second, setSecond] = useState(false)
  const navigate = useNavigate()
  useEffect(() => { Object.assign(window, { preview: { navigate, store: useTableQueryStore, client } }) }, [navigate])
  return <main className="mx-auto max-w-6xl p-6"><h1 className="mb-5 font-heading text-3xl">Users table preview</h1><div className="mb-5 flex gap-4"><button onClick={() => setVisible(!visible)}>Toggle example</button><button onClick={() => setSecond(!second)}>Toggle probe</button><button onClick={() => document.documentElement.classList.toggle('dark')}>Toggle theme</button></div>{visible && <UsersTableExample />}{second && <Probe />}</main>
}
createRoot(document.getElementById('app')!).render(<StrictMode><QueryClientProvider client={client}><BrowserRouter><Harness /></BrowserRouter></QueryClientProvider></StrictMode>)
