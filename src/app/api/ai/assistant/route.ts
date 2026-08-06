import { NextRequest, NextResponse } from "next/server";
import { askAssistant } from "@/lib/ai/assistant";

// The AI assistant runs the rule-based analytics engine locally over the
// org's actual metrics (grounded, no hallucination). If ANTHROPIC_API_KEY is
// configured, this route can optionally be extended to pass that grounded
// context to Claude for a more conversational rewrite — see the commented
// block below for the integration point.
export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "السؤال مطلوب" }, { status: 400 });
  }

  const answer = askAssistant(question);

  // Optional: refine with Claude if a key is present.
  // if (process.env.ANTHROPIC_API_KEY) {
  //   const res = await fetch("https://api.anthropic.com/v1/messages", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "x-api-key": process.env.ANTHROPIC_API_KEY,
  //       "anthropic-version": "2023-06-01",
  //     },
  //     body: JSON.stringify({
  //       model: "claude-sonnet-4-6",
  //       max_tokens: 400,
  //       messages: [{ role: "user", content: `بيانات مرجعية: ${answer.text}\n\nأعد صياغة الإجابة بأسلوب استشاري ودود دون تغيير الأرقام: ${question}` }],
  //     }),
  //   });
  //   const data = await res.json();
  //   const refined = data.content?.[0]?.text;
  //   if (refined) return NextResponse.json({ ...answer, text: refined });
  // }

  return NextResponse.json(answer);
}
