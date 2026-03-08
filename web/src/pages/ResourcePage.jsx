import { useState } from 'react'
import { BookOpen, FileText, Wrench, Globe, ExternalLink, Star } from 'lucide-react'
import { resources } from '../data/studyData'

const tabs = [
  { id: 'books', label: '推荐书籍', icon: BookOpen },
  { id: 'papers', label: '重要论文', icon: FileText },
  { id: 'tools', label: '实用工具', icon: Wrench },
  { id: 'websites', label: '学习网站', icon: Globe },
]

const bookStatusMap = {
  primary: { text: '主教材', class: 'bg-primary/20 text-primary-light' },
  recommended: { text: '推荐', class: 'bg-success/20 text-success' },
  reference: { text: '参考', class: 'bg-surface-light text-text-muted' },
}

const tagColors = {
  '必读': 'bg-danger/20 text-danger',
  'Agent': 'bg-success/20 text-success',
  'RAG': 'bg-info/20 text-info',
  'LLM': 'bg-warning/20 text-warning',
  'framework': 'bg-purple-500/20 text-purple-400',
  'database': 'bg-cyan-500/20 text-cyan-400',
  'platform': 'bg-amber-500/20 text-amber-400',
  '视频': 'bg-red-500/20 text-red-400',
  '公开课': 'bg-blue-500/20 text-blue-400',
  '教程': 'bg-green-500/20 text-green-400',
}

export default function ResourcePage() {
  const [activeTab, setActiveTab] = useState('books')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">资源中心</h1>
        <p className="text-sm text-text-muted">精选的 AI 学习资源合集</p>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 bg-surface-card border border-border rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center
                ${isActive ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-text hover:bg-surface-light'}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 书籍列表 */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.books.map((book, i) => {
            const status = bookStatusMap[book.status] || bookStatusMap.reference
            return (
              <div key={i} className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-light shrink-0" />
                    <h3 className="font-semibold text-text text-sm">{book.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.class} shrink-0`}>{status.text}</span>
                </div>
                <p className="text-xs text-text-muted ml-[26px]">{book.author}</p>
                <p className="text-xs text-text-muted mt-2 ml-[26px]">{book.description}</p>
                {book.status === 'primary' && (
                  <div className="mt-3 ml-[26px] flex items-center gap-1 text-xs text-warning">
                    <Star size={12} fill="currentColor" />
                    <span>当前使用中</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 论文列表 */}
      {activeTab === 'papers' && (
        <div className="space-y-3">
          {resources.papers.map((paper, i) => {
            const tagClass = tagColors[paper.tag] || 'bg-surface-light text-text-muted'
            return (
              <div key={i} className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/40 transition-colors flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                  {paper.year.toString().slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text text-sm truncate">{paper.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${tagClass}`}>{paper.tag}</span>
                  </div>
                  <p className="text-xs text-text-muted">{paper.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 工具列表 */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.tools.map((tool, i) => {
            const tagClass = tagColors[tool.category] || 'bg-surface-light text-text-muted'
            return (
              <div key={i} className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={16} className="text-primary-light" />
                  <h3 className="font-semibold text-text text-sm">{tool.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tagClass} ml-auto`}>{tool.category}</span>
                </div>
                <p className="text-xs text-text-muted">{tool.description}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* 网站列表 */}
      {activeTab === 'websites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.websites.map((site, i) => {
            const tagClass = tagColors[site.category] || 'bg-surface-light text-text-muted'
            return (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-card backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group block"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-primary-light" />
                  <h3 className="font-semibold text-text text-sm group-hover:text-primary-light transition-colors">{site.name}</h3>
                  <ExternalLink size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tagClass} ml-auto`}>{site.category}</span>
                </div>
                <p className="text-xs text-text-muted">{site.description}</p>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
