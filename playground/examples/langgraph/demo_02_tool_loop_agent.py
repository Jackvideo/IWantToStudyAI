"""
Demo 02: ReAct 风格工具循环

学习目标：
- Agent 不是一次 LLM 调用，而是一个可循环的控制流。
- LLM 决定是否调用工具；工具结果写回 State；随后 LLM 再基于观察结果回答。
- Conditional Edge 是 Agent 循环的关键。

运行：
    python examples/langgraph/demo_02_tool_loop_agent.py
"""

import ast
import operator
from typing import Any, Literal, TypedDict

from langgraph.graph import END, START, StateGraph


class ToolCall(TypedDict):
    name: str
    args: dict[str, Any]


class AgentState(TypedDict):
    question: str
    thoughts: list[str]
    tool_call: ToolCall | None
    observation: str
    final_answer: str


ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
}


def safe_calculate(expression: str) -> str:
    """一个小而安全的四则运算工具，避免在 demo 里直接 eval。"""

    def visit(node: ast.AST) -> float:
        if isinstance(node, ast.Expression):
            return visit(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return float(node.value)
        if isinstance(node, ast.BinOp) and type(node.op) in ALLOWED_OPERATORS:
            return ALLOWED_OPERATORS[type(node.op)](visit(node.left), visit(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in ALLOWED_OPERATORS:
            return ALLOWED_OPERATORS[type(node.op)](visit(node.operand))
        raise ValueError(f"不支持的表达式: {expression}")

    value = visit(ast.parse(expression, mode="eval"))
    return str(int(value)) if value.is_integer() else str(value)


def mock_llm_decide(state: AgentState) -> dict[str, Any]:
    """模拟 LLM：第一次决定调工具，拿到 observation 后给最终答案。"""
    if not state["observation"]:
        thought = "我需要先用 calculator 工具算出表达式结果。"
        tool_call: ToolCall = {
            "name": "calculator",
            "args": {"expression": "15 * 23 + 45"},
        }
        print(f"[agent] Thought: {thought}")
        print(f"[agent] Action: {tool_call}")
        return {"thoughts": state["thoughts"] + [thought], "tool_call": tool_call}

    thought = "我已经拿到工具观察结果，可以组织最终回答。"
    print(f"[agent] Thought: {thought}")
    return {
        "thoughts": state["thoughts"] + [thought],
        "tool_call": None,
        "final_answer": f"15 * 23 + 45 = {state['observation']}。",
    }


def tool_node(state: AgentState) -> dict[str, Any]:
    call = state["tool_call"]
    if call is None:
        return {}

    if call["name"] != "calculator":
        raise ValueError(f"未知工具: {call['name']}")

    result = safe_calculate(call["args"]["expression"])
    print(f"[tool] Observation: {result}")
    return {"observation": result}


def should_continue(state: AgentState) -> Literal["tool_node", "__end__"]:
    if state["tool_call"] is not None:
        return "tool_node"
    return END


def build_graph():
    builder = StateGraph(AgentState)
    builder.add_node("agent", mock_llm_decide)
    builder.add_node("tool_node", tool_node)

    builder.add_edge(START, "agent")
    builder.add_conditional_edges("agent", should_continue)
    builder.add_edge("tool_node", "agent")

    return builder.compile()


def main() -> None:
    graph = build_graph()
    result = graph.invoke(
        {
            "question": "计算 15 * 23 + 45，并解释你怎么得到答案。",
            "thoughts": [],
            "tool_call": None,
            "observation": "",
            "final_answer": "",
        }
    )

    print("\nFinal Answer:")
    print(result["final_answer"])


if __name__ == "__main__":
    main()
