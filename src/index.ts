import { config } from 'dotenv';
import readline from 'readline';
import chalk from "chalk";
import { createTavilyAgent, queryTavilyAgent } from './tools/tavily.tool';

config();

async function main() {
  await createTavilyAgent();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.blue('Welcome to the AI Assistant! Type "exit" to quit.'));

  const askQuestion = () => {
    rl.question(chalk.green('Human: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const result = await queryTavilyAgent(input);
      console.log(chalk.magenta('AI: ') + chalk.yellow(result));

      askQuestion();
    });
  };

  askQuestion();
}

main().catch((error) => console.error(chalk.red('An error occurred:', error)));