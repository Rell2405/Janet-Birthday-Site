/**
 * Self-contained cabin audio: the classic two-tone boarding chime synthesized
 * with the Web Audio API, followed by a captain announcement via the browser's
 * SpeechSynthesis engine. No external/copyrighted audio files required.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** Play a single soft "bong" tone at the given frequency and start time. */
function tone(
  audio: AudioContext,
  freq: number,
  startAt: number,
  duration = 1.6
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.value = freq;

  filter.type = "lowpass";
  filter.frequency.value = 2600;

  // Bell-like envelope
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.35, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/** The iconic dual "ding-dong" cabin chime (high tone then low tone). */
export async function playBoardingChime(): Promise<void> {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    try {
      await audio.resume();
    } catch {
      /* ignore */
    }
  }
  const now = audio.currentTime + 0.05;
  tone(audio, 660, now); // high (E5)
  tone(audio, 523.25, now + 0.55); // low (C5)
}

/** Captain announcement. Plays a pre-rendered natural (neural TTS) voice file
 * so every visitor hears the same human-sounding captain regardless of the
 * voices their browser/OS happens to expose. Falls back to SpeechSynthesis
 * only if the audio file can't be played. */
export function playCaptainAnnouncement(): void {
  if (typeof window === "undefined") return;

  const base = import.meta.env.BASE_URL || "/";
  const src = `${base.replace(/\/$/, "")}/audio/captain.m4a`;

  try {
    const audio = new Audio(src);
    audio.volume = 1;
    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => speakFallback());
    }
  } catch {
    speakFallback();
  }
}

/** Last-resort browser speech if the audio file fails (e.g. blocked/offline). */
function speakFallback(): void {
  if (!("speechSynthesis" in window)) return;

  const speak = () => {
    const msg = new SpeechSynthesisUtterance(
      "Ladies and gentlemen, this is your captain speaking. Welcome aboard. Cabin crew, please prepare for takeoff."
    );
    msg.rate = 0.98;
    msg.pitch = 1;
    msg.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const byName = (re: RegExp) => voices.find((v) => re.test(v.name));
    const preferred =
      byName(/natural|neural|enhanced|premium/i) ||
      byName(/google us english/i) ||
      byName(/samantha|aaron|arthur|matthew|guy|ryan|tom/i) ||
      byName(/daniel|alex/i) ||
      voices.find((v) => v.lang?.toLowerCase() === "en-us") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (preferred) msg.voice = preferred;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", speak, {
      once: true,
    });
    setTimeout(speak, 350);
  } else {
    speak();
  }
}

/** Chime, then the captain announcement shortly after. */
export async function playTakeoffSequence(): Promise<void> {
  await playBoardingChime();
  setTimeout(playCaptainAnnouncement, 1400);
}
