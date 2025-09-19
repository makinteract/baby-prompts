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
  output_text: InputText.optional(),
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

export const formatOutput = (schema) => (params) => {
  z.array(InputField).parse(params);
  return Promise.resolve(params).then((p) => {
    p.input.unshift(developer('Output JSON'));
    p.text = p.text || {};
    p.text.format = zodTextFormat(schema, 'OutputSchema');
    return p;
  });
};

export const json = ({ output_text }) => JSON.parse(output_text);

export const text = ({ output_text }) => output_text;

// Prompts

export function invoke(params) {
  return Promise.resolve(params).then((res) => client.responses.create(res));
}

export function getPrompt(options = {}) {
  OptionsSchema.parse(options);

  return async (...messages) => {
    z.array(z.union([MessageSchema, InputText])).parse(messages);

    messages = messages.map((m) => (typeof m === 'string' ? user(m) : m));

    return {
      model: 'gpt-4.1-mini',
      input: messages,
      ...options,
    };
  };
}

// Helpers

async function promptChain(...params) {
  // Hidden helper
  const responseAdapter = (response) => {
    ResponseSchema.parse(response);
    return assistant(response.output_text);
  };

  // Start here the chain execution
  z.array(z.promise(InputField)).parse(params);

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
const prompt = getPrompt();

// Zero shot
const formatscheme = z.object({
  result: z.number().min(0).max(100),
  result_with_emoji: z.string().min(2).max(10),
});

// Zero shot

prompt('What is 1+1?').then(invoke).then(text).then(console.log);

prompt(developer('Output JSON'), 'What is 1+1?')
  .then(formatOutput(formatscheme))
  .then(invoke)
  .then(json)
  .then(tap);

/*
// Same
const res = await prompt('What is 1+1?', developer('Result in binary'))
  .then(invoke)
  .then(text)
  .then(console.log);

// Few shot
/*
prompt(
  'What is 1+1?',
  user('Add 10 to the previous answer.'),
  developer('Answer using words, not numbers. Encode using JSON format.')
)
  // .then(tap)
  .then(formatOutput(formatscheme))
  .then(invoke)
  .then(json)
  .then(tap);
*/

// Chain

/*
promptChain(
  prompt(developer('Be super short in answering'), user('What is 1+1?')), //
  prompt('Add 3 to the previous answer.').then(tap),
  prompt('Add an emoji at the end.'),
  prompt(developer('Output JSON')).then(formatOutput(formatscheme))
)
  .then(json)
  .then(tap);
*/
