import { ta } from 'zod/v4/locales';
import {
  getPrompt,
  invoke,
  outputText,
  user,
  developer,
  tap,
  withOptions,
} from '../index.js';
//  from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt({
  model: 'gpt-4.1-nano',
  temperature: 0.7,
});

// Basic usage
const textResult = await prompt('What is 1+10?')
  .pipe(tap) // see what we pass to the LLM
  .pipe(invoke) // call the model
  .pipe(outputText)
  .pipe(tap);

// do something with textResult

// A slightly more complex example with streaming
const textJoke = await prompt(
  developer('You are a funny guy'),
  user('Tell me a joke')
)
  .pipe(withOptions({ temperature: 0 })) // override devault options
  .pipe(tap) // see what we pass to the LLM
  .pipe(invoke)
  .pipe(outputText);

console.log('Joke:', textJoke);
