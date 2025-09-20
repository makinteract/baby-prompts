import { ZodAny } from 'zod/v4';

/**
 * Options for configuring the model prompt.
 */
export interface Options {
  model: string;
}

/**
 * Represents a message in the conversation.
 */
export interface Message {
  role: 'user' | 'assistant' | 'developer';
  content: string;
}

/**
 * The response object returned by the model.
 */
export interface Response {
  output_text: string;
}

/**
 * Parameters for invoking the model, including input messages and optional text.
 */
export interface PromptParams {
  input: Message[];
  text?: Record<string, unknown>;
}

/**
 * A function that takes messages and returns a Promise of a Response.
 * @param messages The messages to send to the model.
 * @returns A Promise that resolves to a Response object.
 * @throws Propagates any error encountered during the prompt process.
 */
export interface Pipeable {
  pipe: (fn: (response: Response) => any) => Pipeable;
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
 * Extract the output text from the response object.
 * @param response The response object from the model.
 * @returns The output text from the response.
 * @throws Propagates any error encountered during processing.
 */
export function outputText(response: Response): string;

/**
 * Extract and parse JSON from the response text.
 * @param response The response object from the model.
 * @returns The parsed JSON object from the response text.
 * @throws Propagates any error encountered during parsing.
 */
export function json(response: Response): Object | never;

/**
 * Format the model's output as JSON according to the provided Zod schema.
 * @param schema The Zod schema to validate the output against.
 * @returns A function that takes PromptParams and returns a Promise of PromptParams with validated text.
 * @throws Propagates any error encountered during validation.
 */
export function jsonFormatter(
  schema: ZodAny
): (params: PromptParams) => Promise<PromptParams> | never;

/**
 * Invoke the model with the specified parameters.
 * @param params The parameters for invoking the model, including input messages and optional text.
 */
export function invoke(params: PromptParams): Promise<Response> | never;

/**
 * Get a prompt function with the specified instructions and options.
 * @param instructions Default instructions for the model.
 * @param options Options for configuring the model prompt.
 */
export function getPrompt(
  instructions: string = 'You are a helpful assistant.',
  options: Options = {}
): Pipeable | never;

/**
 * Chain multiple prompts together, passing the response of one as the input to the next.
 * @param params Parameters for invoking the model, including input messages and optional text.
 * @returns A Pipeable object for chaining further processing on the model's response.
 * @throws Propagates any error encountered during the prompt chain process.
 */
export function promptChain(...params: [PromptParams]): Pipeable | never;
