/**
 * Document Storage Module
 *
 * Abstracts file storage for uploaded documents.
 * Uses local filesystem in development, can be swapped for cloud storage in production.
 */

import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Storage directory - in the project root for dev
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export interface StoredDocument {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
}

export interface DocumentStorage {
  upload(file: File | Buffer, originalName: string, mimeType: string): Promise<StoredDocument>;
  download(storagePath: string): Promise<Buffer>;
  delete(storagePath: string): Promise<void>;
  getPublicUrl(storagePath: string): string;
}

/**
 * Local filesystem storage implementation
 */
class LocalDocumentStorage implements DocumentStorage {
  private uploadDir: string;

  constructor(uploadDir: string = UPLOAD_DIR) {
    this.uploadDir = uploadDir;
  }

  private async ensureDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  private getExtension(mimeType: string, originalName: string): string {
    // Try to get extension from original filename first
    const originalExt = path.extname(originalName).toLowerCase();
    if (originalExt) {
      return originalExt;
    }

    // Fall back to mime type mapping
    const mimeToExt: Record<string, string> = {
      "application/pdf": ".pdf",
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/heic": ".heic",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
      "text/plain": ".txt",
    };

    return mimeToExt[mimeType] || ".bin";
  }

  async upload(
    file: File | Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredDocument> {
    await this.ensureDir();

    // Generate unique filename
    const ext = this.getExtension(mimeType, originalName);
    const filename = `${uuidv4()}${ext}`;
    const storagePath = path.join(this.uploadDir, filename);

    // Convert File to Buffer if needed
    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      // file is a File object
      const arrayBuffer = await (file as File).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    // Write file
    await writeFile(storagePath, buffer);

    return {
      filename,
      originalName,
      mimeType,
      size: buffer.length,
      storagePath,
    };
  }

  async download(storagePath: string): Promise<Buffer> {
    return readFile(storagePath);
  }

  async delete(storagePath: string): Promise<void> {
    if (existsSync(storagePath)) {
      await unlink(storagePath);
    }
  }

  getPublicUrl(storagePath: string): string {
    // In local dev, we'd serve from /api/documents/[id]/file
    // This is a placeholder - the actual URL depends on how we serve files
    return `/api/documents/file?path=${encodeURIComponent(storagePath)}`;
  }
}

// Singleton instance
let storageInstance: DocumentStorage | null = null;

export function getDocumentStorage(): DocumentStorage {
  if (!storageInstance) {
    storageInstance = new LocalDocumentStorage();
  }
  return storageInstance;
}

// Allowed file types for upload
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(mimeType: string, size: number): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `File type not allowed. Supported types: PDF, images (JPEG, PNG, GIF, WebP), Word documents, and text files.`,
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}
