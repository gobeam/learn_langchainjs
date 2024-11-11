import { OpenAIEmbeddings } from "@langchain/openai";
import { RedisVectorStore } from "@langchain/redis";
import { Document } from "@langchain/core/documents";
import BaseServiceProvider from "./base-provider.service";

export interface RedisVectorOptions {
  openAIApiKey: string;
  indexName: string;
  modelName?: string;
  batchSize?: number;
  timeout?: number;
  maxRetries?: number;
  maxConcurrency?: number;
}

export class RedisVectorService extends BaseServiceProvider {
  private async getVectorStore(options: RedisVectorOptions) {
    await this.checkRedisConnection();
    
    const {
      openAIApiKey,
      indexName,
      modelName = "text-embedding-ada-002",
      batchSize = 512,
      timeout = 60000,
      maxRetries = 3,
      maxConcurrency = 3,
    } = options;

    if (!indexName) {
      throw new Error("Index name is required");
    }
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is required");
    }

    return new RedisVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey,
        modelName,
        batchSize,
        timeout,
        maxRetries,
        maxConcurrency,
      }),
      {
        redisClient: this.client,
        indexName,
      }
    );
  }

  async loadDocuments(docs: Document[], options: RedisVectorOptions) {
    await this.checkRedisConnection();
    const vectorStore = await RedisVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: options.openAIApiKey,
        modelName: options.modelName,
      }),
      {
        redisClient: this.client,
        indexName: options.indexName,
      }
    );
    return vectorStore;
  }

  async queryVectorStore(query: string, options: RedisVectorOptions) {
    const vectorStore = await this.getVectorStore(options);
    const results = await vectorStore.similaritySearch(query, 4);
    return results;
  }

  async deleteVectorStore(options: RedisVectorOptions) {
    const vectorStore = await this.getVectorStore(options);
    await vectorStore.dropIndex(true);
  }
}