import type { Student } from "@prisma/client";
import type { GoalRealismResult } from "./goalRealism";

/**
 * Every dynamic Mr. Kim message used outside the free-form chat/lesson-help
 * surfaces (goal-realism warnings, round transitions, test follow-ups, the
 * onboarding question-types choice). Each one builds a {prompt, fallback}
 * pair — the API route streams the prompt through Ollama and falls back to
 * the plain, honest static message if Ollama isn't reachable, so the app
 * stays fully usable either way.
 */

export interface MrKimPrompt {
  prompt: string;
  fallback: string;
}

export function buildGoalCheckPrompt(
  student: Pick<Student, "goalScore" | "currentScore" | "testDate">,
  realism: GoalRealismResult
): MrKimPrompt {
  const weeksLeft = realism.daysUntilTest ? Math.round(realism.daysUntilTest / 7) : null;

  if (realism.health === "under-capacity") {
    const prompt = `A student's goal ACT composite score is ${student.goalScore}, their current baseline is ${
      student.currentScore ?? "not yet known"
    }, and they have ${weeksLeft ? `about ${weeksLeft} weeks` : "no test date set yet"} until their test${
      realism.daysUntilTest ? ` (${realism.daysUntilTest} days)` : ""
    }. Based on their study schedule, they've committed to roughly ${Math.round(
      realism.availableMinutes ?? 0
    )} minutes of study time before test day, but reaching their goal would realistically take closer to ${
      realism.recommendedMinutes
    } minutes given ${realism.totalMovement} composite points of gap and ${
      realism.developingSkills
    } skill areas still developing.

Write a short (3-4 sentence), warm but honest warning that this goal may be a stretch given their current schedule. Don't be discouraging — explain the gap in plain terms and suggest they either study more often/longer, move their test date back, or proceed anyway knowing it's ambitious. Do not use markdown.`;
    return {
      prompt,
      fallback: `Heads up — closing a ${realism.totalMovement}-point gap${
        weeksLeft ? ` in about ${weeksLeft} weeks` : ""
      } with your current study schedule is going to be tight. Based on how many areas you still need to build up, you'd likely need more study time than you've currently got scheduled. You can add more study days or minutes per session, push your test date back, or go ahead anyway — just know it's an ambitious goal.`,
    };
  }

  const prompt = `A student's goal ACT composite score is ${student.goalScore}, current baseline ${
    student.currentScore ?? "not yet known"
  }, ${weeksLeft ? `about ${weeksLeft} weeks` : "no test date set"} until their test. Their study schedule looks sufficient to reach this goal on Mr. Kim's rough estimate. Write a short (2-3 sentence) encouraging confirmation that their plan and schedule look feasible, addressed directly to the student. Do not use markdown.`;
  return {
    prompt,
    fallback: `Good news — based on your schedule, reaching a ${student.goalScore} looks feasible with consistent study. Let's get your plan built.`,
  };
}

export function buildQuestionTypeChoicePrompt(
  student: Pick<Student, "goalScore" | "currentScore">,
  weakestLabel: string
): MrKimPrompt {
  const prompt = `A student just saw their ACT diagnostic results broken down by question type across English, Math, Reading, and Science. Their goal composite is ${
    student.goalScore
  } and weakest areas so far include: ${weakestLabel}. Write a short (2-3 sentence), friendly message asking whether they'd like you to first walk through what each question type is and how to approach it, or skip straight into their first lessons. End by making clear both options are fine. Do not use markdown, do not include the actual button text.`;
  return {
    prompt,
    fallback: `Before we dive in — want me to walk you through what each question type is and how to approach it, or would you rather skip straight to your first lessons? Either way works, it's totally up to you.`,
  };
}

export function buildRoundCompletePrompt(
  student: Pick<Student, "goalScore" | "currentScore">,
  roundNumber: number
): MrKimPrompt {
  const prompt = `A student just finished round ${roundNumber} of their ACT study plan (a full sequence of lessons and practice). Their goal composite is ${
    student.goalScore
  }, current estimated score ${student.currentScore ?? "unknown"}. Write a short (2-3 sentence) congratulatory message, then ask whether they'd like to take a full-length practice test or another diagnostic to measure their progress and unlock the next round of lessons. Do not use markdown, do not include button text.`;
  return {
    prompt,
    fallback: `Nice work finishing round ${roundNumber} of your plan! To see how much you've improved and figure out what to focus on next, let's check your progress — you can take a full-length practice test or a shorter diagnostic, whichever you'd prefer.`,
  };
}

export function buildRoundFollowUpPrompt(
  student: Pick<Student, "goalScore">,
  previousComposite: number | null,
  newComposite: number | null,
  roundNumber: number
): MrKimPrompt {
  const improved = previousComposite != null && newComposite != null && newComposite > previousComposite;
  const dropped = previousComposite != null && newComposite != null && newComposite < previousComposite;

  const prompt = `A student just completed a test/diagnostic after finishing round ${roundNumber - 1} of their ACT study plan. Their previous composite score was ${
    previousComposite ?? "unknown"
  } and their new composite score is ${newComposite ?? "unknown"}. Their goal is ${student.goalScore}. ${
    improved
      ? "Their score improved — congratulate them specifically and warmly."
      : dropped
        ? "Their score dropped slightly — respond supportively and reassuringly, scores naturally fluctuate, and refocus them on the next round."
        : "Their score stayed about the same — be encouraging and matter-of-fact about continuing to build."
  } Then briefly mention you've built round ${roundNumber} of their plan, now targeted at their newest weak points. Write 3-4 sentences, no markdown.`;

  const fallback = improved
    ? `Great progress — you went from ${previousComposite} to ${newComposite}! I've built round ${roundNumber} of your plan, targeted at your newest weak points, so let's keep that momentum going.`
    : dropped
      ? `Scores can bounce around day to day, so don't read too much into the dip from ${previousComposite} to ${newComposite} — it happens. I've built round ${roundNumber} of your plan around your current weak points; let's get back to it.`
      : `Your score held steady around ${newComposite ?? previousComposite}. I've put together round ${roundNumber} of your plan targeted at your current weak points — let's keep building.`;

  return { prompt, fallback };
}
