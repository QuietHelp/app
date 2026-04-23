/**
 * AI companion chat endpoint.
 *
 * Calls Google Gemini directly via the Vercel AI SDK. This replaces the
 * previous proxy to a separate Python `chatbot-service`, which was not
 * running locally. The frontend contract is unchanged:
 *
 *   POST body:  { session_id?, message, mood?, flow? }
 *   Response:   { response: string, suggestions?: string[] }
 */

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// `gemini-2.5-flash` has a generous free-tier quota and fast responses. If
// you have paid access and want a different model, override via AI_MODEL in
// frontend/.env (e.g. AI_MODEL=gemini-2.0-flash).
const MODEL = process.env.AI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are QuietHelp's AI support companion for anonymous users looking for emotional support.

Tone and behavior:
- Warm, gentle, non-judgmental. Sound like a calm friend, not a clinician.
- Validate feelings first. Reflect back what you hear before offering ideas.
- Prefer open-ended questions over advice. Do not try to "fix" the user.
- Short responses (under ~120 words, 1-3 short paragraphs). Plain language, no jargon.
- Never claim to be a therapist or diagnose anything.

Safety:
- If the user mentions self-harm, suicide, abuse, or being in danger, gently
  acknowledge what they shared and share these resources:
  988 (US Suicide & Crisis Lifeline, call or text) and findahelpline.com for
  other countries. Encourage reaching out to a trusted person or professional.
- Do not provide medical, legal, or prescriptive advice.

Format:
- Plain text only. No markdown headings, no bullet lists unless the user asks.`;

const FLOW_PROMPTS: Record<string, string> = {
  grounding:
    "The user asked for a grounding exercise. Gently walk them through the 5-4-3-2-1 technique (5 things they see, 4 they feel, 3 they hear, 2 they smell, 1 they taste), one step at a time. Start by inviting them to take a slow breath and share the first step. Keep the first message short.",
  "check-in":
    "The user asked for a quick check-in. Ask one gentle, open-ended question that helps them name how they're feeling right now, on an emotional level. Do not ask more than one question.",
  small_step:
    "The user asked for help taking one small step. Ask them what feels heaviest right now, then offer to help them break it into one tiny, doable action for the next hour. Keep it small and kind.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, mood, flow } = body ?? {};

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "message is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error:
            "AI service is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in frontend/.env and restart the dev server.",
        },
        { status: 503 }
      );
    }

    const flowInstruction =
      typeof flow === "string" && FLOW_PROMPTS[flow]
        ? `\n\nGuided flow: ${FLOW_PROMPTS[flow]}`
        : "";
    const moodContext =
      typeof mood === "string" && mood.trim() ? `\nUser-reported mood: ${mood}.` : "";

    const { text } = await generateText({
      model: google(MODEL),
      system: SYSTEM_PROMPT + flowInstruction + moodContext,
      prompt: message.trim(),
      temperature: 0.7,
    });

    return Response.json({ response: text.trim() });
  } catch (error) {
    console.error("[chat] error:", error);

    const raw = error instanceof Error ? error.message : String(error);
    const statusCode =
      (error as { statusCode?: number } | null)?.statusCode ??
      (error as { status?: number } | null)?.status;

    if (/API[_ ]key not valid|API_KEY_INVALID/i.test(raw)) {
      return Response.json(
        {
          error:
            "The Gemini API key is invalid or expired. Generate a new one at https://aistudio.google.com/app/apikey and update GOOGLE_GENERATIVE_AI_API_KEY in frontend/.env, then restart the dev server.",
        },
        { status: 401 }
      );
    }

    if (
      statusCode === 429 ||
      /RESOURCE_EXHAUSTED|quota|rate limit/i.test(raw)
    ) {
      return Response.json(
        {
          error:
            "The AI is getting a lot of requests right now. Please wait ~15 seconds and try again.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Failed to generate a response. Please try again." },
      { status: 502 }
    );
  }
}
