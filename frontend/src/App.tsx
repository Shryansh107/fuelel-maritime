import { useState } from 'react'
import RoutesPage from './adapters/ui/pages/RoutesPage'
import ComparePage from './adapters/ui/pages/ComparePage'
import BankingPage from './adapters/ui/pages/BankingPage'
import PoolingPage from './adapters/ui/pages/PoolingPage'
import { ToastProvider } from './shared/toast/ToastProvider'

type TabKey = 'routes' | 'compare' | 'banking' | 'pooling'

function App() {
  const [tab, setTab] = useState<TabKey>('routes')

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">FuelEU Compliance Dashboard</h1>
            <nav className="flex gap-2">
              <button className={`btn ${tab === 'routes' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('routes')}>
                Routes
              </button>
              <button className={`btn ${tab === 'compare' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('compare')}>
                Compare
              </button>
              <button className={`btn ${tab === 'banking' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('banking')}>
                Banking
              </button>
              <button className={`btn ${tab === 'pooling' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('pooling')}>
                Pooling
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
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
