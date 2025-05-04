"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.langGraph = void 0;
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const model_1 = require("../llm/model");
const tools_1 = require("../llm/tools");
// Memory for the lang graph
const langgraph_2 = require("@langchain/langgraph");
// Define the function that determines whether to continue or not
function shouldContinue({ messages }) {
    var _a;
    const lastMessage = messages[messages.length - 1];
    // If the LLM makes a tool call, then we route to the "tools" node
    if ((_a = lastMessage.tool_calls) === null || _a === void 0 ? void 0 : _a.length) {
        return "tools";
    }
    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return "__end__";
}
// Define the function that calls the model
async function callModel(state) {
    const response = await model_1.boundModel.invoke(state.messages);
    // We return a list, because this will get added to the existing list
    return { messages: [response] };
}
const toolNode = new prebuilt_1.ToolNode(tools_1.tools);
// Define a new graph
const workflow = new langgraph_1.StateGraph(langgraph_1.MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);
// Add memory to the graph
const memory = new langgraph_2.MemorySaver();
exports.langGraph = workflow.compile({
    checkpointer: memory,
});
