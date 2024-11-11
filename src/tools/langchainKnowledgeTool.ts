import { Tool } from "@langchain/core/tools";
import { RedisVectorService, RedisVectorOptions } from "../services/redisVectorService";

export class LangChainKnowledgeTool extends Tool {
  name = "langchain_knowledge";
  description = "Use this tool when you need to query information about LangChain.js. The tool searches through LangChain documentation and examples to find relevant information.";
  
  private vectorService: RedisVectorService;
  private options: RedisVectorOptions;

  constructor(options: RedisVectorOptions) {
    super();
    this.vectorService = new RedisVectorService();
    this.options = options;
  }

  /** @ignore */
  async _call(input: string) {
    try {
      const results = await this.vectorService.queryVectorStore(input, this.options);
      return results
        .map((doc, index) => `[${index + 1}] ${doc.pageContent}`)
        .join('\n\n');
    } catch (error: any) {
      return `Error querying LangChain knowledge base: ${error.message}`;
    }
  }
}