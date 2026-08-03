"""
Demo 04: Human-in-the-loop 审批分支

学习目标：
- 高风险动作不应该直接执行，可以先进入人工确认节点。
- LangGraph 里可以把“是否需要人类审批”建模成普通状态和条件边。
- 生产中可把 review 节点替换为 interrupt/resume、工单系统或审批 UI。

运行：
    python examples/langgraph/demo_04_human_review.py
"""

from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class ReviewState(TypedDict):
    request: str
    draft_action: str
    risk: str
    approved: bool
    result: str


def draft_action(state: ReviewState) -> dict[str, str]:
    request = state["request"]
    action = f"向客户发送优惠补偿邮件：{request}"
    print(f"[draft_action] {action}")
    return {"draft_action": action}


def assess_risk(state: ReviewState) -> dict[str, str]:
    action = state["draft_action"]
    risk = "high" if "退款" in action or "补偿" in action else "low"
    print(f"[assess_risk] risk = {risk}")
    return {"risk": risk}


def route_by_risk(state: ReviewState) -> Literal["human_review", "execute_action"]:
    if state["risk"] == "high":
        return "human_review"
    return "execute_action"


def human_review(state: ReviewState) -> dict[str, bool]:
    print("[human_review] demo 中自动批准；真实系统里这里会暂停等待人工。")
    return {"approved": True}


def route_after_review(state: ReviewState) -> Literal["execute_action", "reject_action"]:
    return "execute_action" if state["approved"] else "reject_action"


def execute_action(state: ReviewState) -> dict[str, str]:
    return {"result": f"已执行：{state['draft_action']}"}


def reject_action(state: ReviewState) -> dict[str, str]:
    return {"result": "人工审批未通过，动作已取消。"}


def build_graph():
    builder = StateGraph(ReviewState)
    builder.add_node("draft_action", draft_action)
    builder.add_node("assess_risk", assess_risk)
    builder.add_node("human_review", human_review)
    builder.add_node("execute_action", execute_action)
    builder.add_node("reject_action", reject_action)

    builder.add_edge(START, "draft_action")
    builder.add_edge("draft_action", "assess_risk")
    builder.add_conditional_edges("assess_risk", route_by_risk)
    builder.add_conditional_edges("human_review", route_after_review)
    builder.add_edge("execute_action", END)
    builder.add_edge("reject_action", END)

    return builder.compile()


def main() -> None:
    graph = build_graph()
    result = graph.invoke(
        {
            "request": "用户投诉服务中断，要求退款和补偿",
            "draft_action": "",
            "risk": "",
            "approved": False,
            "result": "",
        }
    )

    print("\nFinal Result:")
    print(result["result"])


if __name__ == "__main__":
    main()
