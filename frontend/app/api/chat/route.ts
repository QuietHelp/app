/**
 * Proxies chat requests to the QuietHelp chatbot-service.
 * Keeps the chatbot URL and any auth server-side.
 */

const CHATBOT_SERVICE_URL =
  process.env.CHATBOT_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, message, mood, flow } = body;

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "message is required and must be a string" },
        { status: 400 }
      );
    }

    const res = await fetch(`${CHATBOT_SERVICE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: session_id || (crypto.randomUUID?.() ?? `session-${Date.now()}`),
        message: message.trim(),
        mood: mood ?? undefined,
        flow: flow ?? undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[chat] chatbot-service error:", res.status, err);
      return Response.json(
        { error: "Chat service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[chat] proxy error:", error);
    return Response.json(
      { error: "Failed to reach chat service. Please try again." },
      { status: 502 }
    );
  }
}
