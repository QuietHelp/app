import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import crypto from "crypto"
import Redis from "ioredis"

type ModerationResult = { isAppropriate: boolean; reason: string | null }

// Patterns matched here are unambiguously directed at the recipient and hostile
// in any reasonable context. This layer must never block messages the LLM would
// have approved — most notably the speaker expressing their own pain
// (e.g. "I want to die", "I hate myself"), which the LLM is explicitly told to
// allow through as cries for help. Anything not matched falls through to the
// existing LLM check.
const HARD_BLOCK_PATTERNS: RegExp[] = [
  /\bkys\b/i,
  /\bkill\s+(your|ya)sel(f|ves)\b/i,
  /\bgo\s+(and\s+)?(fucking\s+)?(kill|off)\s+(your|ya)sel(f|ves)\b/i,
  /\bnobody\s+(would|will)\s+miss(es)?\s+you\b/i,
  /\bfuck\s+(you|off|ya)\b/i,
  /\bstfu\b/i,
  /\bshut\s+(the\s+(fuck|f[u*]ck)\s+)?up\b/i,
]

function preFilter(message: string): ModerationResult | null {
  for (const re of HARD_BLOCK_PATTERNS) {
    if (re.test(message)) {
      return { isAppropriate: false, reason: "Content violates community guidelines" }
    }
  }
  return null
}

const CACHE_PREFIX = "moderation:v1:"
const CACHE_TTL_SECONDS = Number(process.env.MODERATION_CACHE_TTL_SECONDS) || 7 * 24 * 60 * 60

function cacheKey(message: string): string {
  const normalized = message.trim().toLowerCase().replace(/\s+/g, " ")
  return CACHE_PREFIX + crypto.createHash("sha256").update(normalized).digest("hex")
}

// Survive Next.js HMR in dev and keep a single connection per Node process in prod.
const globalForRedis = globalThis as unknown as {
  _moderationRedis?: Redis | null
  _moderationRedisInit?: boolean
}

function getRedis(): Redis | null {
  if (globalForRedis._moderationRedisInit) {
    return globalForRedis._moderationRedis ?? null
  }
  globalForRedis._moderationRedisInit = true

  const host = process.env.REDIS_HOST
  const port = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined
  if (!host || !port) {
    globalForRedis._moderationRedis = null
    return null
  }

  try {
    const client = new Redis({
      host,
      port,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times: number) => Math.min(times * 200, 2000),
    })
    client.on("error", (err: Error) => {
      console.warn("[Moderation] Redis error:", err.message)
    })
    globalForRedis._moderationRedis = client
    return client
  } catch (err) {
    console.warn("[Moderation] Redis init failed, cache disabled:", err)
    globalForRedis._moderationRedis = null
    return null
  }
}

async function cacheGet(key: string): Promise<ModerationResult | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const raw = await redis.get(key)
    return raw ? (JSON.parse(raw) as ModerationResult) : null
  } catch (err) {
    console.warn("[Moderation] Redis GET failed:", err)
    return null
  }
}

async function cacheSet(key: string, result: ModerationResult): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.set(key, JSON.stringify(result), "EX", CACHE_TTL_SECONDS)
  } catch (err) {
    console.warn("[Moderation] Redis SET failed:", err)
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json({ isAppropriate: false, reason: "Invalid message" })
    }

    const preBlocked = preFilter(message)
    if (preBlocked) {
      return Response.json(preBlocked)
    }

    const key = cacheKey(message)
    const cached = await cacheGet(key)
    if (cached) {
      return Response.json(cached)
    }

    // Use AI to check if the message is appropriate
    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: `You are a content moderator for QuietHelp, an anonymous peer support platform for people experiencing emotional distress, loneliness, burnout, panic, and other mental health challenges. Users on this platform are often in a vulnerable state.
Your job is to protect vulnerable users. Be STRICT and err on the side of blocking.
BLOCK (mark INAPPROPRIATE) if the message contains ANY of:
1. Profanity or insults directed at the recipient (e.g. "fuck you", "shut up", "stfu", "idiot", "loser", "bitch")
2. Dismissive or invalidating language (e.g. "get over it", "stop being dramatic", "others have it worse", "suck it up", "man up", "you're being a baby")
3. Encouragement of self-harm directed at the recipient (e.g. "you should kill yourself", "kys", "nobody would miss you", "do everyone a favor", "just end it")
4. Hate speech or slurs based on race, gender, sexuality, religion, disability, etc.
5. Sexual content, propositions, or harassment
6. Threats or intimidation
7. Victim-blaming or gaslighting (e.g. "it's your fault", "you're overreacting", "you imagined it")
8. Requests for personal information (phone, address, social media handles, real name)
DO NOT BLOCK:
- The SPEAKER honestly expressing their own pain (e.g. "I feel terrible", "I hate myself", "I can't take it anymore", "I want to die"). These are cries for help, not harassment, and they must reach the peer so they can respond with support.
- Strong but supportive language (e.g. "that sounds really hard", "I'm so sorry you're going through this")
When in doubt, BLOCK. Vulnerable users matter more than false positives.
Message: "${message}"
Respond with ONLY "APPROPRIATE" or "INAPPROPRIATE: [brief reason]"`,
      temperature: 0.3,
    })

    const isAppropriate = text.trim().toUpperCase().startsWith("APPROPRIATE")
    const reason = isAppropriate ? null : text.replace(/^INAPPROPRIATE:\s*/i, "").trim()
    const result: ModerationResult = { isAppropriate, reason }

    void cacheSet(key, result)

    console.log("[Moderation] Result:", { message, isAppropriate, reason })

    return Response.json(result)
  } catch (error) {
    console.error("[Moderation] Error:", error)
    // Fail CLOSED — for a mental health platform, we'd rather block
    // a message than let unmoderated content through silently.
    return Response.json(
      { isAppropriate: false, reason: "Couldn't verify message safety, please try again in a moment." },
      { status: 503 }
    )
  }
}

