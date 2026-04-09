# Transformer 架构

> **前置知识**：词嵌入、Self-Attention、Multi-Head Attention  
> **学习时间**：约 60 分钟  
> **难度等级**：⭐⭐⭐⭐☆

---

## 📌 为什么 Transformer 是革命性的？

**历史背景**：

| 时代 | 模型 | 问题 |
|------|------|------|
| 早期 | RNN / LSTM | 顺序处理，无法并行；长程依赖弱 |
| 改进 | Attention + RNN | 加了 Attention，但 RNN 还在，依然慢 |
| 革命 | **Transformer** | 完全抛弃 RNN，**纯 Attention** 构建 |

**2017 年 Google 论文**：《Attention Is All You Need》  
核心观点：**你只需要 Attention，不需要 RNN/CNN**

---

## 🏗️ 整体架构

Transformer 由 **Encoder（编码器）** 和 **Decoder（解码器）** 两部分组成：

```
输入文本: "I love you"
    ↓
[Input Embedding + Positional Encoding]
    ↓
┌─────────────────────┐
│   Encoder × N 层    │  ← 理解输入
│  - Multi-Head Attn  │
│  - Feed Forward     │
└─────────────────────┘
    ↓（编码器输出：每个词的"理解"向量）
┌─────────────────────┐
│   Decoder × N 层    │  ← 生成输出
│  - Masked MH Attn   │
│  - Cross Attention  │
│  - Feed Forward     │
└─────────────────────┘
    ↓
输出文本: "我爱你"
```

**注意**：
- **BERT**：只用 Encoder（理解任务：分类、问答）
- **GPT**：只用 Decoder（生成任务：续写、对话）
- **原始 Transformer**：Encoder + Decoder（翻译、摘要）

---

## 🔢 Step 0：输入处理

### 词嵌入（Token Embedding）
将每个词转换为向量（已学过）：
```
"I"    → [0.2, 0.8, -0.1, ...]  (512维)
"love" → [0.5, 0.1,  0.9, ...]
"you"  → [0.3, 0.7, -0.4, ...]
```

### 位置编码（Positional Encoding）⭐ 重点

**问题**：Attention 本身没有位置感！

```
"猫咬了狗" vs "狗咬了猫"
→ 词是一样的，但顺序不同，意思完全相反
→ 纯 Attention 无法区分（因为它只看词与词的相关性，不看位置）
```

**解决方案**：给每个词的向量加上一个"位置信号"

$$
\text{输入向量} = \text{词嵌入向量} + \text{位置编码向量}
$$

**位置编码的直觉**：
- 位置 1 的词 → 加上一个代表"第1位"的信号
- 位置 2 的词 → 加上一个代表"第2位"的信号
- ...

原论文用正弦/余弦函数生成位置编码（不需要学习，固定的）：

$$
PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right)
$$
$$
PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)
$$

**为什么用正弦/余弦？**
- 不同位置的编码各不相同
- 相对位置关系可以通过向量运算推导
- 可以推广到比训练时更长的序列

---

## 🧱 Encoder 层结构

每个 Encoder 层包含两个子层：

```
输入 x
  ↓
┌─────────────────────────────┐
│  1. Multi-Head Self-Attention│  ← 词与词之间的关联
└─────────────────────────────┘
  ↓ 残差连接 + Layer Norm
┌─────────────────────────────┐
│  2. Feed Forward Network    │  ← 每个词独立的非线性变换
└─────────────────────────────┘
  ↓ 残差连接 + Layer Norm
输出（与输入维度相同）
```

### 子层 1：Multi-Head Self-Attention
（已学，参考 Attention 笔记）

### 子层 2：Feed Forward Network（FFN）

```python
FFN(x) = ReLU(xW₁ + b₁)W₂ + b₂
```

- 两个线性变换 + 一个 ReLU
- **独立作用在每个位置**（不同位置之间不交互）
- 维度：512 → 2048 → 512（先扩张再压缩）

**直觉**：Attention 负责"汇聚信息"（各词之间交流），FFN 负责"深度处理"（每个词自己消化）

### 残差连接（Residual Connection）⭐

$$
\text{输出} = \text{LayerNorm}(x + \text{子层}(x))
$$

**为什么需要残差连接？**

```
问题：深层网络（12层/24层）训练困难，梯度容易消失
解决：让梯度有"高速公路"可以直接传递

比喻：
没有残差：信号要经过 12 道关卡，每道都可能失真
有了残差：有一条直达通道，信号可以跳过关卡直达终点
         就算某些层"学不好"，整体功能也不会崩溃
```

### Layer Normalization（层归一化）

- 对每个样本的特征维度做归一化（不同于 Batch Norm 对批次做归一化）
- 稳定训练，加速收敛
- 公式：$\hat{x} = \frac{x - \mu}{\sigma} \cdot \gamma + \beta$

---

## 🔓 Decoder 层结构

Decoder 比 Encoder 多一个子层：

```
输出词（已生成的）
  ↓
┌───────────────────────────────────┐
│  1. Masked Multi-Head Self-Attention│  ← 只看已生成的词
└───────────────────────────────────┘
  ↓ 残差连接 + LayerNorm
┌───────────────────────────────────┐
│  2. Cross-Attention               │  ← 关注编码器的输出
└───────────────────────────────────┘
  ↓ 残差连接 + LayerNorm
┌───────────────────────────────────┐
│  3. Feed Forward Network          │
└───────────────────────────────────┘
  ↓ 残差连接 + LayerNorm
输出（预测下一个词）
```

### Masked Self-Attention（掩码自注意力）

**为什么要 Mask（遮掩）？**

```
训练时生成 "我爱你"：
  生成"我" 时 → 只能看到 <start>
  生成"爱" 时 → 只能看到 <start> 我
  生成"你" 时 → 只能看到 <start> 我 爱

不能"偷看"未来的词！否则模型训练时作弊，推理时不能用。
```

实现方式：在计算 Attention 时，把未来位置的分数设为 -∞，经过 Softmax 后权重变为 0。

```
注意力矩阵（上三角部分被 mask）：
        我   爱   你
<start>  √   ✗   ✗
我       √   √   ✗
爱       √   √   √
```

### Cross-Attention（交叉注意力）

- **Query** 来自 Decoder（当前生成状态）
- **Key 和 Value** 来自 Encoder 输出（对输入的理解）

```
翻译 "I love you" → "我爱你"：

生成"爱"时：
  Query: Decoder 当前状态（已生成"我"）
  Keys:  Encoder 对 [I, love, you] 的理解
  → 注意力权重: [0.1, 0.8, 0.1]  （最关注 love）
  → 用这个上下文信息预测"爱"
```

---

## 📐 完整数据流

以翻译 "I love you" → "我爱你" 为例：

```
【编码阶段】

输入: [I, love, you]
  ↓ Token Embedding + Positional Encoding
  ↓
  x₁=[...], x₂=[...], x₃=[...]  (每个词512维)
  ↓
Encoder Layer 1:
  Self-Attention: 每个词"看"其他所有词
  FFN: 每个词独立处理
  输出: h₁, h₂, h₃  (512维，但已包含上下文信息)
  ↓
Encoder Layer 2...6（共6层）
  ↓
编码器最终输出: H = [h₁, h₂, h₃]

【解码阶段】

时间步 1：预测"我"
  Decoder 输入: [<start>]
  Masked Self-Attention: 只看 <start>
  Cross-Attention: Query=当前状态, K/V=H → 关注哪个输入词
  输出概率分布 → argmax → "我"

时间步 2：预测"爱"
  Decoder 输入: [<start>, 我]
  Masked Self-Attention: 看 <start> 和 我
  Cross-Attention: 关注 "love"
  输出 → "爱"

时间步 3：预测"你"
  Decoder 输入: [<start>, 我, 爱]
  输出 → "你"

时间步 4：
  输出 → <end>  （停止）
```

---

## 🔧 关键超参数

| 超参数 | 原论文值 | 说明 |
|--------|----------|------|
| `d_model` | 512 | 词向量/隐藏层维度 |
| `N` | 6 | Encoder/Decoder 堆叠层数 |
| `h` | 8 | Multi-Head Attention 的头数 |
| `d_k = d_v` | 64 | 每个头的维度（512/8） |
| `d_ff` | 2048 | FFN 中间层维度 |
| `dropout` | 0.1 | 正则化 |

---

## 🌟 BERT vs GPT

基于 Transformer，两大方向：

### BERT（2018，Google）
- **只用 Encoder**
- **双向注意力**：每个词能看到左右两侧（全上下文）
- **预训练任务**：
  1. MLM（Masked Language Model）：遮住15%的词，预测被遮的词
  2. NSP（Next Sentence Prediction）：判断两句话是否相邻
- **适合**：文本分类、NER、问答（理解任务）

```
"The [MASK] sat on the mat"
→ BERT 同时看到左边的 "The" 和右边的 "sat on the mat"
→ 预测 [MASK] = "cat"
```

### GPT（2018，OpenAI）
- **只用 Decoder**
- **单向注意力**（自左向右，因为有 Mask）
- **预训练任务**：语言建模（预测下一个词）
- **适合**：文本生成、对话、续写

```
"The cat sat on"
→ GPT 只看左边
→ 预测下一个词 = "the" / "a" / "his"...
```

### 对比总结

| | BERT | GPT |
|--|------|-----|
| 结构 | Encoder | Decoder |
| 注意力 | 双向 | 单向（从左到右） |
| 预训练 | 完形填空（MLM） | 预测下一词 |
| 擅长 | 理解（分类/问答） | 生成（续写/对话） |
| 代表应用 | 搜索引擎语义理解 | ChatGPT |

---

## 🧠 为什么 Transformer 这么强？

### 1. 完全并行化
RNN 必须 t=1 → t=2 → t=3 顺序计算  
Transformer 可以同时计算所有位置 → **训练快 10 倍以上**

### 2. 长程依赖一步到位
RNN：词 1 到词 100 需要经过 99 步传递（信息衰减严重）  
Transformer：词 1 和词 100 **直接做 Attention**（O(1) 步）

### 3. 可堆叠、可扩展
- 6 层 Encoder → 12 层（BERT-Large）→ 96 层（GPT-3）
- 模型越大，效果越好（Scaling Law）

---

## 📊 知识串联

```
你的学习路径：

词嵌入（文字→向量）
  ↓
Attention（词与词的相关性）
  ↓
Multi-Head Attention（多角度关注）
  ↓
Self-Attention（序列内部关联）
  ↓
Transformer（纯 Attention 构建的完整模型）
  ↓
┌──────────────┐     ┌──────────────┐
│     BERT     │     │     GPT      │
│（Encoder）    │     │（Decoder）    │
│  理解任务     │     │  生成任务     │
└──────────────┘     └──────────────┘
         ↓                   ↓
         └──────┬────────────┘
                ↓
           大语言模型（LLM）
           GPT-4, Claude, Gemini...
```

---

## 🔜 下一步学习

完成 Transformer 后，你已经掌握了 LLM 的基础！下一步：

1. **预训练 + 微调范式**：LLM 如何从"通才"变"专才"
2. **Tokenization**：文字如何变成 Token（BPE 算法）
3. **Prompt Engineering**：如何更好地使用 LLM
4. **RAG 实战**：向量数据库 + LLM 构建知识问答系统
5. **Function Calling**：让 LLM 调用工具

---

## 📚 推荐学习资源

| 资源 | 链接 | 说明 |
|------|------|------|
| 原论文 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 必读经典 |
| 可视化 | [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/) | 图文并茂，强推 |
| 视频 | 李宏毅《Transformer 详解》 | B站可搜到 |
| 代码 | [Harvard NLP - The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/) | 带注释的 PyTorch 实现 |

---

**学习时间**：约 60 分钟  
**关键词**：Encoder、Decoder、Position Encoding、残差连接、LayerNorm、BERT、GPT  
**下一步**：预训练 + 微调范式，进入 LLM 阶段！
