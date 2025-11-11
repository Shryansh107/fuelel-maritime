import { useState } from 'react'
import RoutesPage from './adapters/ui/pages/RoutesPage'
import ComparePage from './adapters/ui/pages/ComparePage'
import BankingPage from './adapters/ui/pages/BankingPage'
import PoolingPage from './adapters/ui/pages/PoolingPage'
import { ToastProvider } from './shared/toast/ToastProvider'
import { Icons } from './shared/icons'
import { Button } from './components/ui/button'

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
            <Button className="w-full justify-start" variant={tab === 'routes' ? 'default' : 'secondary'} onClick={() => setTab('routes')}>
              <Icons.Map className="mr-2" /> Routes
            </Button>
            <Button className="w-full justify-start" variant={tab === 'compare' ? 'default' : 'secondary'} onClick={() => setTab('compare')}>
              <Icons.ChartBar className="mr-2" /> Compare
            </Button>
            <Button className="w-full justify-start" variant={tab === 'banking' ? 'default' : 'secondary'} onClick={() => setTab('banking')}>
              <Icons.Bank className="mr-2" /> Banking
            </Button>
            <Button className="w-full justify-start" variant={tab === 'pooling' ? 'default' : 'secondary'} onClick={() => setTab('pooling')}>
              <Icons.Users className="mr-2" /> Pooling
            </Button>
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
