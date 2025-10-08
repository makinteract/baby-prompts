import {
  getPrompt,
  promptChain,
  developer,
  jsonFormatter,
  json,
  tap,
  invoke,
  user,
  withPreviousResponse,
} from '../index.js';
// } from 'baby-prompts';

import { z } from 'zod';

const EN_IT_Schema = z.object({
  en: z.string().describe('The original text'),
  it: z.string().describe('The translated text in Italian'),
});

const prompt = getPrompt('You are a funny assistant that tells jokes.', {});

// An example to show all the features together
// A simple prompt
const first = await prompt('My name is John.').pipe(invoke);
// A chains with some spice 🔥
const response = await promptChain(
  prompt(
    developer('Personalize the joke for me'), // Developer prompt
    user('Tell me a joke about my name.') // User prompt
  ).pipe(withPreviousResponse(first)), // Context from previous response
  prompt('Write both the joke in English and Italian').pipe(
    jsonFormatter(EN_IT_Schema) // Choose output format
  )
)
  .pipe(json) // Parse the output as JSON
  .pipe((r) => r.it) // Type safety
  .pipe(tap); // Print only the Italian version
