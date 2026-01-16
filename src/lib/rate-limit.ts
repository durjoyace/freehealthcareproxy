/**
 * Simple in-memory rate limiter
 *
 * For production with multiple serverless instances, consider using:
 * - Upstash Redis (https://upstash.com)
 * - Vercel KV
 * - Or implement at the edge with Vercel middleware
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (works per serverless instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  maxRequests: number;  // Max requests per window
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;  // Seconds until reset
}

/**
 * Check if a request should be rate limited
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // Create new entry if none exists or window has passed
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);

  return {
    success: entry.count <= config.maxRequests,
    remaining,
    resetIn,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or falls back to a session-based identifier
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fall back to a hash of user-agent + accept-language as a rough identifier
  const ua = request.headers.get("user-agent") || "unknown";
  const lang = request.headers.get("accept-language") || "unknown";
  return `anonymous-${simpleHash(ua + lang)}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Pre-configured rate limits for different endpoints
export const RATE_LIMITS = {
  // Issue creation - expensive (calls Claude)
  createIssue: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 10 per hour
  },

  // Chat messages - moderate cost
  chat: {
    maxRequests: 30,
    windowMs: 60 * 60 * 1000, // 30 per hour
  },

  // Document generation - expensive
  generateDocument: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 20 per hour
  },

  // Document upload - moderate
  uploadDocument: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 20 per hour
  },

  // General API - for read operations
  general: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 per minute
  },
};

/**
 * Create a rate limit response
 */
export function rateLimitResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
      retryAfter: resetIn,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": resetIn.toString(),
      },
    }
  );
}
