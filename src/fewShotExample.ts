import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { Tool } from "@langchain/core/tools";
import { z } from "zod";

// Correct schema definition for Tool
class LangChainQueryTool extends Tool {
  name = "langchain_query";
  description = "Use this tool to get information about LangChain concepts and usage.";

  constructor() {
    super();
  }

  protected _schema = z.object({
    input: z.string().describe("The query about LangChain"),
  });

  async _call(input: string): Promise<string> {
    // In a real implementation, this would query a vector store
    // For demo purposes, we'll return a simple response
    return `Here's information about ${input} in LangChain...`;
  }
}

async function main() {
  // Initialize the model and tool
  const model = new ChatOpenAI({ 
    modelName: "gpt-4",
    temperature: 0 
  });
  
  const langchainTool = new LangChainQueryTool();
  const modelWithTool = model.bindTools([langchainTool]);

  // Create few-shot examples
  const messages = [
    new HumanMessage("How do I create a simple chain?"),
    new AIMessage({
      content: "Let me search for information about creating chains in LangChain.",
      tool_calls: [
        {
          id: "call_1",
          name: "langchain_query",
          args: {
            input: "creating simple chains implementation steps",
          },
        },
      ],
    }),
    new ToolMessage({
      tool_call_id: "call_1",
      content: "Here's information about creating simple chains in LangChain...",
    }),
    new AIMessage("To create a simple chain in LangChain, you'll need to follow these steps..."),

    new HumanMessage("What are embeddings used for?"),
    new AIMessage({
      content: "I'll look up information about embeddings in LangChain.",
      tool_calls: [
        {
          id: "call_2",
          name: "langchain_query",
          args: {
            input: "embeddings purpose and usage",
          },
        },
      ],
    }),
    new ToolMessage({
      tool_call_id: "call_2",
      content: "Here's information about embeddings in LangChain...",
    }),
    new AIMessage("Embeddings in LangChain are used for converting text into numerical vectors..."),
  ];

  // Test with a new query
  const query = "How do I use memory in LangChain?";
  messages.push(new HumanMessage(query));

  const response = await modelWithTool.invoke(messages);
  
  console.log("Query:", query);
  console.log("\nTool Calls:", JSON.stringify(response.tool_calls, null, 2));
  console.log("\nResponse:", response.content);
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}