import 'dotenv/config';
import { z } from 'zod';

import OpenAI from 'openai';
const client = new OpenAI();

// Schemas
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'developer']),
  content: z.string(),
});

const OptionsSchema = z.object({
  model: z.string().nonempty().optional(),
});

const ResponseSchema = z.object({
  output_text: z.string(),
});

const InputText = z.string().nonempty();

// Utilities
export const tap = (response) => {
  ResponseSchema.parse(response);
  console.log(response.output_text);
  return response;
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
export async function zeroShotPrompt(instructions, userInput, options = {}) {
  InputText.parse(instructions);
  InputText.parse(userInput);
  OptionsSchema.parse(options);

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    instructions,
    input: userInput,
    ...options,
  });
  return response;
}

export async function fewShotPrompt(messages, options = {}) {
  z.array(MessageSchema).parse(messages);
  OptionsSchema.parse(options);

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: messages,
    ...options,
  });
  return response;
}

export function promptLink(userInput, options = {}) {
  z.union([InputText, z.array(MessageSchema)]).parse(userInput);
  OptionsSchema.parse(options);
  const prompt = typeof userInput === 'string' ? [user(userInput)] : userInput;

  return async function (prevOutput) {
    z.union([InputText, ResponseSchema]).parse(prevOutput);
    const assistantMessage =
      typeof prevOutput === 'string' ? prevOutput : prevOutput.output_text;

    let input = prompt;
    if (prevOutput) input = [assistant(assistantMessage), ...prompt];

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input,
      ...options,
    });
    return response;
  };
}

export const promptChain =
  (...fns) =>
  (userInput = 'You are a helpful assistant') =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(userInput));
