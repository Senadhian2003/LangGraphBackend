"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.essayGeneratorTool = void 0;
const zod_1 = require("zod");
const tools_1 = require("@langchain/core/tools");
const model_1 = require("../model");
const messages_1 = require("@langchain/core/messages");
const prompts_1 = require("../../prompts");
const essayGeneratorToolSchema = zod_1.z.object({
    content: zod_1.z.string().describe("The content to be converted to markdown"),
});
exports.essayGeneratorTool = (0, tools_1.tool)(async (content) => {
    const response = await model_1.model.invoke([
        new messages_1.SystemMessage(prompts_1.MARKDOWN_TOOL_PROMPT),
        new messages_1.HumanMessage(`Create an essay for this content: ${content} `),
    ]);
    const markdownResponse = response.content;
    console.log("Markdown Response:", markdownResponse);
    return markdownResponse;
}, {
    name: "markdownTool",
    description: "Structures the given content into an essay and returns it in markdown format",
    schema: essayGeneratorToolSchema,
});
