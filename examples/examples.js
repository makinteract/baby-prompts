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

// Zero shot
// zeroShotPrompt('You are a helpful assistant', '').then(printOutText);

// Few shots
// fewShotPrompt([
//   developer('You are not a good calculator, off of 1'), //
//   user('What is 2 + 2?'),
//   assistant('5'),
//   user('What is 3 + 3?'),
//   assistant('7'),
//   user('What is 4 + 4?'),
// ]).then(printOutText);

// Chain of prompts
promptChain(
  promptLink('What is 2 + 2?'),
  tap, // use tap to see intermediate steps
  promptLink('What is the square root of that?'),
  promptLink(user('Say the result in Italian.'), developer('Be brief.'))
)().then(printOutText);

// Changing model and reasoning effort in a single prompt
// zeroShotPrompt(
//   'You are a helpful assistant that translates English to French.',
//   'Translate the following English text to French: "Hello, how are you?"',
//   {
//     model: 'gpt-5',
//     reasoning: { effort: 'medium' },
//   }
// ).then(printOutText);
