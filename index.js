import 'dotenv/config';
import OpenAI from 'openai';
const client = new OpenAI();

// Helpers
export const tap = (x) => {
  console.log(x.output_text);
  return x;
};
export const assistant = (text = '') => ({ role: 'assistant', content: text });
export const developer = (text = '') => ({ role: 'developer', content: text });
export const user = (text = '') => ({ role: 'user', content: text });

// Prompts
export async function oneShotPrompt(instructions, userInput, options = {}) {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    instructions,
    input: userInput,
    ...options,
  });
  return response;
}

export async function fewShotsPrompt(messages, options = {}) {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: messages,
    ...options,
  });
  return response;
}

export function promptLink(userInput, options = {}) {
  return async function ({ output_text: prevOutput }) {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [assistant(prevOutput), user(userInput)],
      ...options,
    });
    return response;
  };
}

export const promptChain =
  (...fns) =>
  (x = '') =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(x));
