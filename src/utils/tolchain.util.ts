import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { Tool } from "langchain/tools";

export function createToolChain(llm: any, tool: Tool) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant."],
    ["placeholder", "{messages}"],
  ]);

  const llmWithTools = llm.bindTools([tool]);

  const chain = prompt.pipe(llmWithTools);

  const toolChain = RunnableLambda.from(async (userInput: string, config) => {
    const humanMessage = new HumanMessage(userInput);
    const aiMsg = await chain.invoke(
      {
        messages: [new HumanMessage(userInput)],
      },
      config
    );
    const toolMsgs = await tool.batch((aiMsg as any).tool_calls, config);
    return chain.invoke(
      {
        messages: [humanMessage, aiMsg, ...toolMsgs],
      },
      config
    );
  });

  return toolChain;
}

export async function invokeToolChain(toolChain: RunnableSequence, userInput: string) {
  return await toolChain.invoke(userInput);
}