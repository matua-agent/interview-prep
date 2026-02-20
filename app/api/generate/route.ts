import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const HARRISON_BACKGROUND = `
## Candidate Profile: Harrison Dudley-Rode

**Background:** Sports scientist turned AI-native software developer, based in Vancouver, BC.

**Current Roles:**
- AI Ops Lead at Supermix — managing day-to-day AI operations, shipping AI products, bridging research and production
- AI Developer / Sports Scientist at Athletica AI — combining exercise physiology with AI to build smarter training tools
- Research Associate at SPRINZ (Sport and Exercise Science Institute, NZ) — peer-reviewed research on exercise physiology

**Academic Credentials:**
- MSc Exercise Science (Sports Performance Research Institute, AUT)
- 3 peer-reviewed publications including:
  - DOI: 10.1007/s00421-024-05687-w — CHO and ventilatory threshold
  - DOI: 10.1007/s00421-025-05815-0 — Physiological decoupling prediction
  - Research on durability in endurance sport

**Technical Skills:**
- AI/ML: Claude API, OpenAI, OpenRouter, LLM integration, AI system management, prompt engineering
- Development: Next.js 16, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL + RLS), Node.js
- Tools: Git, Vercel, GitHub Actions, shadcn/ui, Framer Motion, Recharts, MediaPipe
- Data: CSV parsing, real-time data APIs, geospatial (Mapbox), wearable data (Garmin FIT files)

**Shipped Portfolio (10+ production apps):**
- Workout App — full-stack PWA with AI coaching, rep-counting camera integration, Strava sync, Supabase
- Finance App — personal finance dashboard with CSV import, budget tracking, investment monitoring
- Durability App — sports science app parsing Garmin FIT files for endurance durability analysis
- Snow Forecast CA — live mountain weather for 3 Canadian ski resorts, weekend scoring
- NZ Adventure Planner — DOC tracks + real-time conditions (GeoNet, weather) with safety scores
- NZ Real Estate Explorer — MBIE rental market data with Mapbox visualization
- Personal Page — portfolio with Remotion animations, GitHub activity dashboard, AI voice chat
- AI Form Explorer — AI-powered form builder with streaming responses
- Collab Whiteboard — real-time multi-user canvas (Liveblocks)
- Rep Sensor — ML-powered rep counting via device camera (MediaPipe)
- Research Analyzer — AI research paper breakdown tool

**What makes Harrison unique:**
- Bridges sports science research rigor with AI product shipping
- Uses AI agents (Claude/Codex) as core development tools — literally builds WITH AI
- Ships fast: 300+ commits across 26 repos in last 30 days
- Cross-domain thinker: physiology, data, products
- Honest learner: started coding 3 months ago, now ships production apps

**Location:** Vancouver, BC, Canada (open to local + remote)
**GitHub:** github.com/harry-supermix
**Portfolio:** dudleyrode.com
`;

const SYSTEM_PROMPT = `You are an expert interview coach helping Harrison Dudley-Rode prepare for job interviews.

${HARRISON_BACKGROUND}

When given a job description, generate a comprehensive interview prep guide.
Structure your response as a JSON object with this exact format:

{
  "company": "<extracted company name or 'Unknown'>",
  "role": "<extracted role title>",
  "overview": "<2-3 sentences: key things Harrison should emphasize for THIS specific role>",
  "questions": [
    {
      "id": "1",
      "category": "<Behavioral | Technical | Situational | Culture Fit | Role-Specific>",
      "question": "<interview question>",
      "difficulty": "<Easy | Medium | Hard>",
      "whyAsked": "<1 sentence on why interviewers ask this>",
      "idealAnswer": "<Harrison's tailored ideal answer, 3-5 sentences, in first person>",
      "talkingPoints": ["<specific example or point>", "<another point>", "<third point>"]
    }
  ],
  "redFlags": ["<things to avoid saying or doing>"],
  "keyQuestions": ["<questions Harrison should ask THEM>"],
  "closingStatement": "<A strong 2-3 sentence closing pitch Harrison can use at the end of the interview>"
}

Generate 12-15 questions covering all categories. Be highly specific to Harrison's actual background — reference his real projects, papers, and experience. Make answers sound natural and confident, not robotic.`;

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, companyName } = await req.json();

    if (!jobDescription || jobDescription.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide a job description (at least 50 characters)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userMessage = companyName
      ? `Company: ${companyName}\n\nJob Description:\n${jobDescription}`
      : `Job Description:\n${jobDescription}`;

    const stream = await client.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate interview prep. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
