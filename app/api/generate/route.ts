import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const HARRISON_BACKGROUND = `
## Candidate Profile: Harrison Dudley-Rode

**Background:** Sports scientist turned AI engineer, based in Vancouver, BC. Built 39 deployed applications
in roughly 90 days while working full-time. Currently job hunting for AI engineering roles at Vancouver's
top AI companies.

**Current Roles:**
- AI Ops Lead at Supermix — building internal AI tools, orchestrating AI agents, keeping the ops stack
  running for a podcast and media startup.
- Research Associate at SPRINZ (Sport and Exercise Science Institute, NZ) — consulting on exercise
  physiology and durability research projects.

**Academic Credentials:**
- MSc Exercise Science (Sports Performance Research Institute, AUT)
- 2 peer-reviewed publications:
  - DOI: 10.1007/s00421-024-05687-w — Carbohydrate oxidation and ventilatory threshold
  - DOI: 10.1007/s00421-025-05815-0 — Physiological decoupling as a predictor of endurance performance

**Technical Skills:**
- AI/ML: Claude API (all models), streaming via raw fetch + SSE, multi-agent orchestration, RAG (BM25
  from scratch), LLM evaluation, MCP protocol (built servers from scratch), tool use/function calling,
  context engineering, prompt evaluation systems
- Development: Next.js 16, React, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + RLS), Node.js,
  Edge runtime, Worker AI
- Tools: Git, Vercel, GitHub Actions, shadcn/ui, Recharts, MediaPipe, Liveblocks, Remotion
- Data: CSV parsing, Garmin FIT files, real-time APIs, geospatial (Mapbox), MBIE rental API

**AI Engineering Portfolio (39 live apps — March 2026):**

*AI Architecture / LLM Infrastructure:*
- **Multi-Agent Demo** — 5-agent pipeline (Planner → Researcher+Writer+Critic in parallel → Synthesizer),
  all streaming live via SSE. Typed JSON contracts between agents.
- **Pipeline Demo** — 4-stage LLM orchestration (Extract → Analyze → Synthesize → Act) with per-stage
  timing and token counts visible. Enterprise AI architecture made visible.
- **AI Eval Lab** — systematic prompt evaluation: test cases, keyword + semantic scoring, "Fix My Prompt"
  button streaming AI-powered improvements. Builds evaluation culture.
- **RAG Demo** — full RAG stack from scratch: Okapi BM25 in TypeScript (no vector DB), chunk scoring,
  matched term highlighting, grounded generation with citations.
- **Context Engineering Studio** — 6 context strategies (Baseline, Role+Persona, Grounding, Few-Shot,
  Constraints, Full Stack) running in parallel on any task. Based on Andrej Karpathy's framework.
- **Agent Memory Demo** — chat with persistent memory: AI extracts facts from each turn and injects
  them into future context. Makes AI memory patterns tangible.
- **Tool-Use Demo** — real agentic loop with 5 tools (weather, calculator, search, timezone, currency)
  and every decision step visible to the user.
- **Harrison MCP Server** — real MCP server implementing JSON-RPC 2.0, installable in Claude Desktop.
- **Research Canvas** — autonomous multi-step research agent with live streaming at every step.
- **Prompt Lab** — side-by-side comparison of 4 prompting techniques (zero-shot, few-shot, CoT, system)
  streaming simultaneously with TTFT + token counts.
- **Model Faceoff** — real-time side-by-side streaming comparison of Claude Haiku vs Sonnet.
- **Voice AI Demo** — real-time voice chat with Claude using browser Web Speech API.

*Domain-Specific AI Applications:*
- **LegalFlow** — 3 AI workflows for legal practice: matter → client updates, time entries → billing
  narratives, court docs → structured calendar events. Built to mirror what Clio ships.
- **DocIQ** — document intelligence: paste any contract or paper, ask questions, citation-required
  responses. Same architecture as enterprise legal AI.
- **Contract Analyzer** — AI-powered contract review with risk identification and plain-English summaries.
- **Company Intel** — AI company research tool (competitive landscape, tech stack, culture signals).
- **AthleteIQ** — sports science AI chat backed by Harrison's published EJAP papers. Precision knowledge
  base over RAG for a narrow scientific domain.
- **Clip Finder** — AI YouTube highlight detector, generates shareable moments with timestamps and captions.
- **AI Code Reviewer** — automated code review with severity-tagged feedback.
- **AI Code Explainer** — plain-English explanations of any code file or snippet.
- **Research Analyzer** — AI paper breakdown tool (methodology, findings, limitations, implications).
- **AI Form Explorer** — AI-powered form builder with streaming responses.
- **Interview Prep AI** — paste job description → 12-15 tailored questions with ideal answers in
  Harrison's voice (this app).
- **Job Tracker** — Kanban pipeline for job applications with analytics and follow-up alerts.

*Full-Stack Applications:*
- **beef (Workout App)** — full-stack PWA with AI coaching, rep-counting camera (MediaPipe),
  Strava sync, Supabase backend, real-time PR detection, e1RM charts.
- **Durability App** — sports science app parsing Garmin FIT files for endurance durability analysis.
  Based on Harrison's published research.
- **Finance App** — personal finance dashboard with CSV import, budget tracking, investment monitoring.
- **NZ Real Estate Explorer** — MBIE rental data with Mapbox visualization, suburb filtering.
- **Snow Forecast CA** — mountain weather for Canadian ski resorts with weekend scoring algorithm.
- **NZ Adventure Planner** — DOC tracks + GeoNet + weather with AI safety scoring.
- **Currency Converter** — real-time exchange rate comparison across major currencies.
- **Remote Jobs** — filterable remote job board with category search.
- **Flight Scanner** — multi-city flight search aggregator with price trends.
- **Travel Site** — AI-powered trip planner.

*Tools + Infrastructure:*
- **Mission Control** — VPS-hosted health monitoring dashboard for all 37+ apps. Vercel API integration.
- **Deploy Pipeline** — automated deployment orchestration with status tracking.
- **7 Claude-powered CLI tools:** ai-commit, smart-pr, ai-explain, ai-review, ai-changelog,
  project-context, ai-standup — all running locally on VPS.

**What makes Harrison unique:**
- Research background (peer-reviewed publications) brings evaluation rigor to AI engineering
- Ships constantly: 39 apps in 90 days, all production-quality and live
- Uses AI agents (Claude/Codex) as core development tools — orchestrates the tools, not just the code
- Cross-domain: sports science → data → AI products — builds things that need to work, not just demo well
- Active job hunter: has cover letters written for Clio, Cohere, Sanctuary AI, OpusClip, Giga, Cursor

**Location:** Vancouver, BC, Canada (IEC working holiday visa — hybrid or remote preferred)
**GitHub:** github.com/harry-supermix (Harrison) + github.com/matua-agent (AI agent account)
**Portfolio:** dudleyrode.com
**Email:** harrison@dudleyrode.com
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
