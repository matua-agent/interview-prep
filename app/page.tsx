"use client";

import { useState, useRef } from "react";

type Question = {
  id: string;
  category: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  whyAsked: string;
  idealAnswer: string;
  talkingPoints: string[];
};

type PrepResult = {
  company: string;
  role: string;
  overview: string;
  questions: Question[];
  redFlags: string[];
  keyQuestions: string[];
  closingStatement: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  Behavioral: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Technical: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Situational: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Culture Fit": "bg-green-500/10 text-green-400 border-green-500/20",
  "Role-Specific": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-amber-400",
  Hard: "text-rose-400",
};

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`question-card border border-zinc-800 rounded-xl p-5 cursor-pointer select-none`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-zinc-600 text-sm font-mono mt-0.5 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  CATEGORY_COLORS[q.category] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {q.category}
              </span>
              <span className={`text-xs font-medium ${DIFFICULTY_COLORS[q.difficulty] ?? "text-zinc-400"}`}>
                {q.difficulty}
              </span>
            </div>
            <p className="text-zinc-100 font-medium leading-snug">{q.question}</p>
          </div>
        </div>
        <span className="text-zinc-600 text-lg shrink-0 mt-0.5">
          {open ? "−" : "+"}
        </span>
      </div>

      {open && (
        <div className="mt-4 pl-8 space-y-4 border-t border-zinc-800/60 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Why they ask this</p>
            <p className="text-zinc-400 text-sm">{q.whyAsked}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Your ideal answer</p>
            <p className="text-zinc-200 text-sm leading-relaxed">{q.idealAnswer}</p>
          </div>
          {q.talkingPoints.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Key talking points</p>
              <ul className="space-y-1.5">
                {q.talkingPoints.map((point, i) => (
                  <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                    <span className="text-violet-400 mt-0.5 shrink-0">→</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          active === "all"
            ? "border-violet-500 bg-violet-500/10 text-violet-300"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            active === cat
              ? "border-violet-500 bg-violet-500/10 text-violet-300"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ExportButton({ result }: { result: PrepResult }) {
  const handleExport = () => {
    const lines: string[] = [
      `# Interview Prep — ${result.role} @ ${result.company}`,
      "",
      `## Overview`,
      result.overview,
      "",
      `## Questions & Answers`,
      "",
    ];

    result.questions.forEach((q, i) => {
      lines.push(`### ${i + 1}. [${q.category}] ${q.question}`);
      lines.push(`*Difficulty: ${q.difficulty}*`);
      lines.push("");
      lines.push(`**Why asked:** ${q.whyAsked}`);
      lines.push("");
      lines.push(`**Ideal answer:** ${q.idealAnswer}`);
      lines.push("");
      lines.push("**Key points:**");
      q.talkingPoints.forEach((p) => lines.push(`- ${p}`));
      lines.push("");
    });

    lines.push("## Questions to Ask Them");
    result.keyQuestions.forEach((q) => lines.push(`- ${q}`));
    lines.push("");
    lines.push("## Things to Avoid");
    result.redFlags.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
    lines.push("## Closing Statement");
    lines.push(result.closingStatement);

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-prep-${result.role.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="text-sm px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors flex items-center gap-2"
    >
      <span>↓</span> Export as Markdown
    </button>
  );
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<PrepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const abortRef = useRef<AbortController | null>(null);

  const categories = result
    ? [...new Set(result.questions.map((q) => q.category))]
    : [];

  const filteredQuestions = result
    ? activeCategory === "all"
      ? result.questions
      : result.questions.filter((q) => q.category === activeCategory)
    : [];

  const handleGenerate = async () => {
    if (!jobDescription.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setStreamText("");
    setActiveCategory("all");

    abortRef.current = new AbortController();
    let fullText = "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, companyName }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamText(fullText);
      }

      // Parse the JSON from the streamed text
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse response");

      const parsed = JSON.parse(jsonMatch[0]) as PrepResult;
      setResult(parsed);
      setStreamText("");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              <span className="gradient-text">Interview Prep</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">AI-powered · Tailored to your background</p>
          </div>
          <a
            href="https://dudleyrode.com"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            dudleyrode.com →
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Intro */}
        {!result && !loading && (
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-100">
              Prep smarter, not harder.
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Paste any job description and get 12–15 tailored interview questions with
              model answers grounded in your actual experience — sports science, AI ops,
              shipped products.
            </p>
          </div>
        )}

        {/* Input form */}
        {!result && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Company name <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Klue, Sanctuary AI, Palantir..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Job description <span className="text-zinc-600">*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste the full job description here...&#10;&#10;The more detail you provide, the more tailored the questions will be."
                rows={14}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors text-sm leading-relaxed"
                disabled={loading}
              />
              <p className="text-xs text-zinc-600 mt-1.5">⌘ + Enter to generate</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || jobDescription.trim().length < 50}
              className="w-full py-3.5 rounded-xl font-medium text-sm transition-all bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Interview Questions"}
            </button>
          </div>
        )}

        {/* Loading / streaming state */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-zinc-400 text-sm">
                Generating tailored questions...
              </span>
            </div>
            {streamText && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-xs text-zinc-500 font-mono leading-relaxed max-h-48 overflow-y-auto">
                {streamText.slice(-800)}
                <span className="text-violet-400 animate-pulse">▍</span>
              </div>
            )}
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-zinc-800 rounded-xl p-5">
                  <div className={`shimmer h-4 rounded w-3/4 mb-3`} />
                  <div className={`shimmer h-3 rounded w-1/2`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8">
            {/* Role summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    {result.role}
                    {result.company !== "Unknown" && (
                      <span className="text-zinc-400"> @ {result.company}</span>
                    )}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">{result.overview}</p>
                </div>
                <ExportButton result={result} />
              </div>
              <div className="flex items-center gap-4 pt-1 text-sm text-zinc-500">
                <span>{result.questions.length} questions</span>
                <span>·</span>
                <span>{categories.length} categories</span>
                <button
                  onClick={() => {
                    setResult(null);
                    setJobDescription("");
                    setCompanyName("");
                  }}
                  className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  ← Start over
                </button>
              </div>
            </div>

            {/* Category filter */}
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />

            {/* Questions */}
            <div className="space-y-3">
              {filteredQuestions.map((q, i) => (
                <QuestionCard key={q.id} q={q} index={i} />
              ))}
            </div>

            {/* Questions to ask them */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
                Questions to Ask Them
              </h3>
              <ul className="space-y-2.5">
                {result.keyQuestions.map((q, i) => (
                  <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red flags + closing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-rose-400 mb-3 uppercase tracking-wider">
                  Things to Avoid
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((r, i) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5 shrink-0">✗</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">
                  Closing Statement
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  &ldquo;{result.closingStatement}&rdquo;
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setJobDescription("");
                  setCompanyName("");
                }}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ← Prep for another role
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-5 mt-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span>Built for Harrison Dudley-Rode · Powered by Claude</span>
          <span>dudleyrode.com</span>
        </div>
      </footer>
    </div>
  );
}
