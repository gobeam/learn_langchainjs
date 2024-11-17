import { FewShotExample } from "../utils/fewShotUtils";

export const langchainExamples: FewShotExample[] = [
  {
    input: "How do I create a simple chain in LangChain?",
    toolName: "langchain_knowledge",
    toolArgs: {
      query: "create simple chain LangChain.js",
      context: "basic chain creation"
    },
    toolResponse: "To create a simple chain in LangChain.js:\n1. Import necessary components\n2. Create a model\n3. Define your prompt\n4. Create and run the chain",
    finalAnswer: "Based on the documentation, you can create a simple chain in LangChain.js by following these steps..."
  },
  {
    input: "What's the difference between agents and chains?",
    toolName: "langchain_knowledge",
    toolArgs: {
      query: "difference between agents and chains LangChain",
      context: "concepts comparison"
    },
    toolResponse: "Agents are more flexible and can choose tools dynamically, while chains follow a predetermined sequence of steps.",
    finalAnswer: "The key difference between agents and chains in LangChain is their flexibility and autonomy..."
  },
  {
    input: "How can I use vector stores in LangChain?",
    toolName: "langchain_knowledge",
    toolArgs: {
      query: "vector stores usage LangChain implementation",
      context: "vector storage"
    },
    toolResponse: "Vector stores in LangChain are used for storing and retrieving embeddings...",
    finalAnswer: "To use vector stores in LangChain, you'll need to follow these steps..."
  }
];