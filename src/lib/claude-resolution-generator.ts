/**
 * Claude-powered Resolution Generator
 *
 * Uses Claude 3.5 Sonnet with tool_use to generate structured Issue Resolution Maps.
 */

import { getClaudeClient, ToolDefinition } from "./claude-client";
import {
  IssueInput,
  ResolutionMap,
  ResolutionGenerator,
  ResponsibleParty,
  NextStep,
} from "./resolution-generator";
import {
  RESOLUTION_SYSTEM_PROMPT,
  ISSUE_TYPE_CONTEXT,
} from "./prompts/resolution-system-prompt";

// Tool definition for structured output
const RESOLUTION_MAP_TOOL: ToolDefinition = {
  name: "generate_resolution_map",
  description:
    "Generate a structured Issue Resolution Map for a healthcare administrative problem. This tool must be used to provide the response.",
  input_schema: {
    type: "object",
    properties: {
      whatIsHappening: {
        type: "string",
        description:
          "A clear, empathetic explanation of the situation in plain English. 2-4 sentences explaining what's going on and providing context.",
      },
      whoIsResponsible: {
        type: "object",
        description: "Information about who the user should contact",
        properties: {
          parties: {
            type: "array",
            description:
              "List of relevant parties to contact, in order of importance",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Name of the party (use specific name if provided, or generic like 'Your Insurance Company')",
                },
                role: {
                  type: "string",
                  description:
                    "Their role (e.g., 'Insurance Company', 'Healthcare Provider', 'Billing Department')",
                },
                contactMethod: {
                  type: "string",
                  description:
                    "How to contact them (e.g., 'Call member services at the number on your insurance card')",
                },
              },
              required: ["name", "role", "contactMethod"],
            },
          },
          primaryContact: {
            type: "string",
            description:
              "Clear guidance on who to contact FIRST and why (e.g., 'Start with your insurance company to understand the denial reason')",
          },
        },
        required: ["parties", "primaryContact"],
      },
      likelihoodOfSuccess: {
        type: "string",
        enum: ["high", "medium", "low"],
        description:
          "Assessment of how likely this issue is to be resolved favorably based on the situation",
      },
      likelihoodReason: {
        type: "string",
        description:
          "1-2 sentence explanation of why you assessed the likelihood this way. Be honest but encouraging.",
      },
      nextSteps: {
        type: "array",
        description:
          "Ordered list of specific actions the user should take. Be concrete and actionable.",
        items: {
          type: "object",
          properties: {
            order: {
              type: "number",
              description: "Step number (1, 2, 3, etc.)",
            },
            action: {
              type: "string",
              description: "Brief action title (e.g., 'Request Itemized Bill')",
            },
            details: {
              type: "string",
              description:
                "Detailed explanation of how to complete this step, including what to say/ask",
            },
            deadline: {
              type: "string",
              description:
                "Optional deadline or timeframe (e.g., 'Within 7 days', 'Before appeal deadline')",
            },
          },
          required: ["order", "action", "details"],
        },
      },
      documentsNeeded: {
        type: "array",
        description:
          "List of documents the user should gather or request to resolve this issue",
        items: {
          type: "string",
        },
      },
      estimatedTimeframe: {
        type: "string",
        description:
          "Realistic estimate of how long resolution might take (e.g., '2-4 weeks', '30-45 days for appeal')",
      },
      warnings: {
        type: "array",
        description:
          "Important warnings, pitfalls to avoid, or things that could hurt their case. Be specific.",
        items: {
          type: "string",
        },
      },
    },
    required: [
      "whatIsHappening",
      "whoIsResponsible",
      "likelihoodOfSuccess",
      "likelihoodReason",
      "nextSteps",
      "documentsNeeded",
      "estimatedTimeframe",
      "warnings",
    ],
  },
};

/**
 * Claude-powered resolution generator using tool_use for structured output
 */
export class ClaudeResolutionGenerator implements ResolutionGenerator {
  async generate(input: IssueInput): Promise<ResolutionMap> {
    const client = getClaudeClient();

    // Build the user message with all relevant details
    const userMessage = this.buildUserMessage(input);

    // Build the system prompt with issue-specific context
    const systemPrompt = this.buildSystemPrompt(input.issueType);

    try {
      const response = await client.chat(
        [{ role: "user", content: userMessage }],
        {
          system: systemPrompt,
          tools: [RESOLUTION_MAP_TOOL],
          toolChoice: { type: "tool", name: "generate_resolution_map" },
          temperature: 0.7,
          maxTokens: 4096,
        }
      );

      // Extract the tool use result
      const toolUse = client.extractToolUse(response);

      if (!toolUse || toolUse.toolName !== "generate_resolution_map") {
        throw new Error("Claude did not use the resolution map tool");
      }

      // Parse and validate the response
      return this.parseResolutionMap(toolUse.toolInput);
    } catch (error) {
      console.error("Error generating resolution with Claude:", error);
      throw error;
    }
  }

  private buildUserMessage(input: IssueInput): string {
    const parts: string[] = [];

    // Issue type
    const issueTypeLabels: Record<string, string> = {
      denial: "Insurance Denial",
      bill: "Medical Bill / EOB Issue",
      prior_auth: "Prior Authorization Issue",
      records: "Medical Records Request",
      claim_pending: "Pending Insurance Claim",
    };

    parts.push(`## Issue Type: ${issueTypeLabels[input.issueType] || input.issueType}`);

    // Description
    parts.push(`\n## User's Description:\n${input.description}`);

    // Additional details if provided
    const details: string[] = [];

    if (input.insurerName) {
      details.push(`- Insurance Company: ${input.insurerName}`);
    }
    if (input.providerName) {
      details.push(`- Healthcare Provider: ${input.providerName}`);
    }
    if (input.amountInvolved) {
      details.push(`- Amount Involved: $${input.amountInvolved.toLocaleString()}`);
    }
    if (input.dateOfService) {
      details.push(`- Date of Service: ${input.dateOfService}`);
    }

    if (details.length > 0) {
      parts.push(`\n## Additional Details:\n${details.join("\n")}`);
    }

    // Document uploads placeholder (will be enhanced in Phase 2)
    if (input.hasDocuments) {
      parts.push(
        "\n## Documents:\nThe user has uploaded documents related to this issue."
      );
    }

    parts.push(
      "\n\nPlease analyze this situation and generate a comprehensive Issue Resolution Map using the generate_resolution_map tool."
    );

    return parts.join("\n");
  }

  private buildSystemPrompt(issueType: string): string {
    const issueContext = ISSUE_TYPE_CONTEXT[issueType] || "";

    return `${RESOLUTION_SYSTEM_PROMPT}

## Current Issue Context:
${issueContext}`;
  }

  private parseResolutionMap(input: Record<string, unknown>): ResolutionMap {
    // Validate required fields
    const requiredFields = [
      "whatIsHappening",
      "whoIsResponsible",
      "likelihoodOfSuccess",
      "likelihoodReason",
      "nextSteps",
      "documentsNeeded",
      "estimatedTimeframe",
      "warnings",
    ];

    for (const field of requiredFields) {
      if (!(field in input)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Parse whoIsResponsible
    const whoIsResponsible = input.whoIsResponsible as {
      parties: ResponsibleParty[];
      primaryContact: string;
    };

    // Validate parties array
    if (!Array.isArray(whoIsResponsible.parties)) {
      throw new Error("whoIsResponsible.parties must be an array");
    }

    // Parse nextSteps
    const nextSteps = input.nextSteps as NextStep[];
    if (!Array.isArray(nextSteps)) {
      throw new Error("nextSteps must be an array");
    }

    // Parse documentsNeeded
    const documentsNeeded = input.documentsNeeded as string[];
    if (!Array.isArray(documentsNeeded)) {
      throw new Error("documentsNeeded must be an array");
    }

    // Parse warnings
    const warnings = input.warnings as string[];
    if (!Array.isArray(warnings)) {
      throw new Error("warnings must be an array");
    }

    // Validate likelihood
    const likelihood = input.likelihoodOfSuccess as string;
    if (!["high", "medium", "low"].includes(likelihood)) {
      throw new Error("likelihoodOfSuccess must be high, medium, or low");
    }

    return {
      whatIsHappening: input.whatIsHappening as string,
      whoIsResponsible: {
        parties: whoIsResponsible.parties.map((p) => ({
          name: p.name,
          role: p.role,
          contactMethod: p.contactMethod,
        })),
        primaryContact: whoIsResponsible.primaryContact,
      },
      likelihoodOfSuccess: likelihood as "high" | "medium" | "low",
      likelihoodReason: input.likelihoodReason as string,
      nextSteps: nextSteps.map((s, index) => ({
        order: s.order || index + 1,
        action: s.action,
        details: s.details,
        deadline: s.deadline,
      })),
      documentsNeeded,
      estimatedTimeframe: input.estimatedTimeframe as string,
      warnings,
    };
  }
}
