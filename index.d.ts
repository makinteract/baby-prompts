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

export function tap(response: Response): Response | never;
export function assistant(text?: string): Message | never;
export function developer(text?: string): Message | never;
export function user(text?: string): Message | never;

export function zeroShotPrompt(
  instructions: string,
  userInput: string,
  options?: Options
): Promise<Response> | never;

export function fewShotPrompt(
  messages: Message[],
  options?: Options
): Promise<Response> | never;

export type PromptLinkFunction = (
  userInput: string | Message[],
  options?: Options
) => (prevOutput?: string | Response) => Promise<Response> | never;

const promptChain: (
  ...fns: PromptLinkFunction[]
) => (userInput?: string) => Promise<Response> | never;
