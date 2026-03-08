import { useState } from 'react'
import { Clock, HelpCircle, CheckSquare, Square, Calendar } from 'lucide-react'
import { weeklyPlan } from '../data/studyData'

const categoryColors = {
  'decision-tree': { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-500' },
  'neural-network': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500' },
  'embedding': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500' },
}

export default function PlanPage() {
  const [checklist, setChecklist] = useState(weeklyPlan.checklist)

  const toggleItem = (id) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = checklist.filter(c => c.completed).length
  const totalCount = checklist.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">学习计划</h1>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Calendar size={16} />
          <span>{weeklyPlan.dateRange}</span>
        </div>
      </div>

      {/* 本周进度条 */}
      <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-text">本周完成度</h2>
          <span className="text-sm font-medium text-primary-light">{completedCount}/{totalCount} 项 · {progressPercent}%</span>
        </div>
        <div className="h-3 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 每日日历卡片 */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-3">每日安排</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {weeklyPlan.days.map((day, i) => {
            const colors = categoryColors[day.category] || categoryColors['decision-tree']
            return (
              <div
                key={i}
                className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="text-sm font-medium text-text">{day.date} {day.weekday}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {day.categoryLabel}
                  </span>
                </div>

                <h3 className="font-semibold text-text mb-3">{day.title}</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={14} />
                    <span>{day.duration}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-text-muted">
                    <HelpCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{day.keyQuestion}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 本周待办清单 */}
      <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-text mb-4">本周学习清单</h2>
        <div className="space-y-2">
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left
                ${item.completed
                  ? 'bg-success/10 border border-success/20'
                  : 'bg-surface-light/50 border border-transparent hover:border-border'
                }`}
            >
              {item.completed
                ? <CheckSquare size={18} className="text-success shrink-0" />
                : <Square size={18} className="text-text-muted shrink-0" />
              }
              <span className={`text-sm ${item.completed ? 'text-text-muted line-through' : 'text-text'}`}>
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
