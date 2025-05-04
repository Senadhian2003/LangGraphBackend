

import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { model } from "../model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MARKDOWN_TOOL_PROMPT } from "../../prompts";
const essayGeneratorToolSchema = z.object({
   content : z.string().describe("The content to be converted to markdown"),
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
    name: "markdownTool",
    description: "Structures the given content into an essay and returns it in markdown format",
    schema: essayGeneratorToolSchema,
  }
);

