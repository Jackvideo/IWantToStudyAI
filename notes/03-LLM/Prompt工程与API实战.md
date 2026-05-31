# Prompt 工程与 API 实战

> **前置知识**：Transformer 架构、LLM 基本原理  
> **学习时间**：约 5-6 小时（分 5 天）  
> **难度等级**：⭐⭐☆☆☆（重实践，轻理论）

---

## 📌 为什么 Prompt 工程很重要？

LLM 本质是一个**文字接龙机器**——它根据你给的输入预测后续文字。

你给它什么输入，它就在什么基础上续写。因此：
> **Prompt 的质量直接决定输出质量。**

类比：你问一个专家"帮我写代码"和"帮我用 Python 写一个读取 CSV 并按第二列排序的脚本，输出前10行"，得到的结果完全不同。

---

## 一、Prompt 基础类型

### 1.1 Zero-shot（零样本）

**定义**：直接告诉模型任务，不给任何示例。

```
Prompt：
将以下英文翻译成中文：
"The weather is nice today."

输出：今天天气很好。
```

**适用场景**：简单、明确的任务（翻译、格式转换、基础问答）

**局限**：复杂任务容易出错，模型可能"理解偏"

---

### 1.2 Few-shot（少样本）

**定义**：在 Prompt 中给几个示例，让模型学习模式。

```
Prompt：
判断以下评论的情感（正面/负面）：

评论：这个手机真好用！ → 正面
评论：电池续航太差了。 → 负面
评论：界面设计很漂亮，但卡顿严重。 → ?

输出：负面
```

**为什么有效**：模型从示例中理解了你真正想要的输出格式和判断标准。

**使用技巧**：
- 示例要覆盖典型情况（正/负/边界）
- 示例格式要与期望输出格式完全一致
- 一般 3-5 个示例足够

---

### 1.3 Chain-of-Thought（思维链 CoT）

**定义**：让模型在给出答案前，先写出推理过程。

**魔法咒语**：`Let's think step by step.` / `请一步一步思考。`

#### 对比例子：

**不用 CoT：**
```
问：Roger 有 5 个球，买了 2 盒，每盒 3 个，他现在有几个球？
答：11  ✅（运气好答对了，但复杂题会错）
```

**用 CoT：**
```
问：Roger 有 5 个球，买了 2 盒，每盒 3 个，他现在有几个球？
请一步一步思考。

答：
第一步：Roger 原来有 5 个球。
第二步：他买了 2 盒，每盒 3 个，共买了 2×3=6 个。
第三步：总共 5+6=11 个球。
最终答案：11 ✅
```

**为什么有效**：
- 强迫模型"思考"而不是直接"猜"
- 推理过程本身也是模型的输入，能引导后续 token
- 对数学、逻辑、多步骤任务提升显著

**进阶：Zero-shot CoT**
```
问题 + 答案之前加上："Let's think step by step."
不需要示例，模型自己推理
```

---

## 二、System Prompt 设计

### 2.1 什么是 System Prompt？

在 ChatGPT API 中，消息分三种角色：

| 角色 | 作用 | 谁写的 |
|------|------|--------|
| `system` | 设定 AI 的身份、行为、约束 | 开发者 |
| `user` | 用户的输入 | 用户 |
| `assistant` | AI 的回复 | AI 生成 |

```python
messages = [
    {"role": "system",    "content": "你是一个专业的Python导师..."},
    {"role": "user",      "content": "什么是装饰器？"},
    {"role": "assistant", "content": "装饰器是..."},  # 历史对话
    {"role": "user",      "content": "能给个例子吗？"},
]
```

### 2.2 System Prompt 的黄金结构

```
# 角色定义
你是一个[角色]，专注于[领域]。

# 能力范围
你可以：[能做的事]
你不要：[不能做的事]

# 输出格式
回答时请：
- [格式要求1]
- [格式要求2]

# 风格/语气
用[简洁/详细/友好/专业]的语言回答。
```

### 2.3 实战示例

**例1：客服机器人**
```
你是"智能电商助手"，专门处理订单、退换货、物流问题。
只回答与购物相关的问题，对其他话题礼貌拒绝。
回答要简洁，不超过100字。
如果问题复杂，引导用户联系人工客服（400-xxx-xxxx）。
```

**例2：学习辅导**
```
你是一位耐心的AI学习导师，面向AI初学者。
- 优先用类比和例子解释概念，避免堆砌公式
- 每次回答后，提出一个引导思考的问题
- 如果用户答对了，给予鼓励并进入下一个知识点
```

**例3：代码助手**
```
你是一个Python专家。
回答格式：
1. 先用1-2句话解释思路
2. 给出完整可运行的代码
3. 关键行加注释
4. 指出可能的边界情况

代码风格遵循 PEP8，使用类型注解。
```

---

## 三、OpenAI API 实战

### 3.1 安装与配置

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxx",          # 你的 API Key
    base_url="https://..."     # 如果用代理/第三方
)
```

### 3.2 最基础的调用

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",       # 模型名
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user",   "content": "用一句话解释什么是机器学习"}
    ]
)

# 提取文本
print(response.choices[0].message.content)
```

### 3.3 关键参数详解

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[...],
    
    temperature=0.7,    # 创意度：0=确定性强, 1=随机创意, 建议 0.3-0.7
    max_tokens=500,     # 最大输出 token 数，控制成本
    top_p=0.9,          # 另一种控制随机性的方式（一般不和 temperature 同时调）
    n=1,                # 生成几个候选答案
    stream=False,       # True = 流式输出（打字机效果）
)
```

**temperature 选择指南：**

| 任务 | 推荐 temperature |
|------|-----------------|
| 代码生成、数学计算 | 0 - 0.3 |
| 问答、摘要、翻译 | 0.3 - 0.7 |
| 创意写作、头脑风暴 | 0.7 - 1.0 |

### 3.4 多轮对话

关键：**每次请求都要带上完整历史消息**（API 本身无记忆）

```python
from openai import OpenAI

client = OpenAI(api_key="sk-xxx")

def chat():
    history = [
        {"role": "system", "content": "你是一个友好的AI助手"}
    ]
    
    while True:
        user_input = input("你：")
        if user_input == "quit":
            break
        
        # 把用户消息加入历史
        history.append({"role": "user", "content": user_input})
        
        # 发送完整历史
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=history
        )
        
        reply = response.choices[0].message.content
        print(f"AI：{reply}")
        
        # 把 AI 回复也加入历史（下轮要用）
        history.append({"role": "assistant", "content": reply})

chat()
```

### 3.5 流式输出（打字机效果）

```python
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "写一首关于秋天的诗"}],
    stream=True,   # 开启流式
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### 3.6 结构化输出（JSON 模式）

让模型输出 JSON，方便程序处理：

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是数据提取助手，只输出 JSON，不输出其他内容"},
        {"role": "user", "content": """
            从以下文本提取信息：
            "张三，28岁，住在北京，电话 138-xxxx-xxxx"
            
            输出格式：{"name": "", "age": 0, "city": "", "phone": ""}
        """}
    ],
    response_format={"type": "json_object"}  # 强制 JSON 输出
)

import json
data = json.loads(response.choices[0].message.content)
print(data)  # {'name': '张三', 'age': 28, 'city': '北京', 'phone': '138-xxxx-xxxx'}
```

---

## 四、成本控制技巧

### 4.1 Token 计算

```python
# 用 tiktoken 计算 token 数（付费前估算）
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o-mini")
text = "你好，今天天气怎么样？"
tokens = enc.encode(text)
print(f"Token 数：{len(tokens)}")  # 约 10
```

**粗略估算：**
- 英文：1 token ≈ 4 个字符（约 0.75 个单词）
- 中文：1 个汉字 ≈ 1-2 个 token

### 4.2 省钱原则

| 策略 | 说明 |
|------|------|
| 用小模型 | `gpt-4o-mini` 比 `gpt-4o` 便宜约 20 倍 |
| 限制 max_tokens | 避免模型输出过长 |
| 精简 System Prompt | System Prompt 每次都算钱 |
| 多轮对话截断历史 | 只保留最近 N 轮，避免 context 过长 |

---

## 五、实战项目：QA 机器人

### 项目目标
构建一个可以回答用户问题的对话机器人，具备：
- 自定义角色（System Prompt）
- 多轮对话记忆
- 流式输出
- 优雅退出

### 完整代码

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

SYSTEM_PROMPT = """
你是"小AI"，一个专注于解答机器学习和AI问题的学习助手。
- 用简单易懂的语言解释复杂概念，多用类比
- 回答尽量控制在200字以内
- 遇到不确定的问题，诚实告知并建议用户查阅资料
- 在每次回答结尾，提出一个相关的延伸问题引导用户思考
"""

def run_qa_bot():
    history = [{"role": "system", "content": SYSTEM_PROMPT}]
    print("🤖 小AI 已就绪！输入 'quit' 退出\n")
    
    while True:
        user_input = input("你：").strip()
        
        if not user_input:
            continue
        if user_input.lower() in ["quit", "exit", "退出"]:
            print("再见！继续加油学习～")
            break
        
        history.append({"role": "user", "content": user_input})
        
        print("小AI：", end="", flush=True)
        
        # 流式输出
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=history,
            temperature=0.5,
            max_tokens=400,
            stream=True,
        )
        
        full_reply = ""
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                print(delta, end="", flush=True)
                full_reply += delta
        
        print("\n")  # 换行
        history.append({"role": "assistant", "content": full_reply})
        
        # 控制历史长度（保留最近10轮 + system）
        if len(history) > 21:
            history = [history[0]] + history[-20:]

if __name__ == "__main__":
    run_qa_bot()
```

### 运行效果
```
🤖 小AI 已就绪！输入 'quit' 退出

你：什么是过拟合？
小AI：过拟合就像一个"死记硬背"的学生——
把课本上的例题背得滚瓜烂熟，但一遇到新题就不会了...

💡 延伸思考：你知道哪些方法可以防止过拟合吗？

你：quit
再见！继续加油学习～
```

---

## 六、Prompt 进阶技巧

### 6.1 角色扮演
```
你现在是一位严格的代码审查员，请审查以下代码并指出所有潜在问题：
[代码]
```

### 6.2 限制输出格式
```
用以下格式回答，不要有其他内容：
优点：[3条]
缺点：[3条]
总结：[1句话]
```

### 6.3 分步骤引导
```
请按以下步骤完成任务：
步骤1：先分析问题的关键点
步骤2：列出可能的解决方案
步骤3：选择最优方案并给出理由
步骤4：给出具体实现
```

### 6.4 给模型"台阶下"
```
# 不好的写法（强迫模型回答）
这道题的答案是什么？直接告诉我。

# 好的写法（允许模型不确定）
这道题的答案是什么？如果你不确定，请说明。
```

### 6.5 迭代改进 Prompt
```
第一版：太宽泛 → 输出质量差
第二版：加了示例（Few-shot）→ 格式对了但内容浅
第三版：加了 CoT 引导 → 质量提升
第四版：加了约束（字数、格式）→ 稳定输出
```

---

## 🧠 核心总结

```
Prompt 工程的本质：
"用对模型说话的方式，引导它产出你想要的结果"

核心技巧优先级：
1. 清晰定义任务（最重要）
2. 提供示例（Few-shot）
3. 要求推理过程（CoT）
4. 设计 System Prompt 角色
5. 约束输出格式
```

---

## 🔜 下一步：RAG 系统构建

掌握了 Prompt 工程和 API 调用，你已经能用 LLM 做很多事了！
下一步是 **RAG（检索增强生成）**：
- 当问题需要特定知识（你的笔记、公司文档）时
- LLM 自己不知道 → 先从知识库检索 → 再生成回答
- 这是目前 LLM 应用最常见的架构之一

---

**学习时间**：5-6 小时（分 5 天，每天约 1 小时）  
**实践重点**：一定要动手运行代码，光看不练效果减半  
**下一步**：RAG 系统构建（向量数据库 + LangChain）
