"""
Demo 01: 最小 StateGraph

学习目标：
- State 是图中所有节点共享的工作台。
- Node 接收当前 State，返回部分 State 更新。
- Edge / Conditional Edge 决定下一步走向。

运行：
    python examples/langgraph/demo_01_state_graph.py
"""

from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class SupportTicketState(TypedDict):
    user_input: str
    category: str
    priority: str
    answer: str


def classify_ticket(state: SupportTicketState) -> dict[str, str]:
    text = state["user_input"].lower()

    if "refund" in text or "退款" in text:
        category = "billing"
    elif "error" in text or "bug" in text or "报错" in text:
        category = "technical"
    else:
        category = "general"

    print(f"[classify_ticket] category = {category}")
    return {"category": category}


def set_priority(state: SupportTicketState) -> dict[str, str]:
    text = state["user_input"].lower()
    priority = "high" if "urgent" in text or "紧急" in text else "normal"

    print(f"[set_priority] priority = {priority}")
    return {"priority": priority}


def billing_answer(state: SupportTicketState) -> dict[str, str]:
    return {
        "answer": (
            "这是账单/退款问题：请收集订单号、付款时间和退款原因，"
            f"优先级为 {state['priority']}。"
        )
    }


def technical_answer(state: SupportTicketState) -> dict[str, str]:
    return {
        "answer": (
            "这是技术问题：请收集复现步骤、错误日志和运行环境，"
            f"优先级为 {state['priority']}。"
        )
    }


def general_answer(state: SupportTicketState) -> dict[str, str]:
    return {
        "answer": (
            "这是一般咨询：先给出直接答复，再询问是否需要进一步帮助，"
            f"优先级为 {state['priority']}。"
        )
    }


def route_by_category(
    state: SupportTicketState,
) -> Literal["billing_answer", "technical_answer", "general_answer"]:
    print(f"[route_by_category] route = {state['category']}")
    if state["category"] == "billing":
        return "billing_answer"
    if state["category"] == "technical":
        return "technical_answer"
    return "general_answer"


def build_graph():
    builder = StateGraph(SupportTicketState)

    builder.add_node("classify_ticket", classify_ticket)
    builder.add_node("set_priority", set_priority)
    builder.add_node("billing_answer", billing_answer)
    builder.add_node("technical_answer", technical_answer)
    builder.add_node("general_answer", general_answer)

    builder.add_edge(START, "classify_ticket")
    builder.add_edge("classify_ticket", "set_priority")
    builder.add_conditional_edges("set_priority", route_by_category)
    builder.add_edge("billing_answer", END)
    builder.add_edge("technical_answer", END)
    builder.add_edge("general_answer", END)

    return builder.compile()


def main() -> None:
    graph = build_graph()

    result = graph.invoke(
        {
            "user_input": "紧急：我的订阅扣费了两次，我想退款",
            "category": "",
            "priority": "",
            "answer": "",
        }
    )

    print("\nFinal State:")
    print(result)
    print("\nAgent Answer:")
    print(result["answer"])


if __name__ == "__main__":
    main()
