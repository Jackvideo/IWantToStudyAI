import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import PlanPage from './pages/PlanPage'
import LogPage from './pages/LogPage'
import RoadmapPage from './pages/RoadmapPage'
import ResourcePage from './pages/ResourcePage'
import FormulaLabPage from './pages/FormulaLabPage'

const pages = {
  dashboard: { component: Dashboard, label: '总览' },
  plan: { component: PlanPage, label: '学习计划' },
  log: { component: LogPage, label: '学习日志' },
  roadmap: { component: RoadmapPage, label: '学习路线' },
  formulaLab: { component: FormulaLabPage, label: '公式实验室' },
  resources: { component: ResourcePage, label: '资源中心' },
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const PageComponent = pages[activePage].component

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="p-6 max-w-7xl mx-auto">
          <PageComponent />
        </div>
      </main>
    </div>
  )
}
