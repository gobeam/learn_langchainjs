import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool,
} from "@langchain/community/tools/google_calendar";
import { getLanguageModel } from "../utils/model.util";
import { BaseLLM } from "@langchain/core/language_models/llms";

let calendarAgent: any;

export async function createGoogleCalendarAgent() {
  const model = getLanguageModel() as BaseLLM;

  const googleCalendarParams = {
    credentials: {
      clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
      calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
    },
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    model,
  };

  const tools = [
    new GoogleCalendarCreateTool(googleCalendarParams),
    new GoogleCalendarViewTool(googleCalendarParams),
  ];

  calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  return calendarAgent;
}

export async function queryGoogleCalendarAgent(input: string) {
  try {
    if (!calendarAgent) {
      await createGoogleCalendarAgent();
    }
    const result = await calendarAgent.invoke({ input });
    return result.output;
  } catch (error) {
    console.error('An error occurred:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}