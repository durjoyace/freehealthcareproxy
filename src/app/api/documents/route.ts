/**
 * Documents API
 *
 * POST - Upload document(s) for an issue
 * GET - List documents for an issue
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getDocumentStorage,
  validateFile,
  ALLOWED_MIME_TYPES,
} from "@/lib/document-storage";
import { analyzeDocument, isVisionSupported } from "@/lib/document-analyzer";
import {
  rateLimit,
  getClientIdentifier,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit check
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(
    `uploadDocument:${clientId}`,
    RATE_LIMITS.uploadDocument
  );

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult.resetIn);
  }

  try {
    const formData = await request.formData();
    const issueId = formData.get("issueId") as string;
    const file = formData.get("file") as File;
    const shouldAnalyze = formData.get("analyze") === "true";

    if (!issueId) {
      return NextResponse.json(
        { error: "issueId is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file.type, file.size);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Verify issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Store the file
    const storage = getDocumentStorage();
    const storedDoc = await storage.upload(file, file.name, file.type);

    // Create document record
    const document = await prisma.document.create({
      data: {
        issueId,
        filename: storedDoc.filename,
        originalName: storedDoc.originalName,
        mimeType: storedDoc.mimeType,
        size: storedDoc.size,
        storagePath: storedDoc.storagePath,
      },
    });

    // Optionally analyze the document with Claude
    if (shouldAnalyze && isVisionSupported(file.type)) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const analysis = await analyzeDocument(
          buffer,
          file.type,
          `Issue type: ${issue.issueType}\nDescription: ${issue.description}`
        );

        // Update document with analysis
        await prisma.document.update({
          where: { id: document.id },
          data: {
            documentType: analysis.documentType,
            analysis: JSON.stringify(analysis),
          },
        });

        return NextResponse.json({
          document: {
            ...document,
            documentType: analysis.documentType,
            analysis,
          },
        });
      } catch (analyzeError) {
        console.error("Error analyzing document:", analyzeError);
        // Return document without analysis if analysis fails
      }
    }

    // Update issue to mark it has documents
    await prisma.issue.update({
      where: { id: issueId },
      data: { hasDocuments: true },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const issueId = searchParams.get("issueId");

  if (!issueId) {
    return NextResponse.json(
      { error: "issueId is required" },
      { status: 400 }
    );
  }

  try {
    const documents = await prisma.document.findMany({
      where: { issueId },
      orderBy: { createdAt: "desc" },
    });

    // Parse analysis JSON for each document
    const parsedDocuments = documents.map((doc) => ({
      ...doc,
      analysis: doc.analysis ? JSON.parse(doc.analysis) : null,
    }));

    return NextResponse.json({ documents: parsedDocuments });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
