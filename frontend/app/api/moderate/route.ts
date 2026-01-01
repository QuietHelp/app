import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json({ isAppropriate: false, reason: "Invalid message" })
    }

    // Use AI to check if the message is appropriate
    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `You are a content moderator for a friendly anonymous chat app. Analyze the following message and determine if it contains:
- Hate speech, harassment, or bullying
- Sexual or explicit content
- Violence or threats
- Spam or excessive negativity
- Personal information sharing

Message: "${message}"

Respond with ONLY "APPROPRIATE" or "INAPPROPRIATE: [brief reason]"`,
      temperature: 0.3,
    })

    const isAppropriate = text.trim().toUpperCase().startsWith("APPROPRIATE")
    const reason = isAppropriate ? null : text.replace(/^INAPPROPRIATE:\s*/i, "").trim()

    console.log("[Moderation] Result:", { message, isAppropriate, reason })

    return Response.json({
      isAppropriate,
      reason,
    })
  } catch (error) {
    console.error("[Moderation] Error:", error)
    // Fail open - allow message if moderation fails
    return Response.json({ isAppropriate: true })
  }
}

