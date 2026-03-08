import {
  LayoutDashboard,
  CalendarDays,
  ScrollText,
  Route,
  BookOpen,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: '总览', icon: LayoutDashboard },
  { id: 'plan', label: '学习计划', icon: CalendarDays },
  { id: 'log', label: '学习日志', icon: ScrollText },
  { id: 'roadmap', label: '学习路线', icon: Route },
  { id: 'formulaLab', label: '公式实验室', icon: FlaskConical },
  { id: 'resources', label: '资源中心', icon: BookOpen },
]

export default function Sidebar({ activePage, onNavigate, open, onToggle }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col z-50 transition-all duration-300 ${open ? 'w-60' : 'w-16'}`}
    >
      <div className="flex items-center h-16 px-4 border-b border-border gap-3">
        <span className="text-2xl shrink-0">🤖</span>
        {open && <span className="font-bold text-lg whitespace-nowrap">我要学AI</span>}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded hover:bg-surface-light text-text-muted hover:text-text transition-colors shrink-0"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                ${isActive
                  ? 'bg-primary/20 text-primary-light'
                  : 'text-text-muted hover:bg-surface-light hover:text-text'
                }`}
              title={!open ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {open && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {open && (
          <div className="text-xs text-text-muted text-center">
            最后更新：2026-03-07
          </div>
        )}
      </div>
    </aside>
  )
}
