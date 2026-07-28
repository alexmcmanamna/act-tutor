import type { SectionKey } from "./subtopics";

export interface SeedQuestion {
  section: SectionKey;
  subtopic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  passage?: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  inDiagnostic: boolean;
}

/**
 * Difficulty rubric (1-5). This app has no runtime AI question-generation
 * step — the bank below is hand-authored and seeded once into the DB — so
 * this rubric is applied directly to every question at authoring time
 * rather than injected as a prompt, and governs `recommendedDifficulty()`
 * in src/lib/adaptive.ts, which picks a target difficulty from mastery.
 *
 * 1 — Single, obvious rule/step. One distractor is clearly wrong to anyone
 *     who's seen the concept once. No multi-step reasoning.
 * 2 — One rule applied in a slightly less obvious spot, or a two-step
 *     computation. Distractors represent one common, superficial mistake.
 * 3 — Requires combining two related ideas (e.g., a grammar rule AND a
 *     rhetorical judgment call; a formula AND a word-problem setup step).
 *     At least one distractor reflects a genuine common misconception,
 *     not just an obviously wrong answer.
 * 4 — Multi-step reasoning, or a rule applied in an atypical/nested
 *     structure (e.g., a modifier inside a parenthetical; a system of
 *     equations word problem; an inference that requires weighing two
 *     pieces of textual evidence). Every distractor is plausible on a
 *     surface read.
 * 5 — Real ACT-level difficulty: dense or ambiguous phrasing, a "furthest
 *     right" NO CHANGE option, a multi-step derivation with an easy
 *     arithmetic trap, or a reading/science inference that requires
 *     synthesizing the whole passage rather than one sentence. A rushed
 *     or careless student should get this wrong even with real knowledge.
 */
export const QUESTIONS: SeedQuestion[] = [
  // ===================== ENGLISH: punctuation =====================
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 1,
    prompt: "Which version of the sentence is correctly punctuated?",
    choices: [
      "The museum which opened in 1995, has over ten thousand artifacts.",
      "The museum, which opened in 1995, has over ten thousand artifacts.",
      "The museum which opened in 1995 has over ten thousand artifacts,.",
      "The museum, which opened in 1995 has over ten thousand artifacts.",
    ],
    correctIndex: 1,
    explanation:
      "Nonrestrictive (nonessential) clauses like 'which opened in 1995' must be set off by commas on both sides.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 2,
    prompt: "Which sentence uses the apostrophe correctly?",
    choices: [
      "The company lost it's biggest client last year.",
      "The company lost its biggest client last year.",
      "The company lost its' biggest client last year.",
      "The company lost the biggest client of it's last year.",
    ],
    correctIndex: 1,
    explanation:
      "'Its' is the possessive form and takes no apostrophe. 'It's' is a contraction of 'it is'.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 2,
    prompt: "Which sentence is correctly punctuated?",
    choices: [
      "I wanted to go for a run, however it started raining.",
      "I wanted to go for a run; however, it started raining.",
      "I wanted to go for a run however, it started raining.",
      "I wanted to go for a run; however it started raining,.",
    ],
    correctIndex: 1,
    explanation:
      "A semicolon is needed before a conjunctive adverb like 'however' joining two independent clauses, followed by a comma.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 3,
    prompt: "Which sentence is punctuated correctly?",
    choices: [
      "She ran to the store, and bought some milk.",
      "She ran to the store and bought some milk.",
      "She ran, to the store and bought some milk.",
      "She ran to the store and, bought some milk.",
    ],
    correctIndex: 1,
    explanation:
      "No comma is needed before 'and' when it joins a compound predicate (one subject, two verbs) rather than two independent clauses.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 3,
    prompt: "Which sentence correctly uses a colon?",
    choices: [
      "My favorite subjects are: math and science.",
      "My favorite subjects are math and science.",
      "I have two favorite subjects: math and science.",
      "I have two favorite subjects, math: and science.",
    ],
    correctIndex: 2,
    explanation:
      "A colon must follow a complete independent clause. 'My favorite subjects are' is incomplete without a complement, but 'I have two favorite subjects' is complete.",
    inDiagnostic: true,
  },

  // ===================== ENGLISH: sentence-structure =====================
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 1,
    prompt: "Which of the following is a complete sentence (not a fragment)?",
    choices: [
      "Running through the park every morning before school.",
      "She runs through the park every morning before school.",
      "Because she runs through the park every morning before school.",
      "Through the park every morning before school.",
    ],
    correctIndex: 1,
    explanation: "Only this choice has both a subject ('She') and a complete verb ('runs') forming an independent clause.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 2,
    prompt:
      "Which choice best corrects this run-on sentence: 'The concert was sold out, we watched the livestream instead.'",
    choices: [
      "The concert was sold out, we watched the livestream instead.",
      "The concert was sold out we watched the livestream instead.",
      "The concert was sold out, so we watched the livestream instead.",
      "The concert was sold out and, we watched the livestream instead.",
    ],
    correctIndex: 2,
    explanation:
      "Adding the coordinating conjunction 'so' after the comma correctly joins the two independent clauses and fixes the comma splice.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 2,
    prompt: "Which sentence has correct subject-verb agreement?",
    choices: [
      "The list of ingredients are on the back of the box.",
      "The list of ingredients is on the back of the box.",
      "The lists of ingredients is on the back of the box.",
      "The list of ingredient's are on the back of the box.",
    ],
    correctIndex: 1,
    explanation:
      "The subject is the singular noun 'list' (the prepositional phrase 'of ingredients' does not affect agreement), so it takes the singular verb 'is'.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 3,
    prompt: "Which sentence uses a pronoun that correctly agrees with its antecedent?",
    choices: [
      "Every player must wear their helmet during practice.",
      "Every player must wear his or her helmet during practice.",
      "Every player must wear our helmet during practice.",
      "Every player must wear its helmet during practice.",
    ],
    correctIndex: 1,
    explanation:
      "'Every player' is a singular antecedent, so the pronoun referring to it should be the singular 'his or her,' not the plural 'their.'",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 3,
    prompt: "Which sentence avoids a misplaced (dangling) modifier?",
    choices: [
      "Walking down the street, the flowers looked beautiful.",
      "Walking down the street, I thought the flowers looked beautiful.",
      "The flowers looked beautiful, walking down the street.",
      "Beautiful, walking down the street, were the flowers.",
    ],
    correctIndex: 1,
    explanation:
      "The introductory phrase 'Walking down the street' must be followed by the person doing the walking ('I'), not the flowers.",
    inDiagnostic: true,
  },

  // ===================== ENGLISH: redundancy =====================
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 1,
    prompt: "Which is the most concise, correct version of the sentence?",
    choices: [
      "Sarah reversed backwards out of the driveway.",
      "Sarah reversed out of the driveway.",
      "Sarah backed up backwards out of the driveway.",
      "Sarah, reversing, backed backwards, out of the driveway.",
    ],
    correctIndex: 1,
    explanation: "'Reversed' already means moving backwards, so adding 'backwards' is redundant.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 2,
    prompt: "Which is the most concise, correct version of the sentence?",
    choices: [
      "The reason why he was late is because his car broke down.",
      "The reason he was late is that his car broke down.",
      "The reason why he was late is because of the fact that his car broke down.",
      "He was late is because his car broke down.",
    ],
    correctIndex: 1,
    explanation: "'The reason...is that' is the standard, non-redundant construction; 'the reason why...is because' doubles up the causal meaning.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 2,
    prompt: "Which is the most concise, correct version of the sentence?",
    choices: [
      "Each and every student must submit the form by Friday.",
      "Each and every one of the students must submit the form by Friday.",
      "Every student must submit the form by Friday.",
      "Each and every single student must submit the form by Friday.",
    ],
    correctIndex: 2,
    explanation: "'Each and every' is redundant; 'every' alone conveys the same meaning.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 3,
    prompt: "Which is the most concise, correct version of the sentence?",
    choices: [
      "At this point in time, the committee has not yet reached a final decision.",
      "At this point in time, the committee has not reached a final decision yet.",
      "Currently, the committee has not yet reached a decision.",
      "Right now, at this point in time, the committee has not reached a final decision.",
    ],
    correctIndex: 2,
    explanation: "'At this point in time' is wordy for 'currently,' and dropping the extra 'final' tightens the sentence further.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 3,
    prompt: "Which is the most concise, correct version of the sentence?",
    choices: [
      "The two twins shared an identical resemblance to one another.",
      "The twins resembled each other.",
      "The two twins looked exactly alike as each other.",
      "The twins shared a resemblance that was identical to one another's.",
    ],
    correctIndex: 1,
    explanation: "'Twins' already implies two people, and 'resembled each other' conveys the idea without redundant words.",
    inDiagnostic: true,
  },

  // ===================== ENGLISH: transitions =====================
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 1,
    prompt: "It rained all weekend. ___, the outdoor festival was cancelled.",
    choices: ["However", "For example", "As a result", "In contrast"],
    correctIndex: 2,
    explanation: "The cancellation is a direct consequence of the rain, so a cause-and-effect transition like 'As a result' fits best.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 2,
    prompt: "Maria studied hard for the exam. ___, she felt nervous walking into the testing room.",
    choices: ["Therefore", "Nevertheless", "Similarly", "In addition"],
    correctIndex: 1,
    explanation: "'Nevertheless' signals contrast — despite studying hard, she still felt nervous.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 2,
    prompt: "The company's profits grew by 10% last year. ___, its stock price declined.",
    choices: ["Consequently", "However", "In addition", "Specifically"],
    correctIndex: 1,
    explanation: "The stock decline is unexpected given rising profits, so a contrast word like 'However' is needed.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 3,
    prompt:
      "Many people believe that reading fiction is a waste of time. ___, studies show it improves empathy and critical thinking.",
    choices: ["Similarly", "In fact", "On the other hand", "Likewise"],
    correctIndex: 2,
    explanation: "The second sentence contradicts the popular belief, so 'On the other hand' correctly signals that contrast.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 3,
    prompt: "The bridge was closed for repairs. ___, commuters had to take a longer route to work.",
    choices: ["Consequently", "Meanwhile", "For instance", "Conversely"],
    correctIndex: 0,
    explanation: "The longer commute is a direct effect of the bridge closure, so 'Consequently' fits.",
    inDiagnostic: true,
  },

  // ===================== ENGLISH: word-choice =====================
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 1,
    prompt: "Choose the word that correctly completes the sentence: '___ going to the concert tonight.'",
    choices: ["Their", "There", "They're", "Thier"],
    correctIndex: 2,
    explanation: "'They're' is the contraction of 'they are,' which fits the sentence.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 2,
    prompt: "Choose the word that correctly completes the sentence: 'The weather ___ how many people visit the beach.'",
    choices: ["affects", "effects", "affect's", "affected's"],
    correctIndex: 0,
    explanation: "'Affects' is the verb form meaning 'influences.' 'Effects' is typically the noun form.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 2,
    prompt: "Choose the word that correctly completes the sentence: 'There were ___ students in class today than yesterday.'",
    choices: ["fewer", "less", "lesser", "little"],
    correctIndex: 0,
    explanation: "'Fewer' is used with countable nouns like 'students'; 'less' is used with uncountable quantities.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 3,
    prompt: "Choose the word that correctly completes the sentence: 'The evidence ___ that the treatment is effective.'",
    choices: ["implies", "infers", "implied", "inferred"],
    correctIndex: 0,
    explanation: "Evidence 'implies' a conclusion; a person 'infers' a conclusion from evidence. Present tense fits the sentence.",
    inDiagnostic: false,
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 3,
    prompt: "Choose the word that correctly completes the sentence: '___ the three finalists, she was the most prepared.'",
    choices: ["Between", "Among", "Beside", "Amongst her"],
    correctIndex: 1,
    explanation: "'Among' is used for three or more items; 'between' is reserved for exactly two.",
    inDiagnostic: true,
  },

  // ===================== MATH: pre-algebra =====================
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 1,
    prompt: "What is 15% of 240?",
    choices: ["24", "36", "42", "48"],
    correctIndex: 1,
    explanation: "0.15 × 240 = 36.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 1,
    prompt: "Simplify: -3 + 7 × 2",
    choices: ["8", "11", "22", "-8"],
    correctIndex: 1,
    explanation: "By order of operations, 7 × 2 = 14 first, then -3 + 14 = 11.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 2,
    prompt: "A shirt originally priced at $40 is discounted by 25%. What is the sale price?",
    choices: ["$30", "$35", "$32", "$28"],
    correctIndex: 0,
    explanation: "40 × (1 − 0.25) = 40 × 0.75 = $30.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 2,
    prompt: "If 3x = 21, what is the value of 5x?",
    choices: ["15", "25", "35", "45"],
    correctIndex: 2,
    explanation: "x = 7, so 5x = 35.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 3,
    prompt: "The ratio of boys to girls in a class is 3:4. If there are 28 students total, how many are girls?",
    choices: ["12", "14", "16", "18"],
    correctIndex: 2,
    explanation: "3 + 4 = 7 parts; 28 ÷ 7 = 4 students per part; girls = 4 × 4 = 16.",
    inDiagnostic: true,
  },

  // ===================== MATH: algebra =====================
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 2,
    prompt: "Solve for x: 2x + 5 = 17",
    choices: ["5", "6", "7", "8"],
    correctIndex: 1,
    explanation: "2x = 12, so x = 6.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 2,
    prompt: "Solve for x: 3(x - 4) = 2x + 1",
    choices: ["11", "12", "13", "14"],
    correctIndex: 2,
    explanation: "3x − 12 = 2x + 1 → x = 13.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 3,
    prompt: "If f(x) = 2x² - 3x + 1, what is f(2)?",
    choices: ["1", "3", "5", "7"],
    correctIndex: 1,
    explanation: "2(4) − 3(2) + 1 = 8 − 6 + 1 = 3.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 3,
    prompt: "Factor: x² - 5x + 6",
    choices: ["(x - 2)(x - 3)", "(x - 1)(x - 6)", "(x + 2)(x + 3)", "(x - 6)(x + 1)"],
    correctIndex: 0,
    explanation: "Two numbers that multiply to 6 and add to -5 are -2 and -3.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 4,
    prompt: "Solve the system: x + y = 10, x - y = 2. What is x?",
    choices: ["4", "5", "6", "8"],
    correctIndex: 2,
    explanation: "Adding the equations: 2x = 12, so x = 6.",
    inDiagnostic: true,
  },

  // ===================== MATH: geometry =====================
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 2,
    prompt: "What is the area of a rectangle with length 8 and width 5?",
    choices: ["13", "26", "40", "45"],
    correctIndex: 2,
    explanation: "Area = length × width = 8 × 5 = 40.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 2,
    prompt: "A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?",
    choices: ["9", "10", "11", "12"],
    correctIndex: 1,
    explanation: "By the Pythagorean theorem: √(6² + 8²) = √100 = 10.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 3,
    prompt: "What is the circumference of a circle with radius 7? (Use π ≈ 22/7)",
    choices: ["22", "44", "154", "88"],
    correctIndex: 1,
    explanation: "C = 2πr = 2 × (22/7) × 7 = 44.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 3,
    prompt: "The measures of two angles in a triangle are 50° and 60°. What is the measure of the third angle?",
    choices: ["60°", "65°", "70°", "80°"],
    correctIndex: 2,
    explanation: "Triangle angles sum to 180°: 180 − 50 − 60 = 70°.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 4,
    prompt: "A circle has an area of 36π. What is its radius?",
    choices: ["4", "6", "9", "18"],
    correctIndex: 1,
    explanation: "Area = πr² = 36π → r² = 36 → r = 6.",
    inDiagnostic: true,
  },

  // ===================== MATH: trigonometry =====================
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 3,
    prompt: "In a right triangle, if sin(θ) = 3/5, what is cos(θ) for acute θ? (Think 3-4-5 triangle)",
    choices: ["3/5", "4/5", "5/3", "5/4"],
    correctIndex: 1,
    explanation: "A 3-4-5 right triangle gives opposite = 3, adjacent = 4, hypotenuse = 5, so cos(θ) = adjacent/hypotenuse = 4/5.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 3,
    prompt: "What is tan(45°)?",
    choices: ["0", "1", "√2", "undefined"],
    correctIndex: 1,
    explanation: "At 45°, sin and cos are equal, so tan(45°) = sin/cos = 1.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 4,
    prompt:
      "A right triangle has an angle of 30° and a hypotenuse of length 10. What is the length of the side opposite the 30° angle?",
    choices: ["5", "5√3", "10√3", "8.66"],
    correctIndex: 0,
    explanation: "opposite = hypotenuse × sin(30°) = 10 × 0.5 = 5.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 4,
    prompt: "What is the value of sin(90°)?",
    choices: ["0", "0.5", "1", "undefined"],
    correctIndex: 2,
    explanation: "sin(90°) = 1, its maximum value.",
    inDiagnostic: false,
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 5,
    prompt:
      "In a right triangle, the side opposite a 60° angle has length 6√3. What is the length of the hypotenuse?",
    choices: ["6", "9", "12", "6√3"],
    correctIndex: 2,
    explanation: "opposite = hyp × sin(60°) = hyp × (√3/2). So hyp = 6√3 ÷ (√3/2) = 12.",
    inDiagnostic: true,
  },

  // ===================== SCIENCE: data-representation =====================
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 2,
    passage:
      "A study measured the growth of a plant (in cm) over 5 weeks under three light conditions.\n" +
      "Week:                1   2   3   4   5\n" +
      "Low light height:    2   3   4   5   6\n" +
      "Medium light height: 2   4   7   8  10\n" +
      "High light height:   2   5   9  11  14",
    prompt: "According to the data, which light condition produced the tallest plant by Week 5?",
    choices: ["Low", "Medium", "High", "All were equal"],
    correctIndex: 2,
    explanation: "At Week 5, High light height (14 cm) is greater than Medium (10 cm) and Low (6 cm).",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 2,
    passage:
      "A study measured the growth of a plant (in cm) over 5 weeks under three light conditions.\n" +
      "Week:                1   2   3   4   5\n" +
      "Low light height:    2   3   4   5   6\n" +
      "Medium light height: 2   4   7   8  10\n" +
      "High light height:   2   5   9  11  14",
    prompt: "What was the height of the plant under Medium light at Week 3?",
    choices: ["4 cm", "6 cm", "7 cm", "8 cm"],
    correctIndex: 2,
    explanation: "Reading the Medium light row at Week 3 gives 7 cm.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 3,
    passage:
      "A study measured the growth of a plant (in cm) over 5 weeks under three light conditions.\n" +
      "Week:                1   2   3   4   5\n" +
      "Low light height:    2   3   4   5   6\n" +
      "Medium light height: 2   4   7   8  10\n" +
      "High light height:   2   5   9  11  14",
    prompt: "Between Week 4 and Week 5, by how many centimeters did the High light plant grow?",
    choices: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation: "14 cm (Week 5) − 11 cm (Week 4) = 3 cm.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 3,
    passage:
      "A study measured the growth of a plant (in cm) over 5 weeks under three light conditions.\n" +
      "Week:                1   2   3   4   5\n" +
      "Low light height:    2   3   4   5   6\n" +
      "Medium light height: 2   4   7   8  10\n" +
      "High light height:   2   5   9  11  14",
    prompt: "Which light condition shows the most consistent (constant) rate of growth from week to week?",
    choices: ["Low", "Medium", "High", "They are all equally consistent"],
    correctIndex: 0,
    explanation: "Low light height increases by exactly 1 cm every week (2,3,4,5,6), while Medium and High vary week to week.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 3,
    passage:
      "A study measured the growth of a plant (in cm) over 5 weeks under three light conditions.\n" +
      "Week:                1   2   3   4   5\n" +
      "Low light height:    2   3   4   5   6\n" +
      "Medium light height: 2   4   7   8  10\n" +
      "High light height:   2   5   9  11  14",
    prompt: "If the trend for Low light continued, what would be the predicted height at Week 6?",
    choices: ["6 cm", "7 cm", "8 cm", "9 cm"],
    correctIndex: 1,
    explanation: "Low light grows by 1 cm per week, so Week 6 would be 6 + 1 = 7 cm.",
    inDiagnostic: true,
  },

  // ===================== SCIENCE: research-summary =====================
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 2,
    passage:
      "Researchers tested how fertilizer concentration (g/L) affects tomatoes produced per plant.\n" +
      "Experiment 1: 0 g/L → 4 tomatoes\n" +
      "Experiment 2: 5 g/L → 9 tomatoes\n" +
      "Experiment 3: 10 g/L → 14 tomatoes\n" +
      "Experiment 4: 15 g/L → 10 tomatoes (excess fertilizer harmed the plant)",
    prompt: "Which experiment produced the most tomatoes per plant?",
    choices: ["Experiment 1", "Experiment 2", "Experiment 3", "Experiment 4"],
    correctIndex: 2,
    explanation: "Experiment 3 (10 g/L) produced 14 tomatoes, the highest value listed.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 3,
    passage:
      "Researchers tested how fertilizer concentration (g/L) affects tomatoes produced per plant.\n" +
      "Experiment 1: 0 g/L → 4 tomatoes\n" +
      "Experiment 2: 5 g/L → 9 tomatoes\n" +
      "Experiment 3: 10 g/L → 14 tomatoes\n" +
      "Experiment 4: 15 g/L → 10 tomatoes (excess fertilizer harmed the plant)",
    prompt: "Based on the data, what can be concluded about fertilizer concentration and tomato production?",
    choices: [
      "Tomato production increases indefinitely as fertilizer concentration increases.",
      "Tomato production increases with fertilizer up to a point, then decreases with too much fertilizer.",
      "Fertilizer concentration has no effect on tomato production.",
      "Tomato production is highest with no fertilizer at all.",
    ],
    correctIndex: 1,
    explanation: "Production rises from 4 to 14 tomatoes as fertilizer increases to 10 g/L, then falls to 10 tomatoes at 15 g/L.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 2,
    passage:
      "Researchers tested how fertilizer concentration (g/L) affects tomatoes produced per plant.\n" +
      "Experiment 1: 0 g/L → 4 tomatoes\n" +
      "Experiment 2: 5 g/L → 9 tomatoes\n" +
      "Experiment 3: 10 g/L → 14 tomatoes\n" +
      "Experiment 4: 15 g/L → 10 tomatoes (excess fertilizer harmed the plant)",
    prompt: "What was the independent variable in this experiment?",
    choices: ["Number of tomatoes produced", "Fertilizer concentration", "Number of plants", "Type of tomato"],
    correctIndex: 1,
    explanation: "The researchers deliberately varied fertilizer concentration and measured its effect on tomato yield.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 3,
    passage:
      "Researchers tested how fertilizer concentration (g/L) affects tomatoes produced per plant.\n" +
      "Experiment 1: 0 g/L → 4 tomatoes\n" +
      "Experiment 2: 5 g/L → 9 tomatoes\n" +
      "Experiment 3: 10 g/L → 14 tomatoes\n" +
      "Experiment 4: 15 g/L → 10 tomatoes (excess fertilizer harmed the plant)",
    prompt: "If Experiment 5 used 7.5 g/L of fertilizer, the number of tomatoes produced would most likely be:",
    choices: ["3", "6", "11", "20"],
    correctIndex: 2,
    explanation: "7.5 g/L is between 5 g/L (9 tomatoes) and 10 g/L (14 tomatoes), so a value in between, like 11, is most reasonable.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 4,
    passage:
      "Researchers tested how fertilizer concentration (g/L) affects tomatoes produced per plant.\n" +
      "Experiment 1: 0 g/L → 4 tomatoes\n" +
      "Experiment 2: 5 g/L → 9 tomatoes\n" +
      "Experiment 3: 10 g/L → 14 tomatoes\n" +
      "Experiment 4: 15 g/L → 10 tomatoes (excess fertilizer harmed the plant)",
    prompt: "Why did Experiment 4 produce fewer tomatoes than Experiment 3, despite using more fertilizer?",
    choices: [
      "The plant in Experiment 4 received less sunlight.",
      "Excess fertilizer became harmful to the plant beyond an optimal concentration.",
      "Experiment 4 used a different type of tomato plant.",
      "The data for Experiment 4 was recorded incorrectly.",
    ],
    correctIndex: 1,
    explanation: "The passage states excess fertilizer harmed the plant, consistent with yield dropping past the optimal concentration.",
    inDiagnostic: true,
  },

  // ===================== SCIENCE: conflicting-viewpoints =====================
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 2,
    passage:
      "Two scientists debate the cause of a mass die-off of fish in a lake.\n" +
      "Scientist 1: The die-off was caused by a sudden drop in dissolved oxygen from an algal bloom, which consumed oxygen as it decomposed.\n" +
      "Scientist 2: The die-off was caused by an increase in water temperature, which reduced the water's capacity to hold oxygen and stressed the fish directly.",
    prompt: "According to Scientist 1, what directly caused the fish die-off?",
    choices: [
      "Rising water temperature",
      "Low dissolved oxygen from algal decomposition",
      "A new predator species",
      "Pollution from a nearby factory",
    ],
    correctIndex: 1,
    explanation: "Scientist 1 attributes the die-off to decomposing algae consuming dissolved oxygen.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 2,
    passage:
      "Two scientists debate the cause of a mass die-off of fish in a lake.\n" +
      "Scientist 1: The die-off was caused by a sudden drop in dissolved oxygen from an algal bloom, which consumed oxygen as it decomposed.\n" +
      "Scientist 2: The die-off was caused by an increase in water temperature, which reduced the water's capacity to hold oxygen and stressed the fish directly.",
    prompt: "According to Scientist 2, what directly caused the fish die-off?",
    choices: ["An algal bloom", "Increased water temperature", "Overfishing", "A parasite outbreak"],
    correctIndex: 1,
    explanation: "Scientist 2 attributes the die-off to rising water temperature reducing oxygen capacity and stressing fish.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 3,
    passage:
      "Two scientists debate the cause of a mass die-off of fish in a lake.\n" +
      "Scientist 1: The die-off was caused by a sudden drop in dissolved oxygen from an algal bloom, which consumed oxygen as it decomposed.\n" +
      "Scientist 2: The die-off was caused by an increase in water temperature, which reduced the water's capacity to hold oxygen and stressed the fish directly.",
    prompt: "On which point would both scientists most likely agree?",
    choices: [
      "Dissolved oxygen levels dropped before the die-off.",
      "The lake's water temperature was unaffected.",
      "The die-off was caused by human pollution.",
      "Algae was not present in the lake.",
    ],
    correctIndex: 0,
    explanation: "Both explanations involve reduced dissolved oxygen, whether from decomposition or from warmer water holding less oxygen.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 3,
    passage:
      "Two scientists debate the cause of a mass die-off of fish in a lake.\n" +
      "Scientist 1: The die-off was caused by a sudden drop in dissolved oxygen from an algal bloom, which consumed oxygen as it decomposed.\n" +
      "Scientist 2: The die-off was caused by an increase in water temperature, which reduced the water's capacity to hold oxygen and stressed the fish directly.",
    prompt: "Which piece of new evidence would most strengthen Scientist 2's argument over Scientist 1's?",
    choices: [
      "Water temperature stayed constant throughout the die-off.",
      "Water temperature rose sharply just before the die-off, while algae levels stayed normal.",
      "A large algal bloom was documented just before the die-off.",
      "The lake's fish population had been declining for unrelated reasons for years.",
    ],
    correctIndex: 1,
    explanation: "Showing a temperature spike with no unusual algae activity isolates temperature as the cause, supporting Scientist 2.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 4,
    passage:
      "Two scientists debate the cause of a mass die-off of fish in a lake.\n" +
      "Scientist 1: The die-off was caused by a sudden drop in dissolved oxygen from an algal bloom, which consumed oxygen as it decomposed.\n" +
      "Scientist 2: The die-off was caused by an increase in water temperature, which reduced the water's capacity to hold oxygen and stressed the fish directly.",
    prompt: "Both scientists' explanations share which underlying mechanism for the fish die-off?",
    choices: ["Increased predation", "Reduced dissolved oxygen in the water", "Direct fish poisoning by toxins", "Physical injury to the fish"],
    correctIndex: 1,
    explanation: "Both scenarios ultimately reduce the dissolved oxygen available to the fish, just via different causes.",
    inDiagnostic: true,
  },

  // ===================== READING =====================
  {
    section: "READING",
    subtopic: "main-idea",
    difficulty: 2,
    passage:
      "When Elena first moved to the coastal town, she found the constant sound of the waves unsettling rather than soothing. Raised in the mountains, she was used to silence broken only by wind through pine trees. Months passed, and gradually the rhythm of the tide became something she listened for, a background hum that steadied her thoughts before sleep. By the time her parents visited in the spring, she realized she could no longer imagine living somewhere without the ocean nearby. Her mother remarked that Elena seemed calmer, more rooted, than she had been in years. Elena smiled, thinking of how strange it was that a place which once felt so foreign now felt, unmistakably, like home.",
    prompt: "Which statement best expresses the main idea of the passage?",
    choices: [
      "Elena regrets moving away from the mountains.",
      "Elena's relationship with the ocean town changed from discomfort to a sense of belonging.",
      "Elena's parents disapproved of her move to the coast.",
      "Silence is more calming than the sound of waves.",
    ],
    correctIndex: 1,
    explanation: "The passage traces Elena's shift from finding the waves unsettling to feeling the town is home.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "detail",
    difficulty: 1,
    passage:
      "When Elena first moved to the coastal town, she found the constant sound of the waves unsettling rather than soothing. Raised in the mountains, she was used to silence broken only by wind through pine trees. Months passed, and gradually the rhythm of the tide became something she listened for, a background hum that steadied her thoughts before sleep. By the time her parents visited in the spring, she realized she could no longer imagine living somewhere without the ocean nearby. Her mother remarked that Elena seemed calmer, more rooted, than she had been in years. Elena smiled, thinking of how strange it was that a place which once felt so foreign now felt, unmistakably, like home.",
    prompt: "According to the passage, what did Elena's mother notice about her during the spring visit?",
    choices: [
      "She seemed calmer and more rooted.",
      "She wanted to move back to the mountains.",
      "She had grown tired of the ocean.",
      "She missed the sound of wind through the pines.",
    ],
    correctIndex: 0,
    explanation: "The passage directly states that her mother remarked Elena seemed calmer, more rooted.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "inference",
    difficulty: 3,
    passage:
      "When Elena first moved to the coastal town, she found the constant sound of the waves unsettling rather than soothing. Raised in the mountains, she was used to silence broken only by wind through pine trees. Months passed, and gradually the rhythm of the tide became something she listened for, a background hum that steadied her thoughts before sleep. By the time her parents visited in the spring, she realized she could no longer imagine living somewhere without the ocean nearby. Her mother remarked that Elena seemed calmer, more rooted, than she had been in years. Elena smiled, thinking of how strange it was that a place which once felt so foreign now felt, unmistakably, like home.",
    prompt: "It can reasonably be inferred that Elena's initial discomfort with the ocean was mainly due to:",
    choices: [
      "A fear of water",
      "Unfamiliarity, since she grew up in a quiet mountain environment",
      "A traumatic experience at the beach",
      "Disliking her new neighbors",
    ],
    correctIndex: 1,
    explanation: "The passage links her initial discomfort to being 'raised in the mountains' and used to silence, implying unfamiliarity.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "vocab-in-context",
    difficulty: 2,
    passage:
      "When Elena first moved to the coastal town, she found the constant sound of the waves unsettling rather than soothing. Raised in the mountains, she was used to silence broken only by wind through pine trees. Months passed, and gradually the rhythm of the tide became something she listened for, a background hum that steadied her thoughts before sleep. By the time her parents visited in the spring, she realized she could no longer imagine living somewhere without the ocean nearby. Her mother remarked that Elena seemed calmer, more rooted, than she had been in years. Elena smiled, thinking of how strange it was that a place which once felt so foreign now felt, unmistakably, like home.",
    prompt: "As used in the passage, the word 'rooted' most nearly means:",
    choices: ["Physically buried in soil", "Confused and lost", "Settled and secure", "Restless and eager to leave"],
    correctIndex: 2,
    explanation: "In context, 'rooted' describes Elena's emotional state alongside 'calmer,' meaning settled and secure.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "main-idea",
    difficulty: 2,
    passage:
      "Urban beekeeping has grown rapidly in cities over the past decade, as residents install hives on rooftops and in community gardens. Proponents argue that city bees actually thrive better than their rural counterparts, since urban areas often provide a wider variety of flowering plants across parks, gardens, and street trees, blooming at different times throughout the year. This diversity gives bees a more consistent food supply than the single-crop fields common in agricultural regions, where pesticide use is also typically higher. Critics counter that concentrating too many hives in a small urban area can strain limited floral resources, leading colonies to compete with each other and with wild native pollinators. Despite this debate, most researchers agree that thoughtfully managed urban beekeeping can benefit both bee populations and city biodiversity.",
    prompt: "The passage is primarily concerned with:",
    choices: [
      "Explaining why bees are disappearing from cities",
      "Weighing the benefits and drawbacks of beekeeping in urban areas",
      "Describing how to start a rooftop beehive",
      "Comparing bee species found in cities versus farms",
    ],
    correctIndex: 1,
    explanation: "The passage presents both proponents' and critics' views on urban beekeeping, weighing benefits against drawbacks.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "detail",
    difficulty: 2,
    passage:
      "Urban beekeeping has grown rapidly in cities over the past decade, as residents install hives on rooftops and in community gardens. Proponents argue that city bees actually thrive better than their rural counterparts, since urban areas often provide a wider variety of flowering plants across parks, gardens, and street trees, blooming at different times throughout the year. This diversity gives bees a more consistent food supply than the single-crop fields common in agricultural regions, where pesticide use is also typically higher. Critics counter that concentrating too many hives in a small urban area can strain limited floral resources, leading colonies to compete with each other and with wild native pollinators. Despite this debate, most researchers agree that thoughtfully managed urban beekeeping can benefit both bee populations and city biodiversity.",
    prompt: "According to the passage, why might city bees have a more consistent food supply than rural bees?",
    choices: [
      "Cities have fewer pesticides used indoors",
      "Urban areas offer a wider variety of flowering plants blooming at different times",
      "Beekeepers feed city bees supplemental sugar water",
      "Rural bees migrate away in the winter",
    ],
    correctIndex: 1,
    explanation: "The passage states urban diversity of blooming plants gives a more consistent food supply than single-crop rural fields.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "inference",
    difficulty: 3,
    passage:
      "Urban beekeeping has grown rapidly in cities over the past decade, as residents install hives on rooftops and in community gardens. Proponents argue that city bees actually thrive better than their rural counterparts, since urban areas often provide a wider variety of flowering plants across parks, gardens, and street trees, blooming at different times throughout the year. This diversity gives bees a more consistent food supply than the single-crop fields common in agricultural regions, where pesticide use is also typically higher. Critics counter that concentrating too many hives in a small urban area can strain limited floral resources, leading colonies to compete with each other and with wild native pollinators. Despite this debate, most researchers agree that thoughtfully managed urban beekeeping can benefit both bee populations and city biodiversity.",
    prompt: "The passage suggests that critics of urban beekeeping are most concerned about:",
    choices: [
      "Bees stinging city residents",
      "Competition for limited floral resources among hives and native pollinators",
      "The cost of maintaining rooftop hives",
      "Honey production being lower in cities",
    ],
    correctIndex: 1,
    explanation: "The passage states critics worry about hives straining floral resources and competing with each other and native pollinators.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "vocab-in-context",
    difficulty: 2,
    passage:
      "Urban beekeeping has grown rapidly in cities over the past decade, as residents install hives on rooftops and in community gardens. Proponents argue that city bees actually thrive better than their rural counterparts, since urban areas often provide a wider variety of flowering plants across parks, gardens, and street trees, blooming at different times throughout the year. This diversity gives bees a more consistent food supply than the single-crop fields common in agricultural regions, where pesticide use is also typically higher. Critics counter that concentrating too many hives in a small urban area can strain limited floral resources, leading colonies to compete with each other and with wild native pollinators. Despite this debate, most researchers agree that thoughtfully managed urban beekeeping can benefit both bee populations and city biodiversity.",
    prompt: "As used in the passage, the word 'strain' most nearly means:",
    choices: ["Filter", "Put excessive pressure on", "Sing a musical note", "Improve significantly"],
    correctIndex: 1,
    explanation: "In context, 'strain limited floral resources' means to put excessive pressure/demand on those resources.",
    inDiagnostic: false,
  },

  // =========================================================================
  // Difficulty-4/5 additions (see rubric above). These skew the bank harder
  // and give the adaptive engine (recommendedDifficulty in lib/adaptive.ts)
  // real high-end questions to serve once a student's mastery climbs.
  // =========================================================================

  // ===================== ENGLISH: punctuation (harder) =====================
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 4,
    prompt:
      "Which version correctly punctuates a list whose items themselves contain commas: 'The committee included Dr. Alvarez, a cardiologist, Mr. Patel, a hospital administrator, and Ms. Doyle, a nurse practitioner.'",
    choices: [
      "The committee included Dr. Alvarez, a cardiologist, Mr. Patel, a hospital administrator, and Ms. Doyle, a nurse practitioner.",
      "The committee included Dr. Alvarez, a cardiologist; Mr. Patel, a hospital administrator; and Ms. Doyle, a nurse practitioner.",
      "The committee included: Dr. Alvarez, a cardiologist, Mr. Patel, a hospital administrator, and Ms. Doyle, a nurse practitioner.",
      "The committee included Dr. Alvarez a cardiologist, Mr. Patel a hospital administrator, and Ms. Doyle a nurse practitioner.",
    ],
    correctIndex: 1,
    explanation:
      "When list items already contain internal commas (each name plus its appositive), semicolons separate the items themselves to avoid ambiguity.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "punctuation",
    difficulty: 5,
    prompt:
      "Which choice provides the most effective punctuation: 'The results were unambiguous ___ every trial produced the same outcome.'",
    choices: [
      "unambiguous, every trial produced the same outcome.",
      "unambiguous: every trial produced the same outcome.",
      "unambiguous every trial produced the same outcome.",
      "unambiguous; and every trial produced the same outcome.",
    ],
    correctIndex: 1,
    explanation:
      "A colon correctly introduces an explanation/elaboration of the independent clause before it. A comma alone would create a splice, and 'unambiguous; and' incorrectly pairs a semicolon with a coordinating conjunction.",
    inDiagnostic: false,
  },

  // ===================== ENGLISH: sentence-structure (harder) =====================
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 4,
    prompt:
      "Which version maintains correct parallel structure: 'The internship taught her how to manage a budget, communicating with clients, and to lead a small team.'",
    choices: [
      "The internship taught her how to manage a budget, communicating with clients, and to lead a small team.",
      "The internship taught her how to manage a budget, how to communicate with clients, and how to lead a small team.",
      "The internship taught her managing a budget, communicating with clients, and to lead a small team.",
      "The internship taught her how to manage a budget, communicate with clients, and leading a small team.",
    ],
    correctIndex: 1,
    explanation:
      "All three items in the list must share the same grammatical form; repeating 'how to' before each verb keeps the list parallel.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "sentence-structure",
    difficulty: 5,
    prompt:
      "Which version is correct: 'Neither the coaches nor the team captain ___ satisfied with the referee's final call.'",
    choices: ["was", "were", "have been", "is being"],
    correctIndex: 0,
    explanation:
      "With 'neither...nor,' the verb agrees with the subject closer to it — the singular 'team captain' — so the singular verb 'was' is correct, even though 'coaches' is plural.",
    inDiagnostic: false,
  },

  // ===================== ENGLISH: redundancy (harder) =====================
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 4,
    prompt:
      "Which choice most effectively eliminates redundancy: 'The new policy, which was completely unprecedented and had never been tried before, surprised the entire staff.'",
    choices: [
      "which was completely unprecedented and had never been tried before,",
      "which was unprecedented and unusual,",
      "which was unprecedented,",
      "which nobody had ever seen or experienced before in any way,",
    ],
    correctIndex: 2,
    explanation:
      "'Unprecedented' already means 'never tried before,' so the added clause is fully redundant. The plainest option keeps only 'unprecedented.'",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "redundancy",
    difficulty: 5,
    prompt:
      "Given the sentence 'The museum's new wing, an architectural triumph, opened to widespread acclaim from critics and visitors alike this spring,' which choice for the underlined portion is best?",
    choices: [
      "NO CHANGE",
      "opened to widespread acclaim and praise from critics and visitors alike",
      "opened, receiving widespread acclaim, this spring, to critics and visitors",
      "opened this spring to acclaim, which was widespread, from critics and visitors",
    ],
    correctIndex: 0,
    explanation:
      "The original is already concise and non-redundant; every other option adds redundant wording ('acclaim and praise') or awkward, comma-heavy phrasing. On the real ACT, 'NO CHANGE' is correct on roughly a quarter of English questions — don't assume every underlined portion has an error.",
    inDiagnostic: false,
  },

  // ===================== ENGLISH: transitions (harder) =====================
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 4,
    prompt:
      "The lab's initial results were promising. ___, a second, larger trial failed to replicate them, so the researchers withdrew their claim.",
    choices: ["Consequently", "However", "Specifically", "Likewise"],
    correctIndex: 1,
    explanation:
      "The second trial contradicts (fails to replicate) the first result, so a contrast transition ('However') is needed, not a cause-effect or similarity one.",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "transitions",
    difficulty: 5,
    prompt:
      "Which choice best completes the logic: 'Solar output varies with cloud cover, time of day, and season; ___, a single day's reading says little about a panel's annual performance.'",
    choices: ["for example", "consequently", "in other words", "by contrast"],
    correctIndex: 1,
    explanation:
      "The second clause is a logical consequence of the variability described in the first, so 'consequently' (cause-and-effect) fits best — not a restatement ('in other words'), an example, or a contrast.",
    inDiagnostic: false,
  },

  // ===================== ENGLISH: word-choice (harder) =====================
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 4,
    prompt: "Which sentence uses the correct idiomatic preposition?",
    choices: [
      "Her approach to the problem was different than her colleague's.",
      "Her approach to the problem was different from her colleague's.",
      "Her approach to the problem was different of her colleague's.",
      "Her approach to the problem was differently than her colleague's.",
    ],
    correctIndex: 1,
    explanation:
      "Standard written English pairs 'different' with 'from,' not 'than' or 'of.'",
    inDiagnostic: true,
  },
  {
    section: "ENGLISH",
    subtopic: "word-choice",
    difficulty: 5,
    prompt:
      "Which word choice most precisely fits: 'The board's decision to cut funding was met with ___ from longtime employees who felt blindsided.'",
    choices: ["indifference", "consternation", "curiosity", "gratitude"],
    correctIndex: 1,
    explanation:
      "'Consternation' (anxious dismay) precisely matches 'felt blindsided,' unlike the other options, which contradict or don't fit the described reaction.",
    inDiagnostic: false,
  },

  // ===================== MATH: pre-algebra (harder) =====================
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 4,
    prompt:
      "A shirt's price is discounted 20%, then the sale price is discounted an additional 15%. What single percent discount off the original price does this represent?",
    choices: ["32%", "35%", "30%", "38%"],
    correctIndex: 0,
    explanation:
      "0.80 × 0.85 = 0.68 of the original price remains, which is a 32% total discount — not 35%, since the second discount applies to the already-reduced price.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "pre-algebra",
    difficulty: 5,
    prompt:
      "A class of 25 students has an average test score of 78. After one student's score is corrected upward by 20 points, what is the new class average?",
    choices: ["78.8", "79.2", "80", "78.2"],
    correctIndex: 0,
    explanation:
      "Original total = 25 × 78 = 1950. New total = 1950 + 20 = 1970. New average = 1970 / 25 = 78.8.",
    inDiagnostic: false,
  },

  // ===================== MATH: algebra (harder) =====================
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 4,
    prompt: "What are the solutions to 2x² − 5x − 3 = 0?",
    choices: ["x = 3, x = −1/2", "x = −3, x = 1/2", "x = 3, x = 1/2", "x = −3, x = −1/2"],
    correctIndex: 0,
    explanation:
      "Factoring: 2x² − 5x − 3 = (2x + 1)(x − 3) = 0, giving x = 3 or x = −1/2.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "algebra",
    difficulty: 5,
    prompt:
      "A boat travels 60 miles downstream in 3 hours and the same 60 miles upstream in 5 hours. What is the boat's speed in still water?",
    choices: ["16 mph", "20 mph", "12 mph", "18 mph"],
    correctIndex: 0,
    explanation:
      "Downstream speed = 60/3 = 20 mph = boat + current. Upstream speed = 60/5 = 12 mph = boat − current. Adding: 2·boat = 32, so boat = 16 mph.",
    inDiagnostic: false,
  },

  // ===================== MATH: geometry (harder) =====================
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 4,
    prompt:
      "Triangle ABC is similar to triangle DEF. If AB = 8, BC = 12, and DE = 6, what is EF?",
    choices: ["9", "8", "10", "16"],
    correctIndex: 0,
    explanation:
      "The similarity ratio is DE/AB = 6/8 = 3/4. So EF = BC × 3/4 = 12 × 3/4 = 9.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "geometry",
    difficulty: 5,
    prompt:
      "A chord subtends a central angle of 80° in a circle. What is the measure of the inscribed angle that subtends the same arc from the other side of the circle?",
    choices: ["40°", "80°", "160°", "50°"],
    correctIndex: 0,
    explanation:
      "The Inscribed Angle Theorem states an inscribed angle is half the central angle subtending the same arc: 80° / 2 = 40°.",
    inDiagnostic: false,
  },

  // ===================== MATH: trigonometry (harder) =====================
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 4,
    prompt: "What is the exact value of sin(120°)?",
    choices: ["√3/2", "1/2", "−√3/2", "√2/2"],
    correctIndex: 0,
    explanation:
      "120° is in the second quadrant (sine positive), and its reference angle is 60°, so sin(120°) = sin(60°) = √3/2.",
    inDiagnostic: true,
  },
  {
    section: "MATH",
    subtopic: "trigonometry",
    difficulty: 5,
    prompt: "If cos(θ) = 3/5 and θ is in the first quadrant, what is tan(θ)?",
    choices: ["4/3", "3/4", "5/4", "4/5"],
    correctIndex: 0,
    explanation:
      "With cos(θ) = 3/5, the adjacent/hypotenuse ratio gives a 3-4-5 triangle, so the opposite side is 4. tan(θ) = opposite/adjacent = 4/3.",
    inDiagnostic: false,
  },

  // ===================== READING (harder, new shared passage) =====================
  // A denser, argument-driven passage to push past simple main-idea recall.
  {
    section: "READING",
    subtopic: "main-idea",
    difficulty: 4,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "The passage is primarily concerned with:",
    choices: [
      "Proving that highway construction never benefits local economies",
      "Describing a shift in how some economists propose evaluating infrastructure's economic value, and the debate around it",
      "Explaining the engineering process behind building a highway",
      "Arguing that traffic congestion is the nation's most urgent problem",
    ],
    correctIndex: 1,
    explanation:
      "The passage traces a shift from capacity-based to connection-based evaluation of infrastructure and presents both the reasoning for it and critics' concerns — not a blanket claim that highways never help, nor an engineering explainer.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "detail",
    difficulty: 4,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "According to the passage, the cited study found that new highway capacity in mid-sized cities:",
    choices: [
      "Consistently boosted regional economic output",
      "Increased traffic volume but did not consistently increase economic output",
      "Had no effect on traffic volume of any kind",
      "Was rejected by every transportation agency that reviewed it",
    ],
    correctIndex: 1,
    explanation:
      "The passage explicitly states the study found reliably increased traffic volume without a consistent increase in regional economic output.",
    inDiagnostic: true,
  },
  {
    section: "READING",
    subtopic: "inference",
    difficulty: 5,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "It can reasonably be inferred that the critics mentioned in the passage would most likely support:",
    choices: [
      "Abandoning all infrastructure spending evaluation entirely",
      "Keeping capacity-based metrics like lane-miles and traffic counts as the primary standard, at least until connection-based measures are more reliable",
      "Immediately replacing all traffic-based metrics with connection-based ones",
      "Ending highway construction in mid-sized cities",
    ],
    correctIndex: 1,
    explanation:
      "The critics' stated worry is that 'economic connection' is harder to measure and that switching standards could stall needed projects — implying they'd favor keeping the more measurable, established metric unless the new one becomes reliable, not abandoning evaluation or the older metric outright.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "vocab-in-context",
    difficulty: 4,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "As used in the passage, 'reframing' most nearly means:",
    choices: [
      "Physically rebuilding a structure's frame",
      "Restating a decision in a more polite way",
      "Reconceiving how something is evaluated or understood",
      "Financially refinancing a project",
    ],
    correctIndex: 2,
    explanation:
      "'This reframing' refers back to proposing a new way to evaluate infrastructure's value — reconceiving the evaluation standard, not a literal or financial meaning.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "main-idea",
    difficulty: 5,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "Which choice best describes the passage's overall structure?",
    choices: [
      "It presents a single unchallenged theory with no counterargument",
      "It presents an emerging view, the reasoning behind it, and a substantive objection to it, without fully resolving the debate",
      "It narrates a chronological history of highway construction",
      "It refutes the emerging view entirely by the final sentence",
    ],
    correctIndex: 1,
    explanation:
      "The passage lays out the traditional view, the newer connection-based proposal and its rationale, and critics' objection — ending with agencies piloting the idea, not a full resolution either way.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "detail",
    difficulty: 3,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "According to the passage, what determines whether a new highway 'behaves very differently' from another, per the study's authors?",
    choices: [
      "The width and number of lanes it has",
      "What economic activity already exists nearby it",
      "How much it cost to build",
      "Whether it was built before or after 1990",
    ],
    correctIndex: 1,
    explanation:
      "The passage states the payoff 'depends heavily on what already exists nearby,' contrasting a highway linking two job centers with one built mainly to relieve congestion.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "inference",
    difficulty: 4,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "A highway built solely to relieve congestion between two areas with little existing economic activity would, according to the study's logic, most likely:",
    choices: [
      "Substantially boost regional economic output",
      "Increase traffic without a corresponding boost in regional economic output",
      "Have no effect on traffic at all",
      "Immediately be judged a success under any evaluation standard",
    ],
    correctIndex: 1,
    explanation:
      "The passage's example of a highway 'built primarily to relieve congestion' (rather than connecting thriving job centers) is exactly the kind the study found added traffic without reliably boosting output.",
    inDiagnostic: false,
  },
  {
    section: "READING",
    subtopic: "vocab-in-context",
    difficulty: 3,
    passage:
      "For much of the twentieth century, economists treated infrastructure spending largely as an engineering problem: build the bridge, pave the road, lay the transmission line, and economic activity would follow. Recent research complicates this picture. A widely cited study of highway expansions in mid-sized American cities found that new roads reliably increased traffic volume but did not consistently increase regional economic output; in several cases, the new capacity simply enabled longer commutes without adding jobs or production. The study's authors argue that infrastructure's economic payoff depends heavily on what already exists nearby — a new highway connecting two thriving job centers behaves very differently from one built primarily to relieve congestion. This has led some economists to propose evaluating infrastructure projects less by the physical capacity they add and more by the economic connections they create or strengthen. Critics of this reframing worry that 'economic connection' is far harder to measure than lane-miles or traffic counts, and that shifting the evaluation standard could stall projects that are genuinely needed but hard to justify under a stricter metric. Even so, several transportation agencies have begun piloting connection-based scoring for new proposals.",
    prompt: "As used in the passage, 'payoff' most nearly means:",
    choices: ["Bribe", "Benefit or return", "Final installment of a loan", "Explosion"],
    correctIndex: 1,
    explanation:
      "'Infrastructure's economic payoff' refers to the economic benefit or return it produces, not a bribe, loan payment, or explosion.",
    inDiagnostic: false,
  },

  // ===================== SCIENCE (harder) =====================
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 4,
    passage:
      "Researchers measured the growth rate of three bacterial strains (X, Y, Z) at five temperatures (10°C, 20°C, 30°C, 40°C, 50°C), reporting growth as doublings per hour. Strain X: 0.1, 0.4, 0.9, 0.6, 0.1. Strain Y: 0.3, 0.6, 0.8, 0.9, 0.7. Strain Z: 0.05, 0.1, 0.2, 0.5, 0.9.",
    prompt: "Based on the data, which strain shows a growth rate that increases across the entire tested temperature range (10°C-50°C) without ever decreasing?",
    choices: ["Strain X", "Strain Y", "Strain Z", "None of the strains"],
    correctIndex: 2,
    explanation:
      "Strain Z's values (0.05, 0.1, 0.2, 0.5, 0.9) increase at every step. Strains X and Y both peak and then decline before 50°C.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "data-representation",
    difficulty: 5,
    passage:
      "Researchers measured the growth rate of three bacterial strains (X, Y, Z) at five temperatures (10°C, 20°C, 30°C, 40°C, 50°C), reporting growth as doublings per hour. Strain X: 0.1, 0.4, 0.9, 0.6, 0.1. Strain Y: 0.3, 0.6, 0.8, 0.9, 0.7. Strain Z: 0.05, 0.1, 0.2, 0.5, 0.9.",
    prompt: "At approximately what temperature does Strain X reach its maximum growth rate?",
    choices: ["10°C", "20°C", "30°C", "50°C"],
    correctIndex: 2,
    explanation:
      "Strain X's values peak at 0.9 doublings/hour at 30°C, before declining at 40°C and 50°C.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 4,
    passage:
      "A researcher tested whether fertilizer type affects plant height. Study 1: Plants were given either fertilizer A or fertilizer B (20 plants each, same soil, light, and water) and height was measured after 4 weeks. Study 2: The same experiment was repeated, but half of each fertilizer group was also given a growth hormone supplement, creating four groups of 10 plants each.",
    prompt: "What is the main purpose of Study 2's added growth hormone variable compared to Study 1?",
    choices: [
      "To repeat Study 1 exactly for confirmation",
      "To test whether the effect of fertilizer type depends on whether a growth hormone is also present",
      "To eliminate the need for a control group",
      "To measure plant height using a different unit",
    ],
    correctIndex: 1,
    explanation:
      "By crossing fertilizer type with presence/absence of hormone, Study 2 is designed to reveal whether the two factors interact — not simply repeat Study 1 or change measurement units.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "research-summary",
    difficulty: 5,
    passage:
      "A researcher tested whether fertilizer type affects plant height. Study 1: Plants were given either fertilizer A or fertilizer B (20 plants each, same soil, light, and water) and height was measured after 4 weeks. Study 2: The same experiment was repeated, but half of each fertilizer group was also given a growth hormone supplement, creating four groups of 10 plants each.",
    prompt:
      "A critic argues that Study 2's results are less reliable than Study 1's for comparing fertilizer A and fertilizer B alone. Which observation best supports this critique?",
    choices: [
      "Study 2 used a shorter time period than Study 1",
      "Study 2 has only 10 plants per fertilizer-only comparison instead of 20, giving a smaller sample size for that comparison",
      "Study 2 did not use any fertilizer at all",
      "Study 2 measured a completely different variable than height",
    ],
    correctIndex: 1,
    explanation:
      "Splitting each 20-plant fertilizer group into two 10-plant hormone subgroups halves the sample size available for any single fertilizer-A-vs-B comparison, which is a legitimate reliability concern — the other options misstate the setup.",
    inDiagnostic: false,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 4,
    passage:
      "Two hypotheses attempt to explain a sudden, localized die-off of fish in a lake. Hypothesis 1 (Oxygen Depletion): An algae bloom, fueled by agricultural runoff, consumed dissolved oxygen faster than it could be replenished, suffocating fish. Hypothesis 2 (Toxic Contaminant): A pesticide spill upstream introduced a toxin directly lethal to fish, independent of oxygen levels.",
    prompt: "A water sample taken during the die-off showing normal dissolved oxygen levels but elevated pesticide concentration would:",
    choices: [
      "Support Hypothesis 1 and contradict Hypothesis 2",
      "Support Hypothesis 2 and contradict Hypothesis 1",
      "Support both hypotheses equally",
      "Be irrelevant to both hypotheses",
    ],
    correctIndex: 1,
    explanation:
      "Normal oxygen levels argue against oxygen depletion as the cause, while elevated pesticide concentration is exactly what Hypothesis 2 predicts.",
    inDiagnostic: true,
  },
  {
    section: "SCIENCE",
    subtopic: "conflicting-viewpoints",
    difficulty: 5,
    passage:
      "Two hypotheses attempt to explain a sudden, localized die-off of fish in a lake. Hypothesis 1 (Oxygen Depletion): An algae bloom, fueled by agricultural runoff, consumed dissolved oxygen faster than it could be replenished, suffocating fish. Hypothesis 2 (Toxic Contaminant): A pesticide spill upstream introduced a toxin directly lethal to fish, independent of oxygen levels.",
    prompt: "Both hypotheses would predict which of the following?",
    choices: [
      "The die-off is caused by a factor originating outside the lake itself with no local trigger",
      "Fish deaths are concentrated near where the causal agent (algae bloom or spill) is most concentrated, tapering off with distance",
      "The die-off should be permanent and unrelated to any single event",
      "Only species that breathe air would be affected",
    ],
    correctIndex: 1,
    explanation:
      "Both hypotheses describe a localized causal agent (an algae bloom or a spill) whose effect should be strongest near its source and weaker farther away — a shared, testable prediction, unlike the other options, which don't follow from either hypothesis.",
    inDiagnostic: false,
  },
];
