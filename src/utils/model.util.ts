import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { BaseLLM } from "@langchain/core/language_models/llms";
export function getLanguageModel(): BaseLLM {
    let llm;

    if (process.env.USE_LLM === "openai") {
        llm = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: process.env.OPENAI_MODEL,
        });
    } else {
        llm = new ChatOllama({
            baseUrl: "http://127.0.0.1:11434",
            model: process.env.OLLAMA_MODEL,
        });
    }

    return llm as unknown as BaseLLM;
}
