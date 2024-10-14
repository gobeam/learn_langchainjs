import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { getLanguageModel } from "../utils/model.util";
import { createToolChain, invokeToolChain } from "../utils/tolchain.util";

let tavilyToolChain: any;

export async function createTavilyAgent() {
  const model = getLanguageModel();
  const tavilyTool = new TavilySearchResults();
  tavilyToolChain = createToolChain(model, tavilyTool);
  return tavilyToolChain;
}

export async function queryTavilyAgent(input: string) {
  try {
    if (!tavilyToolChain) {
      await createTavilyAgent();
    }
    const result = await invokeToolChain(tavilyToolChain, input);
    console.log("🚀 ~ queryTavilyAgent ~ result:", result)
    return result.content;
  } catch (error) {
    console.error('An error occurred:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}
