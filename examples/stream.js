import { getPrompt, invoke, outputText, developer } from '../index.js';
// import { getPrompt, invoke, outputText, developer } from 'baby-prompts';

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
