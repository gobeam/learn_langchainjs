import { config } from 'dotenv';
import readline from 'readline';
import chalk from "chalk";
import { createTavilyAgent, queryTavilyAgent } from './tools/tavily.tool';
import { createGoogleCalendarAgent, queryGoogleCalendarAgent } from './tools/google-calendar.tool';
import { LangChainKnowledgeTool } from './tools/langchainKnowledgeTool';

config();

const langchainTool = new LangChainKnowledgeTool({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  indexName: "langchain_knowledge",
});

async function main() {
  await createTavilyAgent();
  await createGoogleCalendarAgent();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.blue('Welcome to the AI Assistant! Type "exit" to quit.'));
  console.log(chalk.yellow('You can use the following commands:'));
  console.log(chalk.yellow('- "search: [your query]" to use Tavily search'));
  console.log(chalk.yellow('- "calendar: [your query]" to use Google Calendar'));
  console.log(chalk.yellow('- "langchain: [your query]" to query LangChain knowledge'));

  const askQuestion = () => {
    rl.question(chalk.green('You: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      let result;
      if (input.toLowerCase().startsWith('search:')) {
        result = await queryTavilyAgent(input.slice(7).trim());
      } else if (input.toLowerCase().startsWith('calendar:')) {
        result = await queryGoogleCalendarAgent(input.slice(9).trim());
      } else if (input.toLowerCase().startsWith('langchain:')) {
        result = await langchainTool.call(input.slice(10).trim());
      } else {
        result = "Please start your query with 'search:', 'calendar:', or 'langchain:' to specify which tool to use.";
      }

      console.log(chalk.magenta('AI: ') + chalk.yellow(result));

      askQuestion();
    });
  };

  askQuestion();
}

main().catch((error) => console.error(chalk.red('An error occurred:', error)));