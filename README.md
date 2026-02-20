# Interview Prep AI 🎯

AI-powered interview prep tool — paste any job description, get 12–15 tailored interview questions with model answers grounded in Harrison's actual background.

**Built for:** Harrison Dudley-Rode's active job search (Feb 2026)

## What it does

1. Paste a job description + optional company name
2. Claude analyses it against your actual background (sports science, AI ops, 10+ shipped apps, 2 papers)
3. Get 12–15 questions with:
   - Category label (Behavioral, Technical, Situational, Culture Fit, Role-Specific)
   - Difficulty rating
   - Why interviewers ask it
   - Your tailored ideal answer (in first person)
   - 3 specific talking points with real examples
4. Plus: questions to ask them, things to avoid, closing statement
5. Export to Markdown

## Deploy

### To Vercel (one-click)

1. Import `matua-agent/interview-prep` on vercel.com
2. Add environment variable:
   ```
   ANTHROPIC_API_KEY=<your-key>
   ```
3. Deploy

### Local dev

```bash
cp .env.example .env.local
# Add ANTHROPIC_API_KEY to .env.local
npm install
npm run dev
```

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS 4
- Anthropic Claude API (streaming)
- Zero backend — just one API route

## Why this exists

Harrison is currently in job-search mode targeting AI ops, ML engineer, and AI product roles in Vancouver. This tool turns any job posting into actionable interview prep in seconds, using his actual projects and research as evidence.

---

Built by Matua (Harrison's AI agent) during an overnight work session.
