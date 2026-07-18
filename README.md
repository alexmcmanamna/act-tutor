# ACT Tutor — with Mr. Kim

An adaptive ACT prep app. On first visit it asks for your goal score, your current
score (or gives you a short diagnostic if you don't have one), and your test date,
then builds a personalized study plan of lessons and practice sets. "Mr. Kim" is a
local AI tutor (powered by [Ollama](https://ollama.com)) that explains questions,
answers free-form ACT questions, and writes your plan summary.

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind** — frontend and backend API routes in one app.
- **SQLite + Prisma** — zero-config local database.
- **Ollama** (default model: `qwen3:4b`) — runs Mr. Kim locally. The app works without
  Ollama running too — it falls back to static content/messages.
- **Adaptive engine**: a difficulty-weighted moving-average mastery tracker per
  ACT subtopic (see `src/lib/adaptive.ts`) — an Elo/IRT-style heuristic, not a
  trained ML model. It's what picks question difficulty and prioritizes the study plan.

## Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed and running (`ollama serve`), with a model pulled:
  ```bash
  ollama pull qwen3:4b
  ```
  Without Ollama, the app still runs — Mr. Kim's AI features fall back to static
  messages and explanations.

  **Note on speed:** local inference speed depends entirely on your machine. On a
  CPU-only machine, a single Mr. Kim reply can take 30–90+ seconds. On a machine
  with a GPU, it will be much faster. This is expected local-inference behavior,
  not a bug — the UI shows a loading state while it waits.

## Setup

```bash
npm install
cp .env.example .env
npx prisma db push      # creates prisma/dev.db from the schema
npx prisma db seed      # loads the ACT question bank (68 questions across 16 subtopics)
npm run dev
```

Open http://localhost:3000.

## How it works

1. **Onboarding** (`/`) — goal score, current score (with optional per-section
   scores) or "take a diagnostic," and test date.
2. **Diagnostic** (`/diagnostic`) — if no current score was given, a ~40-question
   diagnostic covering all four ACT sections and their subtopics establishes a
   baseline and per-subtopic mastery estimates.
3. **Study plan** (`/dashboard`) — Mr. Kim ranks subtopics by mastery (weakest
   first) and builds an ordered plan alternating a lesson and a practice set per
   weak subtopic, along with an AI-written plan summary.
4. **Lessons** (`/lesson/[section]/[subtopic]`) — static, hand-written lesson
   content plus a YouTube search link and an "ask Mr. Kim to explain differently"
   chat box.
5. **Practice** (`/practice/[section]/[subtopic]`) — adaptively-selected
   questions (difficulty follows current mastery), instant feedback, and
   AI-explained mistakes. Every answer updates that subtopic's mastery score.
6. **Ask Mr. Kim** (`/mr-kim`) — free-form chat, aware of your goal score and
   weakest areas.

## Project structure

```
prisma/schema.prisma      Student, Question, QuestionAttempt, Mastery, StudyPlan(+Item)
src/data/questions.ts     Hand-written ACT-style question bank (68 questions)
src/data/lessons.ts       Lesson content per subtopic
src/lib/adaptive.ts       Mastery update algorithm ("Mr. Kim"'s core logic)
src/lib/studyPlan.ts      Study plan generation
src/lib/ollama.ts         Local Ollama client
src/app/api/**            REST-ish API routes
src/app/**                Pages (onboarding, diagnostic, dashboard, lesson, practice, chat)
```

## Known limitations

- Score estimates (diagnostic → scaled score, and mastery → study plan) use
  reasonable heuristics, not the official ACT concordance tables.
- Single local student profile per browser (cookie-based), no auth — this is a
  personal local-first app, not multi-tenant SaaS.
- The question bank is intentionally small (68 questions) to keep this
  buildable by hand with verified-correct answers; it's easy to extend by adding
  entries to `src/data/questions.ts` and re-running `npx prisma db seed`.
