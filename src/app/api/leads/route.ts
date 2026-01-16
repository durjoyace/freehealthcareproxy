import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId, email, phone, preferredContact, notes } = body;

    if (!issueId || !email) {
      return NextResponse.json(
        { error: "Issue ID and email are required" },
        { status: 400 }
      );
    }

    // Verify the issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Create the lead capture record
    const lead = await prisma.leadCapture.create({
      data: {
        issueId,
        email,
        phone: phone || null,
        preferredContact: preferredContact || "email",
        notes: notes || null,
      },
    });

    return NextResponse.json({ leadId: lead.id });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
