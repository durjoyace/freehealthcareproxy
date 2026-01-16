/**
 * Phone Script Generation API
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePhoneScript } from "@/lib/document-generator";

export async function POST(request: NextRequest) {
  try {
    const { issueId, target = "insurance" } = await request.json();

    if (!issueId) {
      return NextResponse.json(
        { error: "issueId is required" },
        { status: 400 }
      );
    }

    // Validate target
    if (!["insurance", "provider", "both"].includes(target)) {
      return NextResponse.json(
        { error: "target must be 'insurance', 'provider', or 'both'" },
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

    // Generate phone script
    const document = await generatePhoneScript(
      {
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
      },
      target as "insurance" | "provider" | "both"
    );

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error generating phone script:", error);
    return NextResponse.json(
      { error: "Failed to generate phone script" },
      { status: 500 }
    );
  }
}
