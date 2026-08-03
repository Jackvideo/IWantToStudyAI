# LangGraph Agent Demos

这个目录用 5 个小 demo 从 Agent 开发视角拆解 LangGraph 的核心心智模型：

1. `demo_01_state_graph.py`: 最小状态图，理解 State、Node、Edge、Router。
2. `demo_02_tool_loop_agent.py`: ReAct 风格工具循环，理解“模型决定 -> 工具执行 -> 再思考”。
3. `demo_03_memory_checkpoint.py`: 短期记忆和 checkpoint，理解 thread_id 如何保存多轮状态。
4. `demo_04_human_review.py`: 人类确认节点，理解高风险动作如何进入审批分支。
5. `demo_05_multi_agent_supervisor.py`: Supervisor 多 Agent，理解任务分派、专家节点和汇总。

这些 demo 刻意使用确定性的 Python 函数模拟 LLM 决策，不需要 API key。这样可以先看清 Agent 框架的骨架，再把其中的 `mock_llm_*` 函数替换为真实模型调用。

## 安装依赖

从源码安装 LangGraph 可选依赖：

```bash
pip install -e ".[langgraph]"
```

如果你只想手动装最小依赖：

```bash
pip install langgraph
```

## 运行顺序

```bash
python examples/langgraph/demo_01_state_graph.py
python examples/langgraph/demo_02_tool_loop_agent.py
python examples/langgraph/demo_03_memory_checkpoint.py
python examples/langgraph/demo_04_human_review.py
python examples/langgraph/demo_05_multi_agent_supervisor.py
```

## 从 Demo 到真实 Agent

LangGraph Agent 的基本结构通常是：

```text
State: Agent 的共享工作台，保存 messages、计划、工具结果、审批结果等。
Node: 一个可执行步骤，可以是 LLM 调用、工具调用、记忆读写、人工审批。
Edge: 固定流程连接，比如 START -> planner。
Conditional Edge: 根据状态动态路由，比如是否调用工具、是否结束、是否升级给人工。
Checkpoint: 按 thread_id 保存状态，让 Agent 能多轮对话、暂停恢复和调试。
```

当你接真实 LLM 时，优先替换这两类位置：

- 决策节点：把 `mock_llm_*` 替换成 `llm.invoke(...)`，让模型返回下一步动作。
- 工具节点：保留普通 Python 函数作为工具，把工具输入输出写回 State。

重点不是“LangGraph 替你写 Agent”，而是它把 Agent 的控制流显式化：每一步在哪里发生、状态如何变、什么时候循环或停止，都可以被你观察和测试。
