import 'dotenv/config';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

import OpenAI from 'openai';

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
  id: InputText,
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

export const outputText = (response) => {
  ResponseSchema.parse(response);
  return response.output_text;
};

export const responseId = (response) => {
  ResponseSchema.parse(response);
  return response.id;
};

export const json = (response) => {
  ResponseSchema.parse(response);
  return JSON.parse(response.output_text);
};

export const jsonFormatter = (schema) => (params) => {
  InputField.parse(params);
  return Promise.resolve(params).then((p) => {
    p.input.unshift(developer('Output JSON'));
    p.text = p.text || {};
    p.text.format = zodTextFormat(schema, 'OutputSchema');
    return p;
  });
};

// Helpers

function withPipe(promise) {
  promise.pipe = (fn) => withPipe(promise.then(fn));
  return promise;
}

export function withOptions(options) {
  OptionsSchema.parse(options);
  return (params) => {
    z.union([InputField, z.promise(InputField)]).parse(params);
    return {
      ...params,
      ...options,
    };
  };
}

export function withPreviousResponse(prevResponse) {
  ResponseSchema.parse(prevResponse);
  return withOptions({ previous_response_id: prevResponse.id });
}

// Prompts

export function invoke(params) {
  z.union([InputField, z.promise(InputField)]).parse(params);
  return Promise.resolve(params).then((res) => client.responses.create(res));
}

export function getPrompt(
  instructions = 'You are a helpful assistant.',
  options = {}
) {
  InputText.parse(instructions);
  OptionsSchema.parse(options);

  return (...messages) => {
    z.array(z.union([MessageSchema, InputText])).parse(messages);

    messages = messages.map((m) => (typeof m === 'string' ? user(m) : m));
    messages.unshift(developer(instructions));

    const p = Promise.resolve({
      model: 'gpt-4.1-mini',
      input: messages,
      ...options,
    });

    return withPipe(p);
  };
}

export function promptChain(...params) {
  const inner = async () => {
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
  }; // return the last responses
  return withPipe(inner());
}
