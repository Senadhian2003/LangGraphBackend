
import { AzureChatOpenAI } from "@langchain/openai";
import { azureApiInstanceName, azureApiKey,  azureApiVersion, azureDeploymentName } from "../constants/app-constants";
import { tools } from "./tools";




export const model = new AzureChatOpenAI({
    azureOpenAIApiKey: azureApiKey,
    azureOpenAIApiInstanceName: azureApiInstanceName,
    azureOpenAIApiDeploymentName: azureDeploymentName,
    azureOpenAIApiVersion: azureApiVersion,
  })

export const boundModel = model.bindTools(tools);