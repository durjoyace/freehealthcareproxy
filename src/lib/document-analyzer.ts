/**
 * Document Analyzer
 *
 * Uses Claude's vision capabilities to analyze healthcare documents.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface DocumentAnalysis {
  documentType: "eob" | "denial_letter" | "bill" | "insurance_card" | "medical_records" | "other";
  summary: string;
  extractedData: {
    claimNumber?: string;
    dateOfService?: string;
    provider?: string;
    insurer?: string;
    amountBilled?: number;
    amountPaid?: number;
    amountOwed?: number;
    denialReason?: string;
    denialCode?: string;
    appealDeadline?: string;
    memberID?: string;
    groupNumber?: string;
    [key: string]: string | number | undefined;
  };
  keyFindings: string[];
  relevantForIssue: string;
}

const DOCUMENT_ANALYSIS_PROMPT = `You are analyzing a healthcare document (EOB, medical bill, denial letter, insurance card, or medical records) uploaded by someone seeking help with a healthcare administrative issue.

Analyze this document and extract all relevant information. Be thorough but focus on information that would help someone:
- Understand their bill or claim
- Appeal a denial
- Verify charges
- Contact the right parties

Return your analysis as a JSON object with this structure:
{
  "documentType": "eob" | "denial_letter" | "bill" | "insurance_card" | "medical_records" | "other",
  "summary": "Brief 1-2 sentence summary of what this document is",
  "extractedData": {
    "claimNumber": "if found",
    "dateOfService": "if found",
    "provider": "healthcare provider name if found",
    "insurer": "insurance company if found",
    "amountBilled": numeric amount if found,
    "amountPaid": numeric amount if found,
    "amountOwed": numeric amount if found (patient responsibility),
    "denialReason": "if this is a denial, the reason",
    "denialCode": "denial code if present",
    "appealDeadline": "if mentioned",
    "memberID": "insurance member ID if found",
    "groupNumber": "insurance group number if found"
    // include any other relevant fields you find
  },
  "keyFindings": [
    "Important finding 1",
    "Important finding 2",
    // List 3-5 key things the person should know about this document
  ],
  "relevantForIssue": "How this document is relevant to resolving their healthcare issue"
}

Important:
- Only include fields in extractedData if you can actually find them in the document
- For amounts, extract just the number (no $ sign)
- If you can't determine the document type with confidence, use "other"
- Be specific in keyFindings - mention actual numbers, dates, codes found`;

export async function analyzeDocument(
  documentBuffer: Buffer,
  mimeType: string,
  issueContext?: string
): Promise<DocumentAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  const client = new Anthropic({ apiKey });

  // Convert buffer to base64
  const base64Data = documentBuffer.toString("base64");

  // Determine media type for Claude
  const mediaType = getMediaType(mimeType);

  // Build the message content
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  // Add the image/document
  if (mediaType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: base64Data,
      },
    });
  }

  // Add context if provided
  let prompt = DOCUMENT_ANALYSIS_PROMPT;
  if (issueContext) {
    prompt += `\n\nContext about the user's issue:\n${issueContext}`;
  }

  content.push({
    type: "text",
    text: prompt,
  });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    // Extract text response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const analysis = JSON.parse(jsonMatch[0]) as DocumentAnalysis;
    return analysis;
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
}

function getMediaType(
  mimeType: string
): "image/jpeg" | "image/png" | "image/gif" | "image/webp" | null {
  const supportedTypes: Record<string, "image/jpeg" | "image/png" | "image/gif" | "image/webp"> = {
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/gif": "image/gif",
    "image/webp": "image/webp",
  };

  return supportedTypes[mimeType] || null;
}

/**
 * Check if a mime type is supported for vision analysis
 */
export function isVisionSupported(mimeType: string): boolean {
  return getMediaType(mimeType) !== null;
}

/**
 * For PDFs and other documents, we'd need to convert to images first
 * or use a different extraction method. This is a placeholder.
 */
export async function extractTextFromDocument(
  documentBuffer: Buffer,
  mimeType: string
): Promise<string> {
  // For now, if it's a text file, just decode it
  if (mimeType === "text/plain") {
    return documentBuffer.toString("utf-8");
  }

  // For PDFs and other formats, we'd need additional processing
  // This could use pdf-parse, tesseract, or similar
  // For now, return empty and rely on vision for images
  return "";
}
