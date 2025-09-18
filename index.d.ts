export interface Message {
  role: 'user' | 'assistant' | 'developer';
  content: string;
}

export interface Options {
  model: string;
  [key: string]: unknown;
}

export interface Response {
  output_text: string;
  [key: string]: unknown;
}

export function tap(x: Response): Response;
export function assistant(text?: string): Message;
export function developer(text?: string): Message;
export function user(text?: string): Message;

export function zeroShotPrompt(
  instructions: string,
  userInput: string,
  options?: Options
): Promise<Response>;

export function fewShotPrompt(
  messages: Message[],
  options?: Options
): Promise<Response>;

// type PromptFunction = (prompt: readonly string) => Promise<Response>;
// type PromptLinkFunction = (prompt: readonly string) => LinkFunction;
// type LinkFunction = (previousContext: Message) => Promise<Response>;

/**
 * A chain of prompt functions that are executed in sequence (pipe)
 * @param functions the prompt functions to chain
 */
// export function chain(...functions: LinkFunction[]): Promise<Response>;

/**
 * Get a prompt function that uses the provided model.
 * @param promptOptions The options to use for the prompt.
 * @param thread The thread of messages to use as context.
 * @returns A prompt function that uses the provided model.
 */
// export function getPrompt(
//   promptOptions: readonly Options,
//   thread?: Message[]
// ): PromptFunction;

/**
 * Get a chainable prompt function that uses the provided model and the previous context.
 * @param promptOptions The options to use for the prompt.
 * @param thread The thread of messages to use as context.
 * @returns A chainable prompt function that uses the provided model and the previous context.
 */
export function getPromptLink(
  promptOptions: readonly Options,
  thread?: Message[]
): PromptLinkFunction;
