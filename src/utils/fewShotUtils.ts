import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Tool } from "@langchain/core/tools";

export interface FewShotExample {
  input: string;
  toolName: string;
  toolArgs: Record<string, any>;
  toolResponse: string;
  finalAnswer: string;
}

export function createFewShotMessages(examples: FewShotExample[]) {
  const messages = [];
  
  for (const example of examples) {
    messages.push(new HumanMessage(example.input));
    messages.push(
      new AIMessage({
        content: "Let me help you with that.",
        tool_calls: [
          {
            id: `example_${Math.random().toString(36).slice(2)}`,
            name: example.toolName,
            args: example.toolArgs,
          },
        ],
      })
    );
    messages.push(
      new ToolMessage({
        tool_call_id: messages[messages.length - 1].tool_calls![0].id,
        content: example.toolResponse,
      })
    );
    messages.push(new AIMessage(example.finalAnswer));
  }
  
  return messages;
}

export function bindToolWithExamples(
  llm: BaseChatModel,
  tool: Tool,
  examples: FewShotExample[]
) {
  const llmWithTools = llm.bindTools([tool]);
  
  return async (input: string) => {
    const messages = createFewShotMessages(examples);
    messages.push(new HumanMessage(input));
    
    const response = await llmWithTools.invoke(messages);
    return response;
  };
}