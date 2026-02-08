# 🧪 实验代码区

> 动手实践是最好的学习方式

---

## 📁 目录结构

```
playground/
├── 01-ml-basics/          # 机器学习基础实验
│   ├── linear_regression.ipynb
│   ├── classification.ipynb
│   └── ...
├── 02-neural-networks/    # 神经网络实验
│   ├── mlp_from_scratch.ipynb
│   ├── cnn_basics.ipynb
│   └── ...
├── 03-llm/               # 大语言模型实验
│   ├── transformer_explained.ipynb
│   ├── prompt_engineering.ipynb
│   ├── openai_api_demo.ipynb
│   └── ...
├── 04-agent/             # Agent 开发实验
│   ├── langchain_basics.ipynb
│   ├── simple_rag.ipynb
│   └── ...
└── utils/                # 工具函数
```

---

## 🚀 快速开始

### 环境准备

```bash
# 创建虚拟环境（推荐使用 conda）
conda create -n ai-study python=3.10
conda activate ai-study

# 安装基础依赖
pip install numpy pandas matplotlib scikit-learn
pip install torch torchvision
pip install jupyter notebook

# LLM 相关（阶段三）
pip install openai langchain chromadb

# 启动 Jupyter
jupyter notebook
```

### 使用 Google Colab（推荐新手）

1. 访问 [Google Colab](https://colab.research.google.com/)
2. 新建笔记本
3. 运行时 → 更改运行时类型 → GPU（免费使用）

---

## 📝 实验清单

### 阶段一：机器学习基础

- [ ] **实验1.1**：使用 sklearn 进行线性回归
- [ ] **实验1.2**：手写数字分类（MNIST 简化版）
- [ ] **实验1.3**：数据预处理实践
- [ ] **实验1.4**：过拟合可视化演示

### 阶段二：神经网络

- [ ] **实验2.1**：从零实现神经元
- [ ] **实验2.2**：PyTorch 入门 - 简单 MLP
- [ ] **实验2.3**：CNN 图像分类
- [ ] **实验2.4**：RNN 文本生成（简单版）

### 阶段三：大语言模型

- [ ] **实验3.1**：Attention 机制可视化
- [ ] **实验3.2**：OpenAI API 全功能探索
- [ ] **实验3.3**：Prompt Engineering 实践
- [ ] **实验3.4**：简单 RAG 系统

### 阶段四：Agent 开发

- [ ] **实验4.1**：LangChain 基础使用
- [ ] **实验4.2**：Function Calling 实现
- [ ] **实验4.3**：构建问答 Agent
- [ ] **实验4.4**：多工具 Agent

---

## 💡 实验原则

1. **先跑通再理解**：先让代码跑起来，再逐行理解
2. **修改实验**：改参数、改数据，观察变化
3. **记录发现**：把实验中的发现写到笔记中
4. **追问为什么**：每个现象背后都有原因

---

## 🔧 常用代码片段

### 数据加载

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris, load_digits
from sklearn.model_selection import train_test_split

# 加载数据
data = load_iris()
X, y = data.data, data.target

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### PyTorch 基础

```python
import torch
import torch.nn as nn

# 简单网络
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)
```

### OpenAI API

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

---

## 📊 实验记录模板

### 实验名称：XXX

**日期**：YYYY-MM-DD

**目标**：

**过程**：
1. 
2. 
3. 

**结果**：

**发现**：

**问题**：

**下一步**：

---

*最后更新：2026-01-30*
