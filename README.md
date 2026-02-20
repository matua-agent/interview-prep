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

### Option A: Vercel (one-click)

1. Go to vercel.com → Import → select `matua-agent/interview-prep`
2. Add environment variable: `ANTHROPIC_API_KEY=<your-key>`
3. Deploy — live URL in 30 seconds

### Option B: GitHub Actions (auto-deploy on push)

The `.github/workflows/deploy.yml` workflow auto-deploys to Vercel on every push to main. To activate:

1. Import repo on Vercel first (Option A above) to get the Project ID
2. Add these GitHub repository secrets:
   ```
   VERCEL_TOKEN      → Get from vercel.com/account/tokens
   VERCEL_ORG_ID     → Your Vercel team/personal account ID
   VERCEL_PROJECT_ID → The project ID from Vercel dashboard
   ANTHROPIC_API_KEY → Your Anthropic key
   ```
3. Push to main — CI builds then deploys automatically

### Option C: Local dev

```bash
cp .env.example .env.local
# Add ANTHROPIC_API_KEY to .env.local
npm install
npm run dev
# Open http://localhost:3000
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
