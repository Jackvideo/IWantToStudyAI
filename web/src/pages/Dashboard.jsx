import { Target, Clock, Flame, TrendingUp } from 'lucide-react'
import ProgressRing from '../components/ProgressRing'
import StageCard from '../components/StageCard'
import { progressData, weeklyPlan, getMilestones } from '../data/studyData'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-text">{value}</div>
        <div className="text-xs text-text-muted">{label}</div>
        {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const completedChapters = progressData.stages.reduce((acc, s) =>
    acc + s.chapters.filter(c => c.status === 'completed').length, 0)
  const totalChapters = progressData.stages.reduce((acc, s) => acc + s.chapters.length, 0)
  const todayPlan = weeklyPlan.days[0]
  const milestones = getMilestones()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">学习仪表盘</h1>
        <p className="text-sm text-text-muted">从 AI 小白到 LLM 应用开发者 · 总计 {progressData.totalWeeks} 周</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="总体进度" value={`${progressData.overallProgress}%`} color="#6366f1" />
        <StatCard icon={TrendingUp} label="已完成章节" value={`${completedChapters}/${totalChapters}`} color="#10b981" />
        <StatCard icon={Flame} label="今日计划" value={todayPlan?.title?.slice(0, 8) || '无'} color="#f59e0b" sub={todayPlan?.duration} />
        <StatCard icon={Clock} label="本周待办" value={`${weeklyPlan.checklist.filter(c => !c.completed).length} 项`} color="#3b82f6" />
      </div>

      {/* 阶段进度总览 */}
      <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">阶段进度</h2>
        <div className="flex items-center justify-around flex-wrap gap-6">
          {progressData.stages.map(stage => (
            <ProgressRing
              key={stage.id}
              progress={stage.progress}
              size={100}
              strokeWidth={7}
              color={stage.color}
              label={`${stage.icon} ${stage.name}`}
            />
          ))}
        </div>
      </div>

      {/* 各阶段详情 */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-3">各阶段详情</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressData.stages.map(stage => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </div>
      </div>

      {/* 里程碑时间线 */}
      <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">里程碑</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-surface-light border-2 border-primary flex items-center justify-center text-sm z-10 shrink-0">
                  {m.icon}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text">{m.title}</span>
                    <span className="text-xs text-text-muted bg-surface-light px-2 py-0.5 rounded">{m.date}</span>
                  </div>
                  <p className="text-sm text-text-muted mt-0.5">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
