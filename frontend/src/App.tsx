import { useState } from 'react'
import RoutesPage from './adapters/ui/pages/RoutesPage'
import ComparePage from './adapters/ui/pages/ComparePage'
import BankingPage from './adapters/ui/pages/BankingPage'
import PoolingPage from './adapters/ui/pages/PoolingPage'
import { ToastProvider } from './shared/toast/ToastProvider'
import { Icons } from './shared/icons'

type TabKey = 'routes' | 'compare' | 'banking' | 'pooling'

function App() {
  const [tab, setTab] = useState<TabKey>('routes')

  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        <aside className="w-60 border-r bg-white">
          <div className="px-4 py-4 border-b">
            <h1 className="text-lg font-semibold">FuelEU Dashboard</h1>
          </div>
          <nav className="p-2 flex flex-col gap-1">
            <button className={`btn w-full justify-start ${tab === 'routes' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('routes')}>
              <Icons.Map className="mr-2" /> Routes
            </button>
            <button className={`btn w-full justify-start ${tab === 'compare' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('compare')}>
              <Icons.ChartBar className="mr-2" /> Compare
            </button>
            <button className={`btn w-full justify-start ${tab === 'banking' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('banking')}>
              <Icons.Bank className="mr-2" /> Banking
            </button>
            <button className={`btn w-full justify-start ${tab === 'pooling' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('pooling')}>
              <Icons.Users className="mr-2" /> Pooling
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-6 py-6">
          {tab === 'routes' && <RoutesPage />}
          {tab === 'compare' && <ComparePage />}
          {tab === 'banking' && <BankingPage />}
          {tab === 'pooling' && <PoolingPage />}
        </main>
      </div>
    </ToastProvider>
  )
}

export default App
