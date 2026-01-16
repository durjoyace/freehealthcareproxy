/**
 * Appeal Letter Generation API
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAppealLetter } from "@/lib/document-generator";

export async function POST(request: NextRequest) {
  try {
    const { issueId } = await request.json();

    if (!issueId) {
      return NextResponse.json(
        { error: "issueId is required" },
        { status: 400 }
      );
    }

    // Get issue with resolution
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { resolution: true },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Generate appeal letter
    const document = await generateAppealLetter({
      issueType: issue.issueType,
      description: issue.description,
      insurerName: issue.insurerName || undefined,
      providerName: issue.providerName || undefined,
      amountInvolved: issue.amountInvolved || undefined,
      dateOfService: issue.dateOfService || undefined,
      resolution: issue.resolution
        ? {
            whatIsHappening: issue.resolution.whatIsHappening,
            likelihoodOfSuccess: issue.resolution.likelihoodOfSuccess,
            nextSteps: issue.resolution.nextSteps,
            warnings: issue.resolution.warnings || "",
          }
        : undefined,
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error generating appeal letter:", error);
    return NextResponse.json(
      { error: "Failed to generate appeal letter" },
      { status: 500 }
    );
  }
}
