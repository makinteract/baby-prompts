import { emoji } from 'zod/v4';
import {
  getPrompt,
  promptChain,
  outputText,
  jsonFormatter,
  json,
  user,
  tap,
} from '../index.js';

import { z } from 'zod';
// Get the prompt function with custom options
const prompt = getPrompt('Answer without providing any explanation.', {
  model: 'gpt-4.1-mini',
  temperature: 0,
}); // { model: 'gpt-5' ...}

// Simple
promptChain(
  prompt(user('What is 1+1?')),
  prompt(user('Say that in Italian and without using numbers.')),
  prompt(user('Add an emoji at the end.'))
)
  .then(outputText)
  .then(console.log);

console.log('---');

// With tap and output formatting
const AnswerSchema = z.object({
  answer: z.string().min(2).max(100),
  emoji: z.string().min(1).max(2),
});

promptChain(
  prompt(user('What is 1+1?')), //
  prompt(user('Say that in Italian and without using numbers.')).then(tap), // tap let you see the intermediate result
  prompt(user('Add an emoji at the end.')).then(
    jsonFormatter(AnswerSchema) // last prompt output formatting
  )
)
  .then(json)
  .then(console.log);
