import {
  getPrompt,
  invoke,
  withPreviousResponse,
  outputText,
  promptChain,
} from '../index.js';
// } from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt(
  'Do not add any explanation. Just return what you are asked for.'
);

// Basic usage
const res = await prompt('My name is Jon Snow.').pipe(invoke);

await prompt('What is my name?')
  .then(withPreviousResponse(res))
  .then(invoke)
  .then(outputText)
  .then(console.log); // "Jon Snow"

await promptChain(
  prompt('What is my name?').then(withPreviousResponse(res)),
  prompt('Add an emoji to my name.')
)
  .then(outputText)
  .then(console.log); // "Jon Snow 🐺"
