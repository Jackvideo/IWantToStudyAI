import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { derivative, parse, evaluate } from 'mathjs'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { FlaskConical, Play, RotateCcw, ChevronDown, ChevronUp, Info } from 'lucide-react'

// KaTeX 渲染组件
function Latex({ expr, displayMode = false, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && expr) {
      try {
        katex.render(expr, ref.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        })
      } catch {
        ref.current.textContent = expr
      }
    }
  }, [expr, displayMode])
  return <span ref={ref} className={className} />
}

// ML/DL 常见函数预设
const presets = [
  {
    group: '激活函数',
    icon: '⚡',
    items: [
      {
        name: 'Sigmoid',
        expr: '1 / (1 + exp(-a * x))',
        latex: '\\sigma(x) = \\frac{1}{1 + e^{-ax}}',
        latexDeriv: "\\sigma'(x) = a \\cdot \\sigma(ax)\\bigl(1 - \\sigma(ax)\\bigr)",
        params: [{ name: 'a', label: '陡峭度', min: 0.1, max: 5, step: 0.1, default: 1 }],
        range: [-6, 6],
        desc: 'σ(x) = 1/(1+e^(-x))，输出 (0,1)，常用于二分类输出层。a 控制曲线陡峭度。',
        tags: ['第3章 对数几率回归', '第5章 神经元激活'],
      },
      {
        name: 'Tanh',
        expr: '(exp(a*x) - exp(-a*x)) / (exp(a*x) + exp(-a*x))',
        latex: '\\tanh(x) = \\frac{e^{ax} - e^{-ax}}{e^{ax} + e^{-ax}}',
        latexDeriv: "\\tanh'(x) = a\\bigl(1 - \\tanh^2(ax)\\bigr)",
        params: [{ name: 'a', label: '缩放', min: 0.1, max: 3, step: 0.1, default: 1 }],
        range: [-5, 5],
        desc: 'tanh(x) = (e^x - e^(-x))/(e^x + e^(-x))，输出 (-1,1)，零中心化，比 Sigmoid 更常用于隐藏层。',
        tags: ['第5章 隐藏层激活'],
      },
      {
        name: 'ReLU',
        expr: 'max(0, x)',
        latex: '\\text{ReLU}(x) = \\max(0,\\, x)',
        latexDeriv: "\\text{ReLU}'(x) = \\begin{cases} 1 & x > 0 \\\\ 0 & x \\le 0 \\end{cases}",
        derivativeExpr: 'x > 0 ? 1 : 0',
        params: [],
        range: [-5, 5],
        desc: 'ReLU(x) = max(0, x)，计算简单，解决梯度消失问题。深度学习最常用激活函数。',
        tags: ['深度学习标配'],
      },
      {
        name: 'Leaky ReLU',
        expr: 'x >= 0 ? x : a * x',
        latex: '\\text{LeakyReLU}(x) = \\begin{cases} x & x \\ge 0 \\\\ \\alpha x & x < 0 \\end{cases}',
        latexDeriv: "\\text{LeakyReLU}'(x) = \\begin{cases} 1 & x \\ge 0 \\\\ \\alpha & x < 0 \\end{cases}",
        derivativeExpr: 'x >= 0 ? 1 : a',
        params: [{ name: 'a', label: '负区斜率 α', min: 0.01, max: 0.5, step: 0.01, default: 0.1 }],
        range: [-5, 5],
        desc: 'LeakyReLU = x (x≥0) 或 αx (x<0)，解决 ReLU "死神经元" 问题。',
        tags: ['ReLU 改进'],
      },
    ]
  },
  {
    group: '损失函数',
    icon: '📉',
    items: [
      {
        name: '均方误差 (MSE)',
        expr: '(x - a)^2',
        latex: 'L(\\hat{y}) = (\\hat{y} - y)^2',
        latexDeriv: "L'(\\hat{y}) = 2(\\hat{y} - y)",
        params: [{ name: 'a', label: '真实值 y', min: -3, max: 3, step: 0.1, default: 0 }],
        range: [-5, 5],
        desc: 'L = (ŷ - y)²，x 轴是预测值 ŷ。抛物线形状，离真实值越远惩罚越大。',
        tags: ['第3章 线性回归'],
      },
      {
        name: '交叉熵损失',
        expr: '-(a * log(x) + (1-a) * log(1-x))',
        latex: 'L(\\hat{y}) = -\\bigl[y \\ln \\hat{y} + (1-y) \\ln(1-\\hat{y})\\bigr]',
        latexDeriv: "L'(\\hat{y}) = -\\frac{y}{\\hat{y}} + \\frac{1-y}{1-\\hat{y}}",
        params: [{ name: 'a', label: '真实标签 y', min: 0, max: 1, step: 1, default: 1 }],
        range: [0.01, 0.99],
        desc: 'L = -[y·ln(ŷ) + (1-y)·ln(1-ŷ)]，x 轴是预测概率。预测越偏离真实标签，损失越大。',
        tags: ['第3章 对数几率回归', '分类任务标配'],
      },
    ]
  },
  {
    group: '基础函数',
    icon: '📐',
    items: [
      {
        name: '线性函数',
        expr: 'a * x + b',
        latex: 'f(x) = wx + b',
        latexDeriv: "f'(x) = w",
        params: [
          { name: 'a', label: '斜率 w', min: -3, max: 3, step: 0.1, default: 1 },
          { name: 'b', label: '截距 b', min: -3, max: 3, step: 0.1, default: 0 },
        ],
        range: [-5, 5],
        desc: 'y = wx + b，最基本的线性模型。w 是权重，b 是偏置。',
        tags: ['第3章 线性回归'],
      },
      {
        name: '二次函数',
        expr: 'a * x^2 + b * x + c',
        latex: 'f(x) = ax^2 + bx + c',
        latexDeriv: "f'(x) = 2ax + b",
        params: [
          { name: 'a', label: 'a', min: -2, max: 2, step: 0.1, default: 1 },
          { name: 'b', label: 'b', min: -3, max: 3, step: 0.1, default: 0 },
          { name: 'c', label: 'c', min: -3, max: 3, step: 0.1, default: 0 },
        ],
        range: [-5, 5],
        desc: 'y = ax² + bx + c，抛物线。梯度下降就是沿着这类曲面找最低点。',
        tags: ['梯度下降直觉'],
      },
      {
        name: '对数函数',
        expr: 'log(x) / log(a)',
        latex: 'f(x) = \\log_a x',
        latexDeriv: "f'(x) = \\frac{1}{x \\ln a}",
        params: [{ name: 'a', label: '底数', min: 1.1, max: 10, step: 0.1, default: 2.718 }],
        range: [0.01, 10],
        desc: 'y = log_a(x)，信息熵的核心。底数为2时就是信息论中的"比特"。',
        tags: ['第4章 信息熵'],
      },
      {
        name: '指数函数',
        expr: 'a^x',
        latex: 'f(x) = a^x',
        latexDeriv: "f'(x) = a^x \\ln a",
        params: [{ name: 'a', label: '底数', min: 0.5, max: 3, step: 0.1, default: 2.718 }],
        range: [-3, 3],
        desc: 'y = aˣ，指数增长/衰减。e^x 是 Sigmoid、Softmax 的核心组件。',
        tags: ['Sigmoid 组件'],
      },
    ]
  },
  {
    group: '信息论',
    icon: '🧮',
    items: [
      {
        name: '信息熵 (二分类)',
        expr: '-(x * log(x) / log(2) + (1-x) * log(1-x) / log(2))',
        latex: 'H(p) = -\\bigl[p\\log_2 p + (1-p)\\log_2(1-p)\\bigr]',
        latexDeriv: "H'(p) = -\\log_2 p + \\log_2(1-p)",
        derivativeExpr: '-(log(x)/log(2) - log(1-x)/log(2))',
        params: [],
        range: [0.01, 0.99],
        desc: 'H(p) = -[p·log₂(p) + (1-p)·log₂(1-p)]，x 轴是正类概率 p。p=0.5 时熵最大=1（最不确定）。',
        tags: ['第4章 决策树'],
      },
      {
        name: '基尼指数 (二分类)',
        expr: '2 * x * (1 - x)',
        latex: '\\text{Gini}(p) = 2p(1-p)',
        latexDeriv: "\\text{Gini}'(p) = 2 - 4p",
        params: [],
        range: [0, 1],
        desc: 'Gini(p) = 2p(1-p)，CART 算法的纯度度量。形状类似熵但计算更简单。',
        tags: ['第4章 决策树 CART'],
      },
    ]
  },
]

// 安全求值函数
function safeEval(expr, x, params) {
  try {
    const scope = { x, ...params, e: Math.E }
    // 处理条件表达式
    if (expr.includes('?')) {
      const fn = new Function('x', ...Object.keys(params), `return ${expr}`)
      return fn(x, ...Object.values(params))
    }
    return evaluate(expr, scope)
  } catch {
    return NaN
  }
}

// 数值求导
function numericalDerivative(expr, x, params, h = 0.0001) {
  const y1 = safeEval(expr, x + h, params)
  const y2 = safeEval(expr, x - h, params)
  if (isNaN(y1) || isNaN(y2)) return NaN
  return (y1 - y2) / (2 * h)
}

// 尝试符号求导，返回 { text, latex }
function trySymbolicDerivative(expr) {
  try {
    if (expr.includes('?') || expr.includes('max')) return null
    const d = derivative(expr, 'x')
    return { text: d.toString(), latex: d.toTex() }
  } catch {
    return null
  }
}

// 尝试将 mathjs 表达式转为 LaTeX
function exprToLatex(expr) {
  try {
    if (expr.includes('?') || expr.includes('max')) return null
    return parse(expr).toTex()
  } catch {
    return null
  }
}

// 生成数据点
function generateData(expr, derivExpr, range, params, numPoints = 300) {
  const [xMin, xMax] = range
  const step = (xMax - xMin) / numPoints
  const data = []
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + step * i
    const y = safeEval(expr, x, params)
    let dy
    if (derivExpr) {
      dy = safeEval(derivExpr, x, params)
    } else {
      dy = numericalDerivative(expr, x, params)
    }
    if (isFinite(y) && Math.abs(y) < 1000) {
      data.push({
        x: Math.round(x * 1000) / 1000,
        'f(x)': Math.round(y * 10000) / 10000,
        "f'(x)": isFinite(dy) && Math.abs(dy) < 1000 ? Math.round(dy * 10000) / 10000 : null,
      })
    }
  }
  return data
}

function ParamSlider({ param, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-text-muted w-24 shrink-0">{param.label}</label>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-primary h-1.5 cursor-pointer"
      />
      <span className="text-sm font-mono text-primary-light w-12 text-right">{value}</span>
    </div>
  )
}

function PresetButton({ preset, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
        ${isActive
          ? 'bg-primary/20 text-primary-light ring-1 ring-primary/30'
          : 'bg-surface-light text-text-muted hover:bg-surface-light hover:text-text'
        }`}
    >
      {preset.name}
    </button>
  )
}

export default function FormulaLabPage() {
  const [selectedPreset, setSelectedPreset] = useState(presets[0].items[0])
  const [customExpr, setCustomExpr] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [paramValues, setParamValues] = useState(() => {
    const init = {}
    presets[0].items[0].params.forEach(p => { init[p.name] = p.default })
    return init
  })
  const [showDerivative, setShowDerivative] = useState(true)
  const [rangeMin, setRangeMin] = useState(presets[0].items[0].range[0])
  const [rangeMax, setRangeMax] = useState(presets[0].items[0].range[1])
  const [expandedGroup, setExpandedGroup] = useState(presets[0].group)

  const selectPreset = useCallback((preset) => {
    setSelectedPreset(preset)
    setIsCustom(false)
    const init = {}
    preset.params.forEach(p => { init[p.name] = p.default })
    setParamValues(init)
    setRangeMin(preset.range[0])
    setRangeMax(preset.range[1])
  }, [])

  const activeExpr = isCustom ? customExpr : selectedPreset.expr
  const activeDerivExpr = isCustom ? null : (selectedPreset.derivativeExpr || null)

  const symbolicDeriv = useMemo(() => {
    if (activeDerivExpr) return { text: activeDerivExpr, latex: null }
    return trySymbolicDerivative(activeExpr)
  }, [activeExpr, activeDerivExpr])

  const chartData = useMemo(() => {
    if (!activeExpr) return []
    const derivText = activeDerivExpr || (symbolicDeriv ? symbolicDeriv.text : null)
    return generateData(activeExpr, derivText, [rangeMin, rangeMax], paramValues)
  }, [activeExpr, activeDerivExpr, symbolicDeriv, rangeMin, rangeMax, paramValues])

  const handleCustomSubmit = () => {
    if (customExpr.trim()) {
      setIsCustom(true)
    }
  }

  const resetParams = () => {
    if (!isCustom) {
      const init = {}
      selectedPreset.params.forEach(p => { init[p.name] = p.default })
      setParamValues(init)
      setRangeMin(selectedPreset.range[0])
      setRangeMax(selectedPreset.range[1])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <FlaskConical size={24} className="text-primary-light" />
          公式实验室
        </h1>
        <p className="text-sm text-text-muted">交互式探索 ML/DL 中的核心函数 · 拖动滑块调参 · 实时查看导数</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：预设选择 */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-surface-card border border-border rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-text mb-2">函数预设</h3>
            {presets.map(group => (
              <div key={group.group}>
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.group ? '' : group.group)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-light transition-colors"
                >
                  <span className="text-sm font-medium text-text">{group.icon} {group.group}</span>
                  {expandedGroup === group.group ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expandedGroup === group.group && (
                  <div className="flex flex-wrap gap-1.5 px-2 py-1.5">
                    {group.items.map(item => (
                      <PresetButton
                        key={item.name}
                        preset={item}
                        isActive={!isCustom && selectedPreset.name === item.name}
                        onClick={() => selectPreset(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 自定义公式输入 */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text mb-2">自定义公式</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customExpr}
                onChange={e => setCustomExpr(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
                placeholder="如：sin(x) * exp(-x^2)"
                className="flex-1 bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <button
                onClick={handleCustomSubmit}
                className="px-3 py-2 bg-primary/20 text-primary-light rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Play size={16} />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">支持：sin, cos, exp, log, sqrt, abs, ^, pi, e</p>
          </div>

          {/* 参数调节 */}
          {!isCustom && selectedPreset.params.length > 0 && (
            <div className="bg-surface-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">参数调节</h3>
                <button onClick={resetParams} className="text-text-muted hover:text-text transition-colors" title="重置">
                  <RotateCcw size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {selectedPreset.params.map(p => (
                  <ParamSlider
                    key={p.name}
                    param={p}
                    value={paramValues[p.name] ?? p.default}
                    onChange={val => setParamValues(prev => ({ ...prev, [p.name]: val }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* X 轴范围 */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text mb-3">X 轴范围</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={rangeMin}
                onChange={e => setRangeMin(parseFloat(e.target.value) || -5)}
                className="w-20 bg-surface-light border border-border rounded-lg px-2 py-1.5 text-sm text-text font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-text-muted">→</span>
              <input
                type="number"
                value={rangeMax}
                onChange={e => setRangeMax(parseFloat(e.target.value) || 5)}
                className="w-20 bg-surface-light border border-border rounded-lg px-2 py-1.5 text-sm text-text font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* 右侧：图表 + 信息 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 当前公式展示 */}
          <div className="bg-surface-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-text">
                  {isCustom ? '自定义公式' : selectedPreset.name}
                </h2>
                {/* 函数公式 - LaTeX 渲染 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary-light bg-primary/10 px-2 py-0.5 rounded font-medium shrink-0">f(x)</span>
                  {!isCustom && selectedPreset.latex ? (
                    <Latex expr={selectedPreset.latex} className="text-lg" />
                  ) : (
                    (() => {
                      const autoLatex = !isCustom ? null : exprToLatex(activeExpr)
                      return autoLatex
                        ? <Latex expr={`f(x) = ${autoLatex}`} className="text-lg" />
                        : <code className="text-sm text-primary-light font-mono">f(x) = {activeExpr}</code>
                    })()
                  )}
                </div>
                {/* 导数公式 - LaTeX 渲染 */}
                {showDerivative && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-medium shrink-0">f&apos;(x)</span>
                    {!isCustom && selectedPreset.latexDeriv ? (
                      <Latex expr={selectedPreset.latexDeriv} className="text-lg" />
                    ) : symbolicDeriv?.latex ? (
                      <Latex expr={`f'(x) = ${symbolicDeriv.latex}`} className="text-lg" />
                    ) : symbolicDeriv?.text ? (
                      <code className="text-sm text-emerald-400 font-mono">f&apos;(x) = {symbolicDeriv.text}</code>
                    ) : (
                      <span className="text-xs text-text-muted">(数值求导)</span>
                    )}
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDerivative}
                  onChange={e => setShowDerivative(e.target.checked)}
                  className="accent-emerald-400"
                />
                <span className="text-sm text-text-muted">显示导数</span>
              </label>
            </div>
          </div>

          {/* 图表 */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[rangeMin, rangeMax]}
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    tickFormatter={v => Number(v).toFixed(1)}
                  />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                    labelFormatter={v => `x = ${v}`}
                  />
                  <Legend />
                  <ReferenceLine x={0} stroke="#555" strokeDasharray="2 2" />
                  <ReferenceLine y={0} stroke="#555" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="f(x)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                  {showDerivative && (
                    <Line
                      type="monotone"
                      dataKey="f'(x)"
                      stroke="#10b981"
                      strokeWidth={1.5}
                      strokeDasharray="5 3"
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 说明卡片 */}
          {!isCustom && (
            <div className="bg-surface-card border border-border rounded-xl p-4">
              <div className="flex gap-2 items-start">
                <Info size={16} className="text-primary-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-text leading-relaxed">{selectedPreset.desc}</p>
                  {selectedPreset.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedPreset.tags.map(tag => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary-light px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
