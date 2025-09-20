import {
  getPrompt,
  invoke,
  outputText,
  developer,
  user,
  assistant,
} from '../index.js';

// Get the prompt function with custom options
const prompt = getPrompt('You are a helpful assistant.', {
  model: 'gpt-4.1-mini',
  temperature: 0,
}); // { model: 'gpt-5' ...}

//  Few shot
prompt(
  developer('Ask a question following this style'),
  user('How are you?'),
  assistant('How are you, human?'),
  user('What time is it?'),
  assistant('What time is it, human?'),
  user('Where are you from?'),
  assistant('Where are you from, human?'),
  user('What is your age?') // expected: "What is your age, human?"
)
  .then(invoke)
  .then(outputText)
  .then(console.log);

// Same
prompt(
  developer('As a question following this style'),
  'How are you?',
  assistant('How are you, human?'),
  'What time is it?',
  assistant('What time is it, human?'),
  'Where are you from?',
  assistant('Where are you from, human?'),
  'What is your age?' // expected: "What is your age, human?"
)
  .then(invoke)
  .then(outputText)
  .then(console.log);
