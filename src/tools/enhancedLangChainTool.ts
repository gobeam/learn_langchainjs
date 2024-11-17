import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

// Define the schema for our enhanced LangChain tool
const enhancedLangChainSchema = z.object({
    query: z.string().describe("The query about LangChain"),
    type: z
        .enum(["concept", "code", "example", "guide"])
        .describe("The type of information to return"),
    context: z
        .string()
        .optional()
        .describe("Additional context to help with the query"),
});

const langchainKnowledgeTool = tool(
    async ({ query, type, context }) => {
        switch (type) {
            case "example":
                return "Here's a guide for creating simple chains in LangChain:\n1. First import the necessary components\n2. Create your model\n3. Define the prompt\n4. Compose the chain\n5. Run the chain";
            case "concept":
                return "Embeddings in LangChain are vector representations of text that capture semantic meaning. They're used for: 1. Creating vector stores 2. Semantic search 3. Document comparison";
            case "guide":
                return "Step-by-step guide for creating simple chains in LangChain:\n1. First import the necessary components\n2. Create your model\n3. Define the prompt\n4. Compose the chain\n5. Run the chain";
            case "code":
                return "Here's a code example for creating a simple chain in LangChain:\n```python\nfrom langchain import Chain\n\nchain = Chain()\nchain.add_step('Hello, world!')\nchain.run()\n```";
            default:
                return "No information found for the query.";
        }
    },
    {
        name: "langchain_knowledge",
        description:
            "Tool for querying LangChain documentation and examples for knowledge.",
        schema: enhancedLangChainSchema,
    }
);


export const createLangChainAssistant = (apiKey: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
        openAIApiKey: apiKey,
    });

    // const enhancedTool = createEnhancedLangChainTool();
    const modelWithTool = model.bindTools([langchainKnowledgeTool]);

    return async (query: string) => {
        const messages = [
            ...[
                new HumanMessage("How do I create a simple chain?"),
                new AIMessage({
                    content:
                        "Let me find information about creating chains in LangChain.",
                    additional_kwargs: {
                        tool_calls: [
                            {
                                id: "fs_1",
                                type: "function",
                                function: {
                                    name: "enhanced_langchain",
                                    arguments: JSON.stringify({
                                        query: "creating simple chains",
                                        type: "example",
                                        context: "step-by-step guide",
                                    }),
                                },
                            },
                        ],
                    },
                }),
                new ToolMessage({
                    content:
                        "Here's a guide for creating simple chains in LangChain:\n1. First import the necessary components\n2. Create your model\n3. Define the prompt\n4. Compose the chain\n5. Run the chain",
                    tool_call_id: "fs_1",
                    name: "enhanced_langchain",
                }),
                new AIMessage(
                    "Based on the guide, I can help you create a simple chain. Would you like me to walk you through each step?"
                ),

                new HumanMessage("What are embeddings in LangChain?"),
                new AIMessage({
                    content: "I'll search for information about embeddings.",
                    additional_kwargs: {
                        tool_calls: [
                            {
                                id: "fs_2",
                                type: "function",
                                function: {
                                    name: "enhanced_langchain",
                                    arguments: JSON.stringify({
                                        query: "embeddings explanation",
                                        type: "concept",
                                        context: "basic understanding",
                                    }),
                                },
                            },
                        ],
                    },
                }),
                new ToolMessage({
                    content:
                        "Embeddings in LangChain are vector representations of text that capture semantic meaning. They're used for: 1. Creating vector stores 2. Semantic search 3. Document comparison",
                    tool_call_id: "fs_2",
                    name: "enhanced_langchain",
                }),
                new AIMessage(
                    "Embeddings are numerical representations of text that help capture meaning. They're essential for tasks like semantic search and document comparison. Would you like to know more about any specific aspect?"
                ),
            ],
            new HumanMessage(query),
        ];
        return modelWithTool.invoke(messages);
    };
};
