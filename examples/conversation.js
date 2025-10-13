import {
  getPrompt,
  invoke,
  withPreviousResponse,
  outputText,
  promptChain,
} from '../index.js';
// } from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt();

// Basic usage
const res = await prompt('My name is Jon Snow.').pipe(invoke);

// Simple prompt
await prompt('What is my name?')
  .then(withPreviousResponse(res))
  .then(invoke)
  .then(outputText)
  .then(console.log); // "Jon Snow"

// Chained prompts
await promptChain(
  prompt('What is my name?').then(withPreviousResponse(res)),
  prompt('Add an emoji to my name.')
)
  .then(outputText)
  .then(console.log); // "Jon Snow 🐺"
