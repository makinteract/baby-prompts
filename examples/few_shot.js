import {
  getPrompt,
  invoke,
  outputText,
  developer,
  user,
  assistant,
  tap,
} from '../index.js';
// } from 'baby-prompts';

const prompt = getPrompt();

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
  .pipe(invoke)
  .pipe(outputText)
  .pipe(tap);

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
  .pipe(invoke)
  .pipe(outputText)
  .pipe(tap);
