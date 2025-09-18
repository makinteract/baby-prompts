# Baby Prompts

Providing super basic prompt techniques and chains for OpenAI's response API.

## Installation

Install the library by typing

`npm install baby-prompts`

## Usage

Here are some examples of how to use different prompting techniques:

- Zero-shot prompting
- Few-shot prompting
- Prompt chains

> Note  
> For the following tutorials, I will use the following function to print out the results

```js
function printOutText({ output_text }) {
  console.log(output_text);
}
```

### Zero shot prompting

```js
import { zeroShotPrompt } from 'baby-prompts';

// zeroShotPrompt('Instructions', 'Prompt').then(printOutText);
zeroShotPrompt('You are a helpful assistant', 'Hi').then(printOutText);
```

### Few shots prompting

```js
import { fewShotPrompt, user, assistant, developer } from 'baby-prompts';

fewShotPrompt([
  developer('You are not a good calculator, off of 1'), //
  user('What is 2 + 2?'),
  assistant('5'),
  user('What is 3 + 3?'),
  assistant('7'),
  user('What is 4 + 4?'),
]).then(printOutText);
```

### Prompt chaining

```js
import { promptChain, promptLink, tap } from 'baby-prompts';

// Chain of prompts
promptChain(
  promptLink('What is 2 + 2?'),
  // tap, // use tap to see intermediate steps
  promptLink('What is the square root of that?'),
  promptLink('Say the result in Italian.')
)().then(printOutText);
```

or this way

```js
promptChain(
  promptLink('What is 2 + 2?')
  //...
)('You are a calculator').then(printOutText);
```

## Change options

You may pass different models and options in the `options` parameter. Here is an example:

```js
zeroShotPrompt(
  'You are a helpful assistant that translates English to French.',
  'Translate the following English text to French: "Hello, how are you?"',
  {
    model: 'gpt-5',
    reasoning: { effort: 'medium' },
  }
).then(printOutText);
```

## Requirments

This code requires that you have a `.env` file with the variable `OPENAI_API_KEY` set to your own OpenAI API key. You can find an API key [here](https://platform.openai.com/api-keys).
