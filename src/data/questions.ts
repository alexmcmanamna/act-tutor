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
];
