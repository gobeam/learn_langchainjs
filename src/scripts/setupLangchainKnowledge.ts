import { RedisVectorService } from "../services/redisVectorService";
import { Document } from "@langchain/core/documents";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function setupLangchainKnowledge() {
  const vectorService = new RedisVectorService();
  
  // Load documents from different sources
  const docsDirectory = path.join(__dirname, "../../langchain-docs");
  const documents: Document[] = [];
  
  try {
    // Load documentation from different file types
    const txtDocs = await vectorService.textLoader(path.join(docsDirectory, "examples.txt"));
    
    documents.push(...txtDocs);
    
    // Create vector store
    await vectorService.loadDocuments(documents, {
      openAIApiKey: process.env.OPENAI_API_KEY!,
      indexName: "langchain_knowledge",
    });
    
    console.log("Successfully loaded LangChain knowledge base into Redis vector store");
  } catch (error) {
    console.error("Error setting up LangChain knowledge base:", error);
  }
}

if (require.main === module) {
  setupLangchainKnowledge().then(() => process.exit(0));
}