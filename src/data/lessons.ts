import type { SectionKey } from "./subtopics";

export interface Lesson {
  section: SectionKey;
  subtopic: string;
  title: string;
  body: string; // markdown-ish plain text, rendered with line breaks
  keyTakeaways: string[];
  youtubeSearchQuery: string;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export const LESSONS: Lesson[] = [
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    title: "Mastering ACT Punctuation",
    body: "The ACT English section tests a small, predictable set of punctuation rules over and over: commas around nonessential clauses, semicolons joining independent clauses, apostrophes for possession versus contraction, and colons introducing lists or explanations after a complete sentence.\n\nThe fastest way to get these right is to first identify whether the surrounding words form a complete sentence (independent clause) on each side of the punctuation mark. A semicolon or period needs a complete sentence on both sides. A comma alone cannot join two complete sentences (that's a comma splice). A colon needs a complete sentence before it, but not after.",
    keyTakeaways: [
      "Nonessential (nonrestrictive) clauses/phrases are set off by commas on both sides.",
      "Semicolons join two independent clauses, or precede a conjunctive adverb like 'however' or 'therefore'.",
      "'Its' = possessive, 'it's' = 'it is'. This is the single most-tested apostrophe rule.",
      "A colon must follow a complete, independent sentence.",
    ],
    youtubeSearchQuery: "ACT English punctuation rules commas semicolons colons",
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    title: "Fixing Fragments, Run-ons, and Agreement Errors",
    body: "Every ACT English test includes several questions about whether a sentence is grammatically complete. A sentence needs a subject and a full verb, and it can't start with a subordinating word like 'because' or 'although' and stand alone.\n\nRun-ons and comma splices happen when two complete sentences are jammed together without proper punctuation or a conjunction. Fix them with a period, a semicolon, or a comma plus a coordinating conjunction (for, and, nor, but, or, yet, so).\n\nFor subject-verb and pronoun-antecedent agreement, always find the true subject or antecedent — ignore any prepositional phrases sitting in between ('the list of ingredients IS', not 'ARE', because 'list' is singular).",
    keyTakeaways: [
      "A complete sentence needs a subject + full verb and can't be introduced only by a subordinating conjunction.",
      "Fix run-ons with a period, semicolon, or comma + coordinating conjunction.",
      "Find the TRUE subject before checking verb agreement — ignore interrupting prepositional phrases.",
      "Match singular antecedents ('every player') with singular pronouns ('his or her'), not 'their'.",
    ],
    youtubeSearchQuery: "ACT English grammar fragments run-ons subject verb agreement",
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    title: "Cutting Redundancy and Wordiness",
    body: "The ACT rewards the most concise answer choice that keeps the sentence's original meaning intact. Watch for phrases that say the same thing twice ('reversed backwards', 'each and every', 'the reason why...is because') and for filler phrases that can be replaced by a single word ('at this point in time' → 'currently').\n\nA good strategy: read the shortest answer choice first. If it preserves the meaning and is grammatically correct, it's very often the right answer on these questions.",
    keyTakeaways: [
      "If two words in a phrase mean the same thing, cut one.",
      "'The reason...is that' is correct; 'the reason why...is because' is redundant.",
      "Replace wordy phrases like 'at this point in time' with concise alternatives like 'currently'.",
      "When choices differ only in length and all are grammatical, the shortest is usually correct.",
    ],
    youtubeSearchQuery: "ACT English redundancy wordiness concision questions",
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    title: "Choosing the Right Transition Word",
    body: "Transition questions test whether you understand the logical relationship between two ideas: cause-and-effect, contrast, addition, or example. Before looking at the answer choices, describe the relationship in your own words — does the second sentence agree with, contradict, or result from the first?\n\nCommon traps: 'however' and 'nevertheless' signal contrast; 'therefore' and 'consequently' signal cause-and-effect; 'similarly' and 'likewise' signal agreement; 'for example' and 'specifically' introduce an illustration.",
    keyTakeaways: [
      "Identify the logical relationship (cause/effect, contrast, addition, example) before reading the choices.",
      "Contrast words: however, nevertheless, on the other hand, conversely.",
      "Cause/effect words: therefore, consequently, as a result.",
      "Don't just pick a transition that 'sounds fine' — verify it matches the actual logic.",
    ],
    youtubeSearchQuery: "ACT English transition words logic questions strategy",
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    title: "Commonly Confused Words and Idioms",
    body: "A recurring ACT question type tests easily-confused word pairs: their/there/they're, affect/effect, fewer/less, imply/infer, between/among. Memorizing the handful of pairs that show up repeatedly is one of the highest-leverage things you can do for the English section.",
    keyTakeaways: [
      "affect = verb (to influence); effect = usually a noun (a result).",
      "fewer = countable nouns; less = uncountable quantities.",
      "imply = what the speaker/evidence suggests; infer = what the listener/reader concludes.",
      "between = two items; among = three or more items.",
    ],
    youtubeSearchQuery: "ACT English commonly confused words idioms affect effect fewer less",
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    title: "Pre-Algebra: Percents, Ratios, and Basic Operations",
    body: "Pre-algebra questions cover percents, ratios, proportions, and order of operations. For percent problems, convert the percent to a decimal and multiply. For ratio problems, add the parts of the ratio to find the total number of 'shares', then figure out how many units each share represents.\n\nAlways double check order of operations (PEMDAS) on multi-step arithmetic problems — this is a very common careless-error trap.",
    keyTakeaways: [
      "Percent of a number: convert to decimal, then multiply (15% of 240 = 0.15 × 240).",
      "Ratio word problems: add the ratio parts to get total shares, divide the total quantity by that, then scale up.",
      "Follow PEMDAS carefully — multiplication/division before addition/subtraction.",
    ],
    youtubeSearchQuery: "ACT Math pre-algebra percents ratios practice",
  },
  {
    section: "MATH",
    subtopic: "algebra",
    title: "Solving Equations, Functions, and Factoring",
    body: "Algebra questions ask you to solve linear equations, evaluate functions at a given input, factor quadratics, and solve systems of equations. For systems, adding or subtracting the two equations to eliminate a variable is usually faster than substitution.\n\nFor factoring x² + bx + c, look for two numbers that multiply to c and add to b.",
    keyTakeaways: [
      "Isolate the variable step by step, doing the same operation to both sides.",
      "To evaluate f(x) at a value, substitute carefully and follow order of operations.",
      "Factor x² + bx + c by finding two numbers that multiply to c and sum to b.",
      "For systems of two equations, try adding/subtracting them to eliminate a variable quickly.",
    ],
    youtubeSearchQuery: "ACT Math algebra solving equations factoring systems",
  },
  {
    section: "MATH",
    subtopic: "geometry",
    title: "Area, Perimeter, and the Pythagorean Theorem",
    body: "Geometry questions test area/perimeter/circumference formulas, triangle angle sums (180°), and the Pythagorean theorem (a² + b² = c²) for right triangles. Memorizing common Pythagorean triples (3-4-5, 6-8-10, 5-12-13) saves significant time.",
    keyTakeaways: [
      "Triangle interior angles always sum to 180°.",
      "Pythagorean theorem: a² + b² = c², where c is the hypotenuse.",
      "Memorize common triples: 3-4-5, 6-8-10, 5-12-13.",
      "Circle area = πr²; circumference = 2πr.",
    ],
    youtubeSearchQuery: "ACT Math geometry area perimeter pythagorean theorem",
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    title: "Right-Triangle Trigonometry (SOH-CAH-TOA)",
    body: "ACT trig questions almost always reduce to SOH-CAH-TOA: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. Know the exact values for 30°, 45°, and 60° angles, since these appear repeatedly.",
    keyTakeaways: [
      "SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.",
      "Memorize sin/cos/tan for 30°, 45°, and 60°.",
      "sin(90°) = 1 and sin(0°) = 0 — useful sanity checks.",
      "In a right triangle, the two non-right angles are complementary (sum to 90°).",
    ],
    youtubeSearchQuery: "ACT Math trigonometry SOH CAH TOA basics",
  },
  {
    section: "READING",
    subtopic: "main-idea",
    title: "Finding the Main Idea Quickly",
    body: "Main idea questions ask what the passage as a whole is 'primarily' about. The correct answer must be broad enough to cover the entire passage but not so broad that it goes beyond what's discussed. Watch for answer choices that describe only one paragraph rather than the whole passage — a classic trap.",
    keyTakeaways: [
      "The main idea covers the whole passage, not just one paragraph or detail.",
      "Eliminate choices that are too narrow (only part of the passage) or too broad (beyond the passage's scope).",
      "The first and last sentences of a passage often (but not always) hint at the main idea.",
    ],
    youtubeSearchQuery: "ACT Reading main idea questions strategy",
  },
  {
    section: "READING",
    subtopic: "detail",
    title: "Locating and Verifying Details",
    body: "Detail questions ask about specific facts stated in the passage. These are the most 'find it in the text' style questions — the answer is directly stated, sometimes reworded. Go back to the passage and confirm the exact wording rather than relying on memory or general impressions.",
    keyTakeaways: [
      "Detail questions have an answer directly stated (possibly reworded) in the passage — always verify by re-reading.",
      "Beware of choices that are true statements but don't answer the specific question asked.",
      "Don't rely on memory alone — small wording changes matter.",
    ],
    youtubeSearchQuery: "ACT Reading detail questions strategy going back to text",
  },
  {
    section: "READING",
    subtopic: "inference",
    title: "Drawing Reasonable Inferences",
    body: "Inference questions ask what the passage suggests or implies, without stating it directly. The correct answer must be strongly supported by the text — not just plausible in the real world. Avoid choices that require outside knowledge or make a bigger leap than the passage supports.",
    keyTakeaways: [
      "The correct inference is a small, well-supported step beyond what's directly stated — not a big leap.",
      "Avoid answer choices that bring in outside knowledge not implied by the passage.",
      "Look for textual evidence that clearly points toward the inference before choosing it.",
    ],
    youtubeSearchQuery: "ACT Reading inference questions strategy",
  },
  {
    section: "READING",
    subtopic: "vocab-in-context",
    title: "Vocabulary in Context",
    body: "These questions ask what a word 'most nearly means' as it's used in the passage — not its most common dictionary definition. Cover the answer choices, reread the sentence, and predict a replacement word yourself before looking at the options. Many wrong choices are a word's more common meaning that doesn't fit this specific context.",
    keyTakeaways: [
      "Always plug the answer choice back into the sentence to check that it fits the context.",
      "Watch for the 'common meaning trap' — the most familiar definition of a word is often the wrong answer.",
      "Predict your own replacement word from context before scanning the choices.",
    ],
    youtubeSearchQuery: "ACT Reading vocabulary in context strategy",
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    title: "Reading Graphs and Tables Efficiently",
    body: "Data Representation passages present information in tables, graphs, or charts. Most questions can be answered by locating and reading a single data point or comparing two data points — you don't need outside science knowledge. Pay close attention to axis labels and units before answering.",
    keyTakeaways: [
      "Most answers can be found by locating specific values directly in the table or graph.",
      "Always check axis labels and units — a common trap is misreading what's being measured.",
      "For 'trend' questions, look at whether values are consistently increasing, decreasing, or irregular.",
    ],
    youtubeSearchQuery: "ACT Science data representation graphs tables strategy",
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    title: "Understanding Experimental Design",
    body: "Research Summaries passages describe one or more experiments. Identify the independent variable (what the researchers changed) and the dependent variable (what they measured) for each experiment. Many questions ask you to compare experiments or predict a result at a value not directly tested — use the trend in the existing data to estimate.",
    keyTakeaways: [
      "Independent variable = what's deliberately changed; dependent variable = what's measured as a result.",
      "To predict an untested value, use the trend between the closest surrounding data points.",
      "Compare experiments carefully — check exactly what differs between them.",
    ],
    youtubeSearchQuery: "ACT Science research summaries experimental design strategy",
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    title: "Comparing Conflicting Viewpoints",
    body: "Conflicting Viewpoints passages present two or more scientists' differing explanations for the same phenomenon. Track each scientist's core claim separately, and note where they agree and where they disagree. Questions often ask which new piece of evidence would support one viewpoint over another.",
    keyTakeaways: [
      "Summarize each viewpoint's core claim in your own words as you read.",
      "Note explicitly where the viewpoints agree, not just where they disagree.",
      "'Which evidence supports X over Y' questions require evidence that fits X but not Y.",
    ],
    youtubeSearchQuery: "ACT Science conflicting viewpoints passage strategy",
  },
];

export function getLesson(section: SectionKey, subtopic: string): Lesson | undefined {
  return LESSONS.find((l) => l.section === section && l.subtopic === subtopic);
}
