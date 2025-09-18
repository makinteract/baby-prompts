import {
  zeroShotPrompt,
  fewShotPrompt,
  promptChain,
  promptLink,
  user,
  assistant,
  developer,
  tap,
} from '../index.js';

function printOutText({ output_text }) {
  console.log(output_text);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Zero shot
zeroShotPrompt('You are a helpful assistant', 'What is 2 + 2?').then(
  printOutText
);

// Few shots
fewShotPrompt([
  developer('You are not a good calculator, off of 1'), //
  user('What is 2 + 2?'),
  assistant('5'),
  user('What is 3 + 3?'),
  assistant('7'),
  user('What is 4 + 4?'),
]).then(printOutText);

// Chain of prompts
promptChain(
  promptLink('What is 2 + 2?'), // you can use a string
  tap, // use tap to see intermediate steps
  promptLink('What is the square root of that?'), // another chained string prompt
  promptLink([
    // you can also use an array of messages
    developer('Be brief and just give the number.'),
    user('Say the result in Italian.'),
  ])
)('You are an helpful assistant.').then(printOutText);

// Changing model and reasoning effort in a single prompt
zeroShotPrompt(
  'You are a helpful assistant that translates English to French.',
  'Translate the following English text to French: "Hello, how are you?"',
  {
    model: 'gpt-5',
    reasoning: { effort: 'medium' },
  }
).then(printOutText);
