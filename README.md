# Baby Prompts

Install the library by typing `npm install baby-prompts`.

## Usage

> Note
> For the following tutorials I will use the following function to print out the results

```js
function printOutText({ output_text }) {
  console.log(output_text);
}
```

### One shot prompting

```js
import { oneShotPrompt } from 'baby-prompts';

// oneShotPrompt('Instructions', 'Prompt').then(printOutText);
oneShotPrompt('You are a helpful assistant', 'Hi').then(printOutText);
```

### Few shots prompting

```js
import { fewShotsPrompt, user, assistant, developer } from 'baby-prompts';

fewShotsPrompt([
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
