# Baby Prompts

[![NPM Version](https://img.shields.io/npm/v/baby-prompts.svg?style=flat)](https://www.npmjs.org/package/<your-package-name>)
[![NPM Downloads](https://img.shields.io/npm/dm/baby-prompts.svg?style=flat)](https://npmcharts.com/compare/<your-package-name>?minimal=true)

Providing super basic prompt techniques and chains for OpenAI's response API.

- [Baby Prompts](#baby-prompts)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Prompt techniques examples](#prompt-techniques-examples)
    - [1. Zero-shot prompting](#1-zero-shot-prompting)
    - [2. Few-shot prompting](#2-few-shot-prompting)
    - [3. Prompt chaining](#3-prompt-chaining)
  - [Streaming](#streaming)
  - [Structured output](#structured-output)
  - [Conversational history](#conversational-history)
  - [Requirments](#requirments)
  - [Credits](#credits)

## Overview

👉 The library allows you to easily create different prompt techniques (see [below](#prompt-techniques-examples)) and choose formatting output.

A full list of examples is available [here](examples).

## Installation

Install the library by typing

`npm install baby-prompts`

## Prompt techniques examples

Before you can invoke any prompt, you need to configure your prompt by choosing a model.

```js
import {
  getPrompt,
  promptChain,
  invoke,
  outputText,
  jsonFormatter,
  json,
  user,
  assistant,
  developer,
  tap,
  withPreviousResponse,
} from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt('You are a helpful assistant.', {
  model: 'gpt-4.1-mini',
  temperature: 0,
});
```

The default model is `gpt-4.1-mini`.

Follow the [OpenAI documentation](https://platform.openai.com/docs/api-reference/introduction) for choosing models and options.

Here are some examples of how to use different prompting techniques:

- _Zero-shot_ prompting
- _Few-shot_ prompting
- Prompt _chains_

### 1. Zero-shot prompting

Here is a simple example of invoking a prompt.

```js
prompt(developer('Be a funny assistant'), 'Tell me a joke') // setup the prompt
  .pipe(invoke) // execute it
  .pipe(outputText) // extract the output_text from the response
  .pipe(console.log); // print it
```

Note that the `pipe` method is basically a `then` call (i.e., method of a Promise).
If you prefer to _async/await_, here is the same code.

```js
const result = await invoke(
  prompt(developer('Be a funny assistant'), 'Tell me a joke')
);
console.log(outputText(result)); // or result.output_text
```

### 2. Few-shot prompting

Multiple messages can be combined before invocation, and you can choose the `user` (default), `developer`, or `assistant` roles. Note that this is still a single prompt (a single _invoke_ method is called).

```js
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
  .pipe(console.log);
```

### 3. Prompt chaining

With prompt chaining, you can chain the output of a prompt directly into the input of the next one.

```js
promptChain(
  prompt(user('What is 1+1?')),
  prompt(user('Say that without using numbers.')),
  prompt(user('Add an emoji at the end.'))
)
  .pipe(outputText)
  .pipe(console.log);
```

Please note that when using chains, you do not need to call the _invoke_ method manually, as it is called for you by the _promptChain_ function.

For more complex examples, involving the usage of the `tap` function and formatted output, look at [this](./examples/chain.js).

## Streaming

When you create a prompt at first you can pass the `stream: true` option to enable streaming.

```js
import { getPrompt, invoke, outputText, developer } from '../index.js';

// Get the prompt function with custom options
const prompt = getPrompt('You are a helpful assistant.', {
  stream: true,
}); // { model: 'gpt-5' ...}

// Basic usage
const stream = await prompt(
  developer('Write a paragraph about the ocean')
).pipe(invoke);

for await (const event of stream) {
  if (event.type == 'response.output_text.delta')
    process.stdout.write(event.delta);
}
```

## Structured output

You can structure the output of a prompt just before invocation. For that, you need to use the [zod](https://www.npmjs.com/package/zod) library, which is already included as a dependency.

```js
import { z } from 'zod';

const Person = z.object({
  name: z.string(),
  age: z.number(),
});

const PeopleList = z.object({
  people: z.array(Person).length(10), // exactly 10 people
});

// prompt
prompt(
  developer('You are a helpful assistant'), //
  'Write a list of 10 people with name and age'
)
  .pipe(jsonFormatter(PeopleList))
  .pipe(invoke)
  .pipe(json)
  .pipe(console.log);
```

## Conversational history

You can preserve information across multiple messages or turns in a conversation by passing a response as an input to the next prompt using the `withPreviousResponse` function.

Here a couple of examples.

```js
import {
  getPrompt,
  invoke,
  withPreviousResponse,
  outputText,
  promptChain,
} from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt(
  'Do not add any explanation. Just return what you are asked for.'
);

// Get the first prompt
const res = await prompt('My name is Jon Snow.').pipe(invoke);

// Using a single prompt
await prompt('What is my name?')
  .then(withPreviousResponse(res)) // pass in the previous response
  .then(invoke)
  .then(outputText)
  .then(console.log); // "Jon Snow"

// Using a chain
await promptChain(
  prompt('What is my name?').then(withPreviousResponse(res)), // pass in the previous response
  prompt('Add an emoji to my name.')
)
  .then(outputText)
  .then(console.log); // "Jon Snow 🐺"
```

## Requirments

This code requires that you have a `.env` file with the variable `OPENAI_API_KEY` set to your own OpenAI API key. You can find an API key [here](https://platform.openai.com/api-keys).

## Credits

Developed by [MAKinteract](https://make.kaist.ac.kr/andrea) with ♥️.
