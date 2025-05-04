"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tavilyApiKey = exports.azureEndpoint = exports.azureApiInstanceName = exports.azureDeploymentName = exports.azureApiVersion = exports.azureApiKey = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Get Azure OpenAI configuration
exports.azureApiKey = process.env.DEV_AZURE_OPENAI_API_KEY;
exports.azureApiVersion = process.env.DEV_AZURE_OPENAI_API_VERSION;
exports.azureDeploymentName = process.env.DEV_AZURE_OPENAI_DEPLOYMENT_NAME;
exports.azureApiInstanceName = process.env.DEV_AZURE_OPENAI_INSTANCE_NAME;
exports.azureEndpoint = process.env.DEV_AZURE_OPENAI_ENDPOINT;
// Get Tavily API key
exports.tavilyApiKey = process.env.TAVILY_API_KEY;
