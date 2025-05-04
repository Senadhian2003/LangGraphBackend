"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
const essay_generator_tool_1 = require("./essay-generator-tool");
const info_retriver_tool_1 = require("./info-retriver-tool");
exports.tools = [info_retriver_tool_1.tavilySearchTool, essay_generator_tool_1.essayGeneratorTool];
