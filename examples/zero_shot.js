import { getPrompt, invoke, outputText, developer } from '../index.js'; // from 'baby-prompts';

// Get the prompt function with custom options
const prompt = getPrompt({
  model: 'gpt-4.1-mini',
  temperature: 0,
}); // { model: 'gpt-5' ...}

// Basic usage
prompt(developer('Write the results in binary'), 'What is 1+10?')
  .pipe(invoke)
  .pipe(outputText)
  .pipe(console.log); // or use the `tap` function

// Same using async/await
const result = await invoke(
  prompt(developer('Write the results in binary'), 'What is 1+10?')
);
console.log(outputText(result)); // or result.output_text
