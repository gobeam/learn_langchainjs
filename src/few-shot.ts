import { config } from 'dotenv';
import readline from 'readline';
import chalk from 'chalk';
import { createLangChainAssistant } from './tools/enhancedLangChainTool.js';

config();

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red('Error: OPENAI_API_KEY is not set in environment variables'));
    process.exit(1);
  }

  const assistant = createLangChainAssistant(process.env.OPENAI_API_KEY);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.blue('Welcome to the Enhanced LangChain Assistant! Type "exit" to quit.'));

  const askQuestion = () => {
    rl.question(chalk.green('You: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const response = await assistant(input);
        console.log(chalk.magenta('AI: ') + chalk.yellow(response.content));
        
        // Log tool usage for debugging
        if (response.additional_kwargs?.tool_calls) {
          console.log(chalk.gray('\nTool Call:'));
          console.log(chalk.gray(
            JSON.stringify(response.additional_kwargs.tool_calls[0].function, null, 2)
          ));
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch((error) => console.error(chalk.red('An error occurred:', error)));