import 'dotenv/config';
import { z } from 'zod';

import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

const client = new OpenAI();

// Schemas
const InputText = z.string().nonempty();

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'developer']),
  content: InputText,
});

const OptionsSchema = z.object({
  model: InputText.optional(),
});

const ResponseSchema = z.object({
  output_text: InputText,
});

const InputField = z.object({
  input: z.array(MessageSchema),
});

// Utilities
export const tap = (x) => {
  console.log(x);
  return x;
};
export const assistant = (text = '') => {
  InputText.parse(text);
  return { role: 'assistant', content: text };
};
export const developer = (text = '') => {
  InputText.parse(text);
  return { role: 'developer', content: text };
};
export const user = (text = '') => {
  InputText.parse(text);
  return { role: 'user', content: text };
};

// Prompts

export function getPrompt(
  instructions = 'You are a helpful assistant',
  options = {}
) {
  InputText.parse(instructions);
  OptionsSchema.parse(options);

  return async (...messages) => {
    z.array(z.union([MessageSchema, InputText])).parse(messages);

    messages = messages.map((m) => (typeof m === 'string' ? user(m) : m));
    messages = [developer(instructions), ...messages];

    const params = {
      model: 'gpt-4.1-mini',
      input: messages,
      ...options,
    };

    return params;
    // return client.responses.create(params);
  };
}

const formatOutput = (params, schema) => {
  return Promise.resolve(params).then((p) => {
    p.text = p.text || {};
    p.text.format = zodTextFormat(schema, 'OutputSchema');
    return p;
  });
};

// Helpers

function printOutText({ output_text }) {
  console.log(output_text);
}

function invoke(params) {
  return Promise.resolve(params).then((res) => client.responses.create(res));
}

async function promptChain(...params) {
  // Hidden helper
  const responseAdapter = (response) => {
    ResponseSchema.parse(response);
    return assistant(response.output_text);
  };

  // Start here the chain execution
  InputField.parse(params);
  let prevResponse;
  for await (const p of params) {
    if (prevResponse) {
      // add to front of input array
      p.input = [responseAdapter(prevResponse), ...p.input];
    }
    prevResponse = await invoke(p);
  }
  return prevResponse;
}

// Examples
const prompt = getPrompt('You are a helpful assistant');

/*
// Zero shot
prompt('What is 1+1?').then(tap).then(invoke).then(printOutText);

// Same
const p = prompt('What is 1+1?');
const res = await invoke(p);
printOutText(res);

// Few shot
prompt(
  'What is 1+1?',
  user('What is 2+2?'),
  developer('Answer using words, not numbers.')
)
  .then(tap)
  .then(invoke)
  .then(printOutText);

// Chain

promptChain(
  prompt(developer('Be super short in answering'), user('What is 1+1?')), //
  prompt('Add 3 to the previous answer.'),
  prompt('Add an emoji at the end.')
).then(printOutText);
*/

// Zero shot
const formatscheme = z.object({
  result: z.number().min(0).max(100),
});

formatOutput(
  prompt('What is 1+20? Give result in a JSON format.'),
  formatscheme
)
  .then(tap)
  .then(invoke)
  // .then(tap)
  .then(printOutText);
