import { CheckCircle, Circle, AlertCircle } from 'lucide-react'

const statusMap = {
  completed: { text: '已完成', class: 'bg-success/20 text-success', icon: CheckCircle },
  in_progress: { text: '进行中', class: 'bg-primary/20 text-primary-light', icon: AlertCircle },
  preview: { text: '预习中', class: 'bg-warning/20 text-warning', icon: AlertCircle },
  started: { text: '已开始', class: 'bg-success/20 text-success', icon: Circle },
  not_started: { text: '待开始', class: 'bg-surface-light text-text-muted', icon: Circle },
  pending: { text: '待学', class: 'bg-surface-light text-text-muted', icon: Circle },
}

export default function StageCard({ stage, compact = false }) {
  const status = statusMap[stage.status] || statusMap.not_started

  return (
    <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-300 group">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{stage.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text truncate">{stage.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.class}`}>{status.text}</span>
          </div>
          <p className="text-xs text-text-muted">{stage.description}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-muted">进度</span>
          <span className="font-medium" style={{ color: stage.color }}>{stage.progress}%</span>
        </div>
        <div className="h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stage.progress}%`, backgroundColor: stage.color }}
          />
        </div>
      </div>

      {!compact && stage.chapters && (
        <div className="space-y-1.5">
          {stage.chapters.map((ch, i) => {
            const chStatus = statusMap[ch.status]
            const Icon = chStatus.icon
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Icon size={14} className={ch.status === 'completed' ? 'text-success' : 'text-text-muted'} />
                <span className={ch.status === 'completed' ? 'text-text line-through opacity-60' : 'text-text-muted'}>
                  {ch.name}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
