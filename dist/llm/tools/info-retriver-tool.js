"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tavilySearchTool = void 0;
const tavily_search_1 = require("@langchain/community/tools/tavily_search");
const app_constants_1 = require("../../constants/app-constants");
const zod_1 = require("zod");
const tools_1 = require("@langchain/core/tools");
// export const tavilySearchTool =  new TavilySearchResults({ maxResults: 3, apiKey: tavilyApiKey });
const seachSchema = zod_1.z.object({
    searchInput: zod_1.z.string().describe("The input topic that needs to be searched about from the internet"),
});
exports.tavilySearchTool = (0, tools_1.tool)(async ({ searchInput }) => {
    const tavily = new tavily_search_1.TavilySearchResults({ maxResults: 3, apiKey: app_constants_1.tavilyApiKey });
    const results = await tavily.call(searchInput); // This triggers the actual search
    console.log("Search Results:", results);
    return results;
}, {
    name: "internetSearchTool",
    description: "Search the internet for information about a topic",
    schema: seachSchema,
});
