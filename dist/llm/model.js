"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundModel = exports.model = void 0;
const openai_1 = require("@langchain/openai");
const app_constants_1 = require("../constants/app-constants");
const tools_1 = require("./tools");
exports.model = new openai_1.AzureChatOpenAI({
    azureOpenAIApiKey: app_constants_1.azureApiKey,
    azureOpenAIApiInstanceName: app_constants_1.azureApiInstanceName,
    azureOpenAIApiDeploymentName: app_constants_1.azureDeploymentName,
    azureOpenAIApiVersion: app_constants_1.azureApiVersion,
});
exports.boundModel = exports.model.bindTools(tools_1.tools);
