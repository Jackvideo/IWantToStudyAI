import { CheckCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import { studyLogs } from '../data/studyData'

const statusIcon = {
  completed: <CheckCircle size={14} className="text-success shrink-0" />,
  warning: <AlertTriangle size={14} className="text-warning shrink-0" />,
  info: <Info size={14} className="text-info shrink-0" />,
}

const typeColors = {
  sync: 'border-info',
  milestone: 'border-success',
  study: 'border-primary',
}

export default function LogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">学习日志</h1>
        <p className="text-sm text-text-muted">记录 AI 学习历程中的里程碑和每日进度</p>
      </div>

      <div className="relative">
        {/* 时间线竖线 */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {studyLogs.map((log, logIdx) => (
            <div key={logIdx} className="relative">
              {/* 日期节点 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-lg z-10 shrink-0">
                  {log.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-text">{log.title}</h2>
                  <span className="text-xs text-text-muted">{log.date}</span>
                </div>
              </div>

              {/* 日志内容 */}
              <div className="ml-14 space-y-4">
                {log.entries.map((entry, entryIdx) => (
                  <div
                    key={entryIdx}
                    className={`bg-surface-card backdrop-blur-sm border-l-2 ${typeColors[log.type] || 'border-primary'} border border-border rounded-r-xl p-4`}
                  >
                    <h3 className="text-sm font-semibold text-text mb-2">{entry.subtitle}</h3>
                    <div className="space-y-1.5">
                      {entry.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 text-sm">
                          {statusIcon[item.status] || statusIcon.completed}
                          <span className={
                            item.status === 'completed' ? 'text-text-muted' :
                            item.status === 'warning' ? 'text-warning' :
                            'text-info'
                          }>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {log.insight && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                    <Lightbulb size={18} className="text-warning shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-warning mb-1">学习心得</h4>
                      <p className="text-sm text-text-muted">{log.insight}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
