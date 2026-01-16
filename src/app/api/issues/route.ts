import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";
import {
  resolutionGenerator,
  type IssueType,
  type IssueInput,
} from "@/lib/resolution-generator";
import { cookies } from "next/headers";

// Get or create session ID from cookie
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    sessionId = uuidv4();
  }

  return sessionId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = await getSessionId();

    const {
      issueType,
      description,
      insurerName,
      providerName,
      amountInvolved,
      dateOfService,
    } = body;

    // Validate required fields
    if (!issueType || !description) {
      return NextResponse.json(
        { error: "Issue type and description are required" },
        { status: 400 }
      );
    }

    // Create the issue in the database
    const issue = await prisma.issue.create({
      data: {
        sessionId,
        issueType,
        description,
        insurerName: insurerName || null,
        providerName: providerName || null,
        amountInvolved: amountInvolved || null,
        dateOfService: dateOfService || null,
        hasDocuments: false,
      },
    });

    // Generate the resolution map
    const input: IssueInput = {
      issueType: issueType as IssueType,
      description,
      insurerName: insurerName || undefined,
      providerName: providerName || undefined,
      amountInvolved: amountInvolved || undefined,
      dateOfService: dateOfService || undefined,
      hasDocuments: false,
    };

    const resolutionMap = await resolutionGenerator.generate(input);

    // Store the resolution
    await prisma.resolution.create({
      data: {
        issueId: issue.id,
        whatIsHappening: resolutionMap.whatIsHappening,
        whoIsResponsible: JSON.stringify(resolutionMap.whoIsResponsible),
        likelihoodOfSuccess: resolutionMap.likelihoodOfSuccess,
        likelihoodReason: resolutionMap.likelihoodReason,
        nextSteps: JSON.stringify(resolutionMap.nextSteps),
        documentsNeeded: JSON.stringify(resolutionMap.documentsNeeded),
        estimatedTimeframe: resolutionMap.estimatedTimeframe,
        warnings: JSON.stringify(resolutionMap.warnings),
      },
    });

    // Set session cookie in response
    const response = NextResponse.json({ issueId: issue.id });
    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const { searchParams } = new URL(request.url);
    const issueId = searchParams.get("id");

    if (issueId) {
      const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { resolution: true },
      });

      if (!issue) {
        return NextResponse.json({ error: "Issue not found" }, { status: 404 });
      }

      return NextResponse.json(issue);
    }

    // Return all issues for this session
    const issues = await prisma.issue.findMany({
      where: { sessionId },
      include: { resolution: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
