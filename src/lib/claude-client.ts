/**
 * Claude API Client
 *
 * Singleton wrapper for the Anthropic SDK with error handling and retry logic.
 */

import Anthropic from "@anthropic-ai/sdk";

// Types for Claude messages
export type MessageRole = "user" | "assistant";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ClaudeRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  system?: string;
  tools?: ToolDefinition[];
  toolChoice?: { type: "auto" | "any" | "tool"; name?: string };
}

// Default model - Claude 3.5 Sonnet for good balance of quality and cost
const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.7;

class ClaudeClient {
  private client: Anthropic;
  private static instance: ClaudeClient | null = null;

  private constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    this.client = new Anthropic({ apiKey });
  }

  static getInstance(): ClaudeClient {
    if (!ClaudeClient.instance) {
      ClaudeClient.instance = new ClaudeClient();
    }
    return ClaudeClient.instance;
  }

  /**
   * Send a message to Claude and get a response
   */
  async chat(
    messages: Message[],
    options: ClaudeRequestOptions = {}
  ): Promise<Anthropic.Message> {
    const {
      model = DEFAULT_MODEL,
      maxTokens = DEFAULT_MAX_TOKENS,
      temperature = DEFAULT_TEMPERATURE,
      system,
      tools,
      toolChoice,
    } = options;

    try {
      const requestParams: Anthropic.MessageCreateParams = {
        model,
        max_tokens: maxTokens,
        temperature,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      if (system) {
        requestParams.system = system;
      }

      if (tools && tools.length > 0) {
        requestParams.tools = tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.input_schema as Anthropic.Tool.InputSchema,
        }));
      }

      if (toolChoice) {
        requestParams.tool_choice = toolChoice as Anthropic.ToolChoice;
      }

      const response = await this.client.messages.create(requestParams);
      return response;
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error(`Claude API Error: ${error.status} - ${error.message}`);
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Send a message and get streaming response
   */
  async *chatStream(
    messages: Message[],
    options: ClaudeRequestOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const {
      model = DEFAULT_MODEL,
      maxTokens = DEFAULT_MAX_TOKENS,
      temperature = DEFAULT_TEMPERATURE,
      system,
    } = options;

    try {
      const requestParams: Anthropic.MessageCreateParams = {
        model,
        max_tokens: maxTokens,
        temperature,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      };

      if (system) {
        requestParams.system = system;
      }

      const stream = this.client.messages.stream(requestParams);

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield event.delta.text;
        }
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error(`Claude API Error: ${error.status} - ${error.message}`);
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extract tool call result from a Claude response
   */
  extractToolUse(response: Anthropic.Message): {
    toolName: string;
    toolInput: Record<string, unknown>;
  } | null {
    for (const block of response.content) {
      if (block.type === "tool_use") {
        return {
          toolName: block.name,
          toolInput: block.input as Record<string, unknown>,
        };
      }
    }
    return null;
  }

  /**
   * Extract text content from a Claude response
   */
  extractText(response: Anthropic.Message): string {
    const textBlocks = response.content.filter((block) => block.type === "text");
    return textBlocks.map((block) => {
      if (block.type === "text") {
        return block.text;
      }
      return "";
    }).join("\n");
  }
}

// Export singleton getter
export function getClaudeClient(): ClaudeClient {
  return ClaudeClient.getInstance();
}

export { ClaudeClient };
