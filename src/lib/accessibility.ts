/**
 * Accessibility accommodation preferences, ported from
 * github.com/Hvcvvbjj/act-tutor--Prelim-My-Version's Settings tab (its
 * `AccommodationPreferences` type + toggle list). Stored client-side
 * (localStorage) and applied via `data-a11y-*` attributes on <html>, matched
 * by CSS rules in globals.css — same technique the reference fork uses via
 * its `data-scout-*` attributes, renamed to this app's own convention.
 */
export interface AccommodationPreferences {
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  keyboardOnly: boolean;
  readAloud: boolean;
  simplified: boolean;
  extendedTime: boolean;
  distractionReduced: boolean;
}

export const DEFAULT_ACCOMMODATIONS: AccommodationPreferences = {
  reducedMotion: false,
  largeText: false,
  highContrast: false,
  keyboardOnly: false,
  readAloud: false,
  simplified: false,
  extendedTime: false,
  distractionReduced: false,
};

export const ACCOMMODATION_OPTIONS: ReadonlyArray<[keyof AccommodationPreferences, string, string]> = [
  ["reducedMotion", "Reduced motion", "Stops nonessential animation and page-transition movement."],
  ["largeText", "Larger text", "Makes the whole study view easier to read."],
  ["highContrast", "Increased contrast", "Strengthens borders and color contrast."],
  ["keyboardOnly", "Keyboard navigation", "Makes keyboard focus extra visible."],
  ["readAloud", "Read aloud", "Adds a speaker button to read Mr. Kim's messages aloud."],
  ["simplified", "Simpler explanations", "Asks Mr. Kim to keep explanations shorter and plainer."],
  ["extendedTime", "Extended time on timed practice", "Uses a 1.5× time allowance on countdown timers."],
  ["distractionReduced", "Distraction-reduced layout", "Hides secondary chips and panels outside the core task."],
];

const STORAGE_KEY = "act-tutor-accommodations";

export function readAccommodations(): AccommodationPreferences {
  if (typeof window === "undefined") return DEFAULT_ACCOMMODATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACCOMMODATIONS;
    return { ...DEFAULT_ACCOMMODATIONS, ...(JSON.parse(raw) as Partial<AccommodationPreferences>) };
  } catch {
    return DEFAULT_ACCOMMODATIONS;
  }
}

export function writeAccommodations(prefs: AccommodationPreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/** Applies the current preferences to <html> as data attributes for CSS in globals.css to key off of. */
export function applyAccommodations(prefs: AccommodationPreferences) {
  const root = document.documentElement;
  root.dataset.a11yMotion = prefs.reducedMotion ? "reduced" : "full";
  root.dataset.a11yText = prefs.largeText ? "large" : "default";
  root.dataset.a11yContrast = prefs.highContrast ? "high" : "default";
  root.dataset.a11yKeyboard = prefs.keyboardOnly ? "strong" : "default";
  root.dataset.a11yDistraction = prefs.distractionReduced ? "reduced" : "default";
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
