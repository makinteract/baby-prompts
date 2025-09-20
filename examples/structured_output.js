import { getPrompt, invoke, json, jsonFormatter, developer } from '../index.js';
import { z } from 'zod';

// Get the prompt function with custom options
const prompt = getPrompt('You are a helpful assistant', {
  model: 'gpt-4.1-mini',
  temperature: 0,
}); // { model: 'gpt-5' ...}

// Create a JSON schema
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
  .then(jsonFormatter(PeopleList))
  .then(invoke)
  .then(json)
  .then(console.log);
