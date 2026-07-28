let sharedContext: AudioContext | null = null;

/** Read from the Settings > Accessibility "sound effects" toggle (defaults to on). */
function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("act-tutor-sound-enabled") !== "false";
}

function getContext(): AudioContext | null {
  if (!soundEnabled()) return null;
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext) sharedContext = new Ctor();
  return sharedContext;
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, gainPeak: number, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** A short, pleasant two-note "ding" played on a correct practice answer. Synthesized (no audio asset needed). */
export function playCorrectSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 1046.5, now, 0.18, 0.15); // C6
  playTone(ctx, 1568.0, now + 0.09, 0.22, 0.15); // G6
}

/** A brief, low, gentle "womp" on a wrong answer — informative, not punishing. */
export function playWrongSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 311.1, now, 0.22, 0.1, "sine"); // Eb4
  playTone(ctx, 261.6, now + 0.1, 0.28, 0.1, "sine"); // C4
}

/** A short ascending flourish for finishing a practice set, diagnostic, or full-length test. */
export function playSetCompleteSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523.3, 659.3, 784.0, 1046.5].forEach((freq, i) => playTone(ctx, freq, now + i * 0.08, 0.3, 0.13));
}

/** A triumphant chime for leveling up or earning a badge. */
export function playCelebrationSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 784.0, now, 0.2, 0.15);
  playTone(ctx, 987.8, now + 0.1, 0.2, 0.15);
  playTone(ctx, 1318.5, now + 0.2, 0.4, 0.16);
}

/** A soft click for light UI feedback (used sparingly — big moments only). */
export function playClickSound() {
  const ctx = getContext();
  if (!ctx) return;
  playTone(ctx, 880, ctx.currentTime, 0.05, 0.06);
}
