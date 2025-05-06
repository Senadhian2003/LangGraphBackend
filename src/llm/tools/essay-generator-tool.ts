

import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { model } from "../model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MARKDOWN_TOOL_PROMPT } from "../../prompts";
const essayGeneratorToolSchema = z.object({
   content : z.string().describe("The the raw information about the topic that needs to be converted into an essay"),
});

export const essayGeneratorTool = tool(
  async ({content}): Promise<string> => {
    console.log("Content:", content);
    const response = await model.invoke([
        new SystemMessage(MARKDOWN_TOOL_PROMPT),
        new HumanMessage(`Create an essay for this content: ${content} `),
      ]);
    const markdownResponse = response.content as string
    console.log("Markdown Response:", markdownResponse);
    return markdownResponse

  },
  {
    name: "essayTool",
    description: "Only use this tool when the user explicitly asks to generate an essay or structured markdown content.",
    schema: essayGeneratorToolSchema,
  }
);

