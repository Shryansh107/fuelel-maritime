import { useState } from 'react'
import RoutesPage from './adapters/ui/pages/RoutesPage'
import ComparePage from './adapters/ui/pages/ComparePage'
import BankingPage from './adapters/ui/pages/BankingPage'
import PoolingPage from './adapters/ui/pages/PoolingPage'

type TabKey = 'routes' | 'compare' | 'banking' | 'pooling'

function App() {
  const [tab, setTab] = useState<TabKey>('routes')

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">FuelEU Compliance Dashboard</h1>
          <nav className="flex gap-2">
            <button className={`px-3 py-1 rounded ${tab === 'routes' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setTab('routes')}>
              Routes
            </button>
            <button className={`px-3 py-1 rounded ${tab === 'compare' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setTab('compare')}>
              Compare
            </button>
            <button className={`px-3 py-1 rounded ${tab === 'banking' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setTab('banking')}>
              Banking
            </button>
            <button className={`px-3 py-1 rounded ${tab === 'pooling' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setTab('pooling')}>
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
  )
}

export default App
