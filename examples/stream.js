import { getPrompt, invoke, withOptions, developer } from '../index.js'; //from 'baby-prompts';

const prompt = getPrompt();

// Basic usage
const stream = await prompt(user('Write a paragraph about the ocean'))
  .pipe(withOptions({ stream: true }))
  .pipe(invoke);

for await (const event of stream) {
  if (event.type == 'response.output_text.delta')
    process.stdout.write(event.delta);
}
