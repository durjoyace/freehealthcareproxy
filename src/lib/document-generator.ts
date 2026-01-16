/**
 * Document Generator
 *
 * Uses Claude to generate appeal letters, phone scripts, and other documents.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface IssueContext {
  issueType: string;
  description: string;
  insurerName?: string;
  providerName?: string;
  amountInvolved?: number;
  dateOfService?: string;
  resolution?: {
    whatIsHappening: string;
    likelihoodOfSuccess: string;
    nextSteps: string;
    warnings: string;
  };
}

export interface GeneratedDocument {
  title: string;
  content: string;
  instructions: string;
}

const APPEAL_LETTER_PROMPT = `You are an expert at writing healthcare insurance appeal letters. Generate a professional, compelling appeal letter based on the patient's situation.

The letter should:
1. Be addressed to the insurance company's appeals department
2. Include placeholders for information the patient needs to fill in: [YOUR NAME], [YOUR ADDRESS], [MEMBER ID], [CLAIM NUMBER], [DATE OF SERVICE], etc.
3. Reference the specific denial reason and counter it with logical arguments
4. Cite relevant regulations if applicable (ACA provisions, state mandates, ERISA for employer plans)
5. Request a specific action (coverage, payment, reconsideration)
6. Maintain a professional but firm tone
7. Be 1-2 pages in length

Format the letter properly with:
- Date
- Patient's address (placeholder)
- Insurance company's appeals department address (placeholder)
- RE: line with claim info
- Professional greeting
- Body paragraphs
- Closing with signature line

Return the letter in a format ready to be copied and customized.`;

const PHONE_SCRIPT_PROMPT = `You are an expert at helping patients navigate difficult phone calls with insurance companies and healthcare providers. Generate a detailed phone script based on the patient's situation.

The script should:
1. Include what to say when the call is answered
2. Provide the key information to have ready before calling
3. Include specific questions to ask
4. Provide responses to common pushback or obstacles
5. Include what to document during the call
6. Be conversational but professional
7. Include tips for escalation if needed

Format as a clear, easy-to-follow script with:
- BEFORE THE CALL: Things to prepare
- OPENING: What to say when connected
- KEY QUESTIONS: Numbered list of questions to ask
- IF THEY SAY...: Common responses and how to handle them
- CLOSING: How to end the call and what to confirm
- AFTER THE CALL: What to document

Make it practical and actionable.`;

export async function generateAppealLetter(
  context: IssueContext
): Promise<GeneratedDocument> {
  const client = getClient();

  const userMessage = buildContextForGeneration(context, "appeal letter");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: APPEAL_LETTER_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = extractText(response);

  return {
    title: "Insurance Appeal Letter",
    content,
    instructions:
      "Replace all [BRACKETED] placeholders with your actual information before sending. Send via certified mail and keep a copy for your records.",
  };
}

export async function generatePhoneScript(
  context: IssueContext,
  contactTarget: "insurance" | "provider" | "both" = "insurance"
): Promise<GeneratedDocument> {
  const client = getClient();

  let targetDescription = "";
  switch (contactTarget) {
    case "insurance":
      targetDescription = `calling ${context.insurerName || "the insurance company"}`;
      break;
    case "provider":
      targetDescription = `calling ${context.providerName || "the healthcare provider"}`;
      break;
    case "both":
      targetDescription = "calling both the insurance company and healthcare provider";
      break;
  }

  const userMessage =
    buildContextForGeneration(context, `phone script for ${targetDescription}`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: PHONE_SCRIPT_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = extractText(response);

  return {
    title: `Phone Script - ${contactTarget === "insurance" ? "Insurance Company" : contactTarget === "provider" ? "Healthcare Provider" : "Insurance & Provider"}`,
    content,
    instructions:
      "Have this script ready during your call. Take notes on everything discussed, including the name of the person you spoke with, reference numbers, and any promises made.",
  };
}

export async function generateComplaintLetter(
  context: IssueContext,
  recipient: "state_commissioner" | "cms" | "hospital_patient_advocate" = "state_commissioner"
): Promise<GeneratedDocument> {
  const client = getClient();

  const recipientLabels = {
    state_commissioner: "State Insurance Commissioner",
    cms: "Centers for Medicare & Medicaid Services (CMS)",
    hospital_patient_advocate: "Hospital Patient Advocate",
  };

  const systemPrompt = `You are an expert at writing formal complaint letters to healthcare regulatory bodies. Generate a professional complaint letter to the ${recipientLabels[recipient]}.

The letter should:
1. Clearly state this is a formal complaint
2. Include relevant identifying information (placeholders)
3. Describe the issue factually and chronologically
4. Reference any relevant laws or regulations
5. State what resolution is being sought
6. Maintain a professional, factual tone
7. Include any supporting documentation to attach

Format properly as a formal letter.`;

  const userMessage = buildContextForGeneration(
    context,
    `formal complaint letter to ${recipientLabels[recipient]}`
  );

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = extractText(response);

  return {
    title: `Complaint Letter - ${recipientLabels[recipient]}`,
    content,
    instructions:
      "Fill in all placeholders, attach copies of relevant documents, and send via certified mail. Keep copies of everything.",
  };
}

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }
  return new Anthropic({ apiKey });
}

function buildContextForGeneration(
  context: IssueContext,
  documentType: string
): string {
  const parts = [
    `Please generate a ${documentType} for the following situation:`,
    ``,
    `Issue Type: ${getIssueTypeLabel(context.issueType)}`,
    ``,
    `Patient's Description: ${context.description}`,
  ];

  if (context.insurerName) {
    parts.push(`Insurance Company: ${context.insurerName}`);
  }
  if (context.providerName) {
    parts.push(`Healthcare Provider: ${context.providerName}`);
  }
  if (context.amountInvolved) {
    parts.push(`Amount Involved: $${context.amountInvolved.toLocaleString()}`);
  }
  if (context.dateOfService) {
    parts.push(`Date of Service: ${context.dateOfService}`);
  }

  if (context.resolution) {
    parts.push(``);
    parts.push(`Resolution Map Analysis:`);
    parts.push(`- Situation: ${context.resolution.whatIsHappening}`);
    parts.push(`- Likelihood of Success: ${context.resolution.likelihoodOfSuccess}`);
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

function extractText(response: Anthropic.Message): string {
  const textBlock = response.content.find((block) => block.type === "text");
  if (textBlock && textBlock.type === "text") {
    return textBlock.text;
  }
  return "";
}
