import {
  getPrompt,
  promptChain,
  outputText,
  withJsonFormatter,
  json,
  user,
  tap,
} from '../index.js';
// } from 'baby-prompts';

import { z } from 'zod';
// Get the prompt function with custom options
const prompt = getPrompt({
  model: 'gpt-4.1-mini',
  temperature: 0,
}); // { model: 'gpt-5' ...}

// Simple
promptChain(
  prompt(user('What is 1+1?')),
  prompt(user('Say that in Italian and without using numbers.')),
  prompt(user('Add an emoji at the end.'))
)
  .pipe(outputText)
  .pipe(console.log);

// With tap and output formatting
const AnswerSchema = z.object({
  answer: z.string().min(2).max(100),
  emoji: z.string().min(1).max(2),
});

promptChain(
  prompt(user('What is 1+1?')), //
  prompt(user('Say that in Italian and without using numbers.')).pipe(tap), // tap let you see the intermediate result
  prompt(user('Add an emoji at the end.')).pipe(
    withJsonFormatter(AnswerSchema) // last prompt output formatting
  )
)
  .pipe(json)
  .pipe(console.log);
