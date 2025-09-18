/**
 * Represents a message in the conversation.
 */
export interface Message {
  role: 'user' | 'assistant' | 'developer';
  content: string;
}

/**
 * Options for configuring the model prompt.
 */
export interface Options {
  model: string;
  [key: string]: unknown;
}

/**
 * The response object returned by the model.
 */
export interface Response {
  output_text: string;
  [key: string]: unknown;
}

/**
 * Tap into the response object for further processing.
 * @param response The response object to tap into.
 * @returns The same response object for further chaining.
 * @throws Propagates any error encountered during processing.
 */
export function tap(response: Response): Response | never;

/** Create a message object with the specified role and content.
 * @param text The content of the message.
 * @returns A Message object with the specified role and content.
 * @throws Propagates any error encountered during message creation.
 */
export function assistant(text?: string): Message | never;

/** Create a message object with the specified role and content.
 * @param text The content of the message.
 * @returns A Message object with the specified role and content.
 * @throws Propagates any error encountered during message creation.
 */
export function developer(text?: string): Message | never;

/** Create a message object with the specified role and content.
 * @param text The content of the message.
 * @returns A Message object with the specified role and content.
 * @throws Propagates any error encountered during message creation.
 */
export function user(text?: string): Message | never;

/**
 * Prompt the model with zero-shot learning.
 * @param instructions The instructions for the model.
 * @param userInput The user input for the model.
 * @param options The options to use for the prompt, including the model.
 */
export function zeroShotPrompt(
  instructions: string,
  userInput: string,
  options?: Options
): Promise<Response> | never;

/**
 * Prompt the model with few-shot learning.
 * @param messages An array of messages including instructions, examples, and user input.
 * @param options The options to use for the prompt, including the model.
 * @returns A Promise that resolves to the model's response.
 */
export function fewShotPrompt(
  messages: Message[],
  options?: Options
): Promise<Response> | never;

/**
 * Get a chainable prompt function that uses the provided model and the previous context.
 * @param userInput The user input as a string or an array of messages.
 * @param options The options to use for the prompt, including the model.
 * @returns A chainable function that takes the previous output and returns a Promise<Response>.
 */
export type PromptLinkFunction = (
  userInput: string | Message[],
  options?: Options
) => (prevOutput?: string | Response) => Promise<Response> | never;

/**
 * Chains multiple prompt functions together.
 * Each function receives the output of the previous function as input.
 * The first function receives the user input as a string.
 * The last function returns a Promise<Response>.
 * If any function throws an error, the chain is aborted and the error is propagated.
 */
export const promptChain: (
  ...fns: PromptLinkFunction[]
) => (userInput?: string) => Promise<Response> | never;
