"""
Demo 05: Supervisor 多 Agent

学习目标：
- 多 Agent 可以先从“一个 supervisor 路由到多个专家节点”开始。
- 每个专家节点只负责局部任务，并把结果写回共享 State。
- Supervisor 决定下一步派给谁，直到所有必要结果齐全。

运行：
    python examples/langgraph/demo_05_multi_agent_supervisor.py
"""

from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class TeamState(TypedDict):
    task: str
    research_notes: str
    implementation_plan: str
    review_notes: str
    final_answer: str


def supervisor(
    state: TeamState,
) -> Literal["research_agent", "coding_agent", "review_agent", "finalize"]:
    if not state["research_notes"]:
        route = "research_agent"
    elif not state["implementation_plan"]:
        route = "coding_agent"
    elif not state["review_notes"]:
        route = "review_agent"
    else:
        route = "finalize"

    print(f"[supervisor] route = {route}")
    return route


def supervisor_node(state: TeamState) -> dict[str, str]:
    return {}


def research_agent(state: TeamState) -> dict[str, str]:
    notes = (
        "LangGraph 适合把 Agent 拆成显式状态机：State 保存上下文，"
        "节点执行推理或动作，条件边控制循环。"
    )
    print("[research_agent] done")
    return {"research_notes": notes}


def coding_agent(state: TeamState) -> dict[str, str]:
    plan = (
        "实现顺序：1. 定义 TypedDict State；2. 编写 planner/tool/final 节点；"
        "3. 用 conditional edge 表达是否继续调用工具；4. compile 后 invoke。"
    )
    print("[coding_agent] done")
    return {"implementation_plan": plan}


def review_agent(state: TeamState) -> dict[str, str]:
    notes = (
        "检查点：状态字段是否足够小；路由函数是否可测试；工具是否有错误处理；"
        "循环是否有退出条件。"
    )
    print("[review_agent] done")
    return {"review_notes": notes}


def finalize(state: TeamState) -> dict[str, str]:
    final = (
        f"任务：{state['task']}\n\n"
        f"调研结论：{state['research_notes']}\n\n"
        f"实现方案：{state['implementation_plan']}\n\n"
        f"评审建议：{state['review_notes']}"
    )
    return {"final_answer": final}


def build_graph():
    builder = StateGraph(TeamState)
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("research_agent", research_agent)
    builder.add_node("coding_agent", coding_agent)
    builder.add_node("review_agent", review_agent)
    builder.add_node("finalize", finalize)

    builder.add_edge(START, "supervisor")
    builder.add_conditional_edges("supervisor", supervisor)
    builder.add_edge("research_agent", "supervisor")
    builder.add_edge("coding_agent", "supervisor")
    builder.add_edge("review_agent", "supervisor")
    builder.add_edge("finalize", END)

    return builder.compile()


def main() -> None:
    graph = build_graph()
    result = graph.invoke(
        {
            "task": "给一个新同学解释如何搭建 LangGraph Agent",
            "research_notes": "",
            "implementation_plan": "",
            "review_notes": "",
            "final_answer": "",
        }
    )

    print("\nFinal Answer:")
    print(result["final_answer"])


if __name__ == "__main__":
    main()
