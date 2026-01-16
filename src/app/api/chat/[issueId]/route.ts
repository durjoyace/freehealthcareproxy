/**
 * Chat API
 *
 * POST - Send message and get streaming response
 * GET - Get conversation history
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const CHAT_SYSTEM_PROMPT = `You are a helpful healthcare advocacy assistant. You're helping someone who has already received an Issue Resolution Map for their healthcare administrative problem.

Your role is to:
1. Answer their follow-up questions about their situation
2. Provide more specific guidance on action steps
3. Help them understand confusing healthcare terminology
4. Offer encouragement and support

Important guidelines:
- Be conversational but professional
- Reference their specific situation (issue type, resolution map details) when relevant
- If they ask about something outside healthcare administration, politely redirect
- Never provide medical advice or legal counsel
- Keep responses concise but helpful (2-4 paragraphs max unless they need detailed instructions)

Remember: You're their advocate, helping them navigate a confusing system.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const { issueId } = await params;

  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get issue with resolution
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        resolution: true,
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              take: 20, // Limit history to last 20 messages for context window
            },
          },
        },
      },
    });

    if (!issue) {
      return new Response(JSON.stringify({ error: "Issue not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create or get conversation
    let conversation = issue.conversation;
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          issueId,
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    // Build context for Claude
    const contextMessage = buildContextMessage(issue);

    // Build message history
    const messages: Anthropic.MessageParam[] = [];

    // Add context as first user message if this is the start
    if (conversation.messages.length === 0) {
      messages.push({
        role: "user",
        content: contextMessage,
      });
      messages.push({
        role: "assistant",
        content:
          "I understand your situation. I have your Issue Resolution Map and I'm here to help you with any questions about your " +
          getIssueTypeLabel(issue.issueType) +
          ". What would you like to know?",
      });
    }

    // Add conversation history
    for (const msg of conversation.messages) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }

    // Add new user message
    messages.push({
      role: "user",
      content: message,
    });

    // Create streaming response
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({ apiKey });

    // Create the stream
    const stream = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      messages,
      stream: true,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Save assistant message after streaming completes
          await prisma.message.create({
            data: {
              conversationId: conversation!.id,
              role: "assistant",
              content: fullResponse,
            },
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const { issueId } = await params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { issueId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ messages: conversation.messages }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch conversation" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildContextMessage(issue: {
  issueType: string;
  description: string;
  insurerName: string | null;
  providerName: string | null;
  amountInvolved: number | null;
  resolution: {
    whatIsHappening: string;
    likelihoodOfSuccess: string;
    estimatedTimeframe: string;
  } | null;
}): string {
  const parts = [
    `I need help with a healthcare issue.`,
    ``,
    `Issue Type: ${getIssueTypeLabel(issue.issueType)}`,
    ``,
    `My Situation: ${issue.description}`,
  ];

  if (issue.insurerName) {
    parts.push(`Insurance Company: ${issue.insurerName}`);
  }
  if (issue.providerName) {
    parts.push(`Healthcare Provider: ${issue.providerName}`);
  }
  if (issue.amountInvolved) {
    parts.push(`Amount Involved: $${issue.amountInvolved.toLocaleString()}`);
  }

  if (issue.resolution) {
    parts.push(``);
    parts.push(`My Resolution Map says:`);
    parts.push(`- What's happening: ${issue.resolution.whatIsHappening}`);
    parts.push(`- Likelihood of success: ${issue.resolution.likelihoodOfSuccess}`);
    parts.push(`- Estimated timeframe: ${issue.resolution.estimatedTimeframe}`);
  }

  return parts.join("\n");
}

function getIssueTypeLabel(issueType: string): string {
  const labels: Record<string, string> = {
    denial: "Insurance Denial",
    bill: "Medical Bill / EOB Issue",
    prior_auth: "Prior Authorization Issue",
    records: "Medical Records Request",
    claim_pending: "Pending Insurance Claim",
  };
  return labels[issueType] || issueType;
}
