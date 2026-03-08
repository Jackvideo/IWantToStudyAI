import { useState } from 'react'
import { CheckCircle, Circle, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react'
import { progressData, checkpoints } from '../data/studyData'

const statusStyles = {
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  pending: { icon: Circle, color: 'text-text-muted', bg: 'bg-surface-light' },
}

export default function RoadmapPage() {
  const [expandedStage, setExpandedStage] = useState(1)
  const [showCheckpoint, setShowCheckpoint] = useState(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">学习路线</h1>
        <p className="text-sm text-text-muted">
          机器学习基础 → 神经网络 → 大语言模型 → Agent开发 · 总计 {progressData.totalWeeks} 周
        </p>
      </div>

      {/* 路线图进度条 */}
      <div className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          {progressData.stages.map((stage, i) => (
            <div key={stage.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all"
                  style={{
                    borderColor: stage.progress > 0 ? stage.color : 'rgba(99,102,241,0.2)',
                    backgroundColor: stage.progress > 0 ? `${stage.color}20` : 'transparent',
                  }}
                >
                  {stage.icon}
                </div>
                <span className="text-xs font-medium text-text text-center whitespace-nowrap">{stage.name}</span>
                <span className="text-xs text-text-muted">{stage.duration}</span>
              </div>
              {i < progressData.stages.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-28px]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: progressData.stages[i + 1].progress > 0 ? stage.color : 'rgba(99,102,241,0.15)',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 各阶段详细内容 */}
      <div className="space-y-3">
        {progressData.stages.map(stage => {
          const isExpanded = expandedStage === stage.id
          const completedCount = stage.chapters.filter(c => c.status === 'completed').length
          const checkpoint = checkpoints.find(c => c.stage === stage.id)

          return (
            <div key={stage.id} className="bg-surface-card backdrop-blur-sm border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-light/30 transition-colors"
              >
                <span className="text-2xl">{stage.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text">{stage.name}</h3>
                    <span className="text-xs text-text-muted">{stage.duration}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{stage.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: stage.color }}>{stage.progress}%</div>
                    <div className="text-xs text-text-muted">{completedCount}/{stage.chapters.length} 章</div>
                  </div>
                  {isExpanded ? <ChevronDown size={20} className="text-text-muted" /> : <ChevronRight size={20} className="text-text-muted" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 pb-5">
                  {/* 章节列表 */}
                  <div className="space-y-3 mt-4">
                    {stage.chapters.map((ch, i) => {
                      const st = statusStyles[ch.status] || statusStyles.pending
                      const Icon = st.icon
                      return (
                        <div key={i} className={`${st.bg} rounded-lg p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className={st.color} />
                            <span className={`text-sm font-medium ${ch.status === 'completed' ? 'text-success' : 'text-text'}`}>
                              {ch.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 ml-6">
                            {ch.topics.map((topic, j) => (
                              <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-surface-light text-text-muted">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* 检查题 */}
                  {checkpoint && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowCheckpoint(showCheckpoint === stage.id ? null : stage.id)
                        }}
                        className="flex items-center gap-2 text-sm text-primary-light hover:text-primary transition-colors"
                      >
                        <HelpCircle size={16} />
                        <span>阶段完成检查题 ({checkpoint.questions.length} 道)</span>
                      </button>
                      {showCheckpoint === stage.id && (
                        <div className="mt-3 space-y-2 ml-6">
                          {checkpoint.questions.map((q, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-text-muted">
                              <span className="shrink-0 text-primary-light">{j + 1}.</span>
                              <span>{q}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
