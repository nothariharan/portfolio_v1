/**
 * 8-Bit Web Audio Sound Synthesizer + looping BGM pool
 *
 * SFX emulates classic GBA / Pokemon menu beeps with Web Audio
 * (square / pulse waveforms). BGM uses original loops in /public/audio —
 * not ripped game OSTs.
 */

export type MusicTrackId = "off" | (string & {});

export type MusicTrack = {
  id: string;
  label: string;
  src: string;
};

/** Expand this list when you drop original / licensed loops into /public/audio. */
export const MUSIC_POOL: MusicTrack[] = [
  { id: "town", label: "TOWN", src: "/audio/bgm-town.ogg" },
  { id: "route", label: "ROUTE", src: "/audio/bgm-route.ogg" },
  { id: "title", label: "TITLE", src: "/audio/bgm-title.ogg" },
];

const MUSIC_ORDER: string[] = ["off", ...MUSIC_POOL.map((t) => t.id)];

const MUSIC_SRC: Record<string, string> = Object.fromEntries(
  MUSIC_POOL.map((t) => [t.id, t.src]),
);

const MUSIC_LABEL: Record<string, string> = {
  off: "OFF",
  ...Object.fromEntries(MUSIC_POOL.map((t) => [t.id, t.label])),
};

const MUSIC_STORAGE_KEY = "trainer_card_music";
const SOUND_STORAGE_KEY = "trainer_card_sound";

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;
  private musicTrack: string = "off";
  private musicEl: HTMLAudioElement | null = null;
  private musicUnlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === "true";
      }
      const music = localStorage.getItem(MUSIC_STORAGE_KEY);
      if (music && MUSIC_ORDER.includes(music)) {
        this.musicTrack = music;
      }
    }
  }

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== "undefined") {
      localStorage.setItem(SOUND_STORAGE_KEY, val ? "true" : "false");
    }
    if (!val) {
      this.stopMusic();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playSelect();
    }
    return this.enabled;
  }

  public getMusicTrack(): string {
    return this.musicTrack;
  }

  public getMusicLabel(): string {
    return MUSIC_LABEL[this.musicTrack] ?? this.musicTrack.toUpperCase();
  }

  public getPoolSize(): number {
    return MUSIC_POOL.length;
  }

  /** MUSIC plaque: OFF → each pool track → OFF */
  public cycleMusic(): string {
    this.musicUnlocked = true;
    this.initContext();
    const idx = MUSIC_ORDER.indexOf(this.musicTrack);
    const next = MUSIC_ORDER[(Math.max(0, idx) + 1) % MUSIC_ORDER.length];
    this.setMusicTrack(next);
    if (next !== "off") {
      this.playSelect();
    } else {
      this.playBip("low");
    }
    return next;
  }

  public setMusicTrack(track: string) {
    this.musicTrack = track;
    if (typeof window !== "undefined") {
      localStorage.setItem(MUSIC_STORAGE_KEY, track);
    }
    if (track === "off") {
      this.enabled = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(SOUND_STORAGE_KEY, "false");
      }
      this.stopMusic();
      return;
    }
    this.enabled = true;
    if (typeof window !== "undefined") {
      localStorage.setItem(SOUND_STORAGE_KEY, "true");
    }
    this.playMusic(track);
  }

  private ensureMusicEl() {
    if (typeof window === "undefined") return null;
    if (!this.musicEl) {
      this.musicEl = new Audio();
      this.musicEl.loop = true;
      this.musicEl.preload = "auto";
      this.musicEl.volume = 0.22;
    }
    return this.musicEl;
  }

  private playMusic(track: string) {
    const el = this.ensureMusicEl();
    if (!el) return;
    const src = MUSIC_SRC[track];
    if (!src) return;
    if (!el.src.endsWith(src)) {
      el.src = src;
    }
    void el.play().catch(() => {
      /* autoplay blocked until another gesture — next cycle will retry */
    });
  }

  private stopMusic() {
    if (!this.musicEl) return;
    this.musicEl.pause();
    this.musicEl.currentTime = 0;
  }

  /** Resume remembered track after first user gesture (autoplay policy). */
  public unlockAudio() {
    if (this.musicUnlocked) return;
    this.musicUnlocked = true;
    this.initContext();
    if (this.musicTrack !== "off" && this.enabled) {
      this.playMusic(this.musicTrack);
    }
  }

  /**
   * Short original character fanfare when tapping the trainer portrait.
   * (Not a Nintendo sample — just a playful chiptune “hey it’s me” sting.)
   */
  public playCharacterFanfare() {
    this.musicUnlocked = true;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    // briefly enable SFX path even if BGM is off
    const wasEnabled = this.enabled;
    this.enabled = true;

    const t = ctx.currentTime;
    // jaunty rising “hello” arpeggio + sparkle
    const melody = [
      { f: 523.25, at: 0, dur: 0.09 }, // C5
      { f: 659.25, at: 0.08, dur: 0.09 }, // E5
      { f: 783.99, at: 0.16, dur: 0.09 }, // G5
      { f: 1046.5, at: 0.26, dur: 0.18 }, // C6
      { f: 1318.51, at: 0.4, dur: 0.12 }, // E6
    ];
    melody.forEach(({ f, at, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f, t + at);
      gain.gain.setValueAtTime(0.055, t + at);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + at);
      osc.stop(t + at + dur + 0.02);
    });

    // tiny triangle sparkle after the peak
    const sparkle = [1567.98, 2093.0];
    sparkle.forEach((freq, i) => {
      const start = t + 0.48 + i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.035, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.11);
    });

    this.enabled = wasEnabled;
  }

  public playSelect() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(587.33, t);
    osc.frequency.setValueAtTime(880.0, t + 0.04);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playFlip() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(261.63, t);
    osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.12);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  public playCursor() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.setValueAtTime(1318.51, t + 0.015);

    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  public playBip(pitch: "high" | "low" = "high") {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(pitch === "high" ? 659.25 : 440.0, t);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.055);
  }

  public playSparkle() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const notes = [1046.5, 1318.51, 1567.98, 2093.0];
    notes.forEach((freq, idx) => {
      const start = t + idx * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.04, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(start);
      osc.stop(start + 0.09);
    });
  }
}

export const retroSound = new RetroAudioEngine();
