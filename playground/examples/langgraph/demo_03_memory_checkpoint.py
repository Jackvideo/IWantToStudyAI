"""
Demo 03: 短期记忆与 Checkpoint

学习目标：
- Checkpointer 按 thread_id 保存图状态。
- 同一个 thread_id 的多次 invoke 可以继承前面的状态。
- 这就是多轮 Agent 对话、暂停恢复、调试回放的基础。

运行：
    python examples/langgraph/demo_03_memory_checkpoint.py
"""

import operator
import re
from typing import Annotated, TypedDict

from langgraph.graph import END, START, StateGraph

try:
    from langgraph.checkpoint.memory import InMemorySaver
except ImportError:  # 兼容较老版本
    from langgraph.checkpoint.memory import MemorySaver as InMemorySaver


class MemoryState(TypedDict):
    messages: Annotated[list[str], operator.add]
    user_name: str
    answer: str


def remember_name(state: MemoryState) -> dict[str, str]:
    last_message = state["messages"][-1]
    match = re.search(r"我叫([\w\u4e00-\u9fff]+)", last_message)

    if match:
        user_name = match.group(1)
        print(f"[remember_name] user_name = {user_name}")
        return {"user_name": user_name}

    return {}


def answer_with_memory(state: MemoryState) -> dict[str, str]:
    last_message = state["messages"][-1]
    user_name = state.get("user_name", "")

    if "我叫什么" in last_message:
        answer = f"你叫 {user_name}。" if user_name else "我还不知道你的名字。"
    elif user_name:
        answer = f"收到，{user_name}。我会把这个名字记在当前 thread 的状态里。"
    else:
        answer = "收到。你可以说：我叫小明。"

    print(f"[answer_with_memory] answer = {answer}")
    return {"answer": answer}


def build_graph():
    builder = StateGraph(MemoryState)
    builder.add_node("remember_name", remember_name)
    builder.add_node("answer_with_memory", answer_with_memory)

    builder.add_edge(START, "remember_name")
    builder.add_edge("remember_name", "answer_with_memory")
    builder.add_edge("answer_with_memory", END)

    checkpointer = InMemorySaver()
    return builder.compile(checkpointer=checkpointer)


def main() -> None:
    graph = build_graph()

    config = {"configurable": {"thread_id": "student-001"}}

    first = graph.invoke(
        {"messages": ["你好，我叫Jack"], "user_name": "", "answer": ""},
        config=config,
    )
    print("\nFirst Answer:")
    print(first["answer"])

    second = graph.invoke({"messages": ["我叫什么？"]}, config=config)
    print("\nSecond Answer:")
    print(second["answer"])

    other_thread = graph.invoke(
        {"messages": ["我叫什么？"]},
        config={"configurable": {"thread_id": "student-002"}},
    )
    print("\nOther Thread Answer:")
    print(other_thread["answer"])


if __name__ == "__main__":
    main()
