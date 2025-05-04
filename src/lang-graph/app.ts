
import { AIMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { boundModel } from "../llm/model";
import { tools } from "../llm/tools";

// Memory for the lang graph
import { MemorySaver } from "@langchain/langgraph";

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;
  
    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return "tools";
    }
    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return "__end__";
  }



// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await boundModel.invoke(state.messages);
  
    // We return a list, because this will get added to the existing list
    return { messages: [response] };
}

const toolNode = new ToolNode(tools);
// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);


// Add memory to the graph
const memory = new MemorySaver();

export const langGraph = workflow.compile({
  checkpointer: memory,
});

