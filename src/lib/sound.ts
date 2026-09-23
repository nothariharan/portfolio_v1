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

/** Looping BGM only. Wipe uses a synthesized whoosh, not a music sting. */
export const MUSIC_POOL: MusicTrack[] = [
  { id: "theme-2", label: "THEME 2", src: "/audio/theme-2.mp3" },
  { id: "theme-3", label: "THEME 3", src: "/audio/theme-3.mp3" },
  { id: "theme-5", label: "THEME 5", src: "/audio/theme-5.mp3" },
  { id: "theme-6", label: "THEME 6", src: "/audio/theme-6.mp3" },
  { id: "theme-7", label: "THEME 7", src: "/audio/theme-7.mp3" },
  { id: "theme-8", label: "THEME 8", src: "/audio/theme-8.mp3" },
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
const MUTE_STORAGE_KEY = "trainer_card_muted";

export type MusicSnapshot = {
  track: string;
  title: string;
  muted: boolean;
  playing: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
};

type MusicElHost = Window & {
  __hariRetroMusicEl?: HTMLAudioElement;
  __hariRetroMusicBound?: boolean;
  __hariRetroMusicEngine?: RetroAudioEngine;
};

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;
  private musicTrack: string = "off";
  private musicEl: HTMLAudioElement | null = null;
  private musicUnlocked = false;
  private muted = false;
  private ignoreEnded = false;
  private loadGen = 0;
  private noiseBuf: AudioBuffer | null = null;
  private musicListeners: Set<(track: string) => void> = new Set();
  private listeners = new Set<() => void>();

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
      this.muted = localStorage.getItem(MUTE_STORAGE_KEY) === "true";
      this.adoptSharedMusicEl();
      (window as MusicElHost).__hariRetroMusicEngine = this;
    }
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        /* no-op */
      }
    });
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
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
    this.notify();
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
    return MUSIC_LABEL[this.musicTrack] ?? this.musicTrack.replace("-", " ").toUpperCase();
  }

  public getDisplayTitle(): string {
    if (this.musicTrack === "off") return "nothing playing";
    return this.getMusicLabel().toLowerCase();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public snapshot(): MusicSnapshot {
    const el = this.musicEl;
    const duration = el && Number.isFinite(el.duration) ? el.duration : 0;
    const elPlaying = !!el && !el.paused && !el.ended && el.src !== "";
    return {
      track: this.musicTrack,
      title: this.getDisplayTitle(),
      muted: this.muted,
      paused: !elPlaying,
      playing: elPlaying,
      currentTime: el?.currentTime ?? 0,
      duration,
    };
  }

  public getCurrentTime(): number {
    return this.musicEl?.currentTime ?? 0;
  }

  public getDuration(): number {
    const d = this.musicEl?.duration;
    return d && Number.isFinite(d) ? d : 0;
  }

  public seek(seconds: number) {
    const el = this.musicEl;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    el.currentTime = Math.max(0, Math.min(seconds, el.duration));
    this.notify();
  }

  public setMuted(val: boolean) {
    this.muted = val;
    if (typeof window !== "undefined") {
      localStorage.setItem(MUTE_STORAGE_KEY, val ? "true" : "false");
    }
    const el = this.ensureMusicEl();
    if (el) el.volume = val ? 0 : 0.22;
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.playSelect();
    } else {
      this.playBip("low");
    }
    return this.muted;
  }

  /** Pause / resume. From OFF, starts the first pool track. */
  public togglePlay(): boolean {
    this.musicUnlocked = true;
    this.initContext();
    if (this.musicTrack === "off") {
      this.skipTrack();
      return true;
    }
    const el = this.ensureMusicEl();
    if (!el) return false;
    if (el.paused) {
      const src = MUSIC_SRC[this.musicTrack];
      if (src && this.currentSrcPath(el) !== src) {
        this.playMusic(this.musicTrack);
      } else {
        el.volume = this.muted ? 0 : 0.22;
        void el.play().catch(() => {
          /* autoplay blocked until another gesture */
        });
      }
      this.playSelect();
      this.notify();
      return true;
    }
    this.pauseMusic();
    this.playBip("low");
    this.notify();
    return false;
  }

  /** Next pool track, never OFF. First tap from OFF starts the first loop. */
  public skipTrack(): string {
    this.musicUnlocked = true;
    this.initContext();
    const wasOff = this.musicTrack === "off";
    const pool = MUSIC_POOL.map((t) => t.id);
    const idx = pool.indexOf(this.musicTrack);
    const next = pool[(idx + 1) % pool.length] ?? pool[0];
    this.setMusicTrack(next, { keepMute: !wasOff && this.muted });
    if (!this.muted) {
      this.playSelect();
    }
    return next;
  }

  /** Restart if past 3s, else previous pool track. */
  public prevTrack(): string {
    this.musicUnlocked = true;
    this.initContext();
    const el = this.musicEl;
    if (this.musicTrack !== "off" && el && el.currentTime > 3) {
      el.currentTime = 0;
      this.notify();
      this.playBip("low");
      return this.musicTrack;
    }
    const wasOff = this.musicTrack === "off";
    const pool = MUSIC_POOL.map((t) => t.id);
    const idx = pool.indexOf(this.musicTrack);
    const prev = idx <= 0 ? pool[pool.length - 1] : pool[idx - 1];
    this.setMusicTrack(prev ?? pool[0], { keepMute: !wasOff && this.muted });
    if (!this.muted) {
      this.playSelect();
    }
    return this.musicTrack;
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

  public subscribeMusicTrack(listener: (track: string) => void): () => void {
    this.musicListeners.add(listener);
    return () => {
      this.musicListeners.delete(listener);
    };
  }

  private notifyMusicTrack(track: string) {
    this.musicListeners.forEach((fn) => {
      try {
        fn(track);
      } catch {
        /* no-op */
      }
    });
  }

  /** Automatically advance to the next track in the pool when one track ends */
  private advanceNextTrack() {
    if (this.ignoreEnded) return;
    if (this.musicTrack === "off" || !this.enabled) return;
    const poolIds = MUSIC_POOL.map((t) => t.id);
    if (poolIds.length === 0) return;
    const currIdx = poolIds.indexOf(this.musicTrack);
    const nextIdx = currIdx >= 0 ? (currIdx + 1) % poolIds.length : 0;
    const nextTrack = poolIds[nextIdx];
    this.setMusicTrack(nextTrack, { keepMute: this.muted });
  }

  public setMusicTrack(track: string, opts?: { keepMute?: boolean }) {
    this.musicTrack = track;
    if (typeof window !== "undefined") {
      localStorage.setItem(MUSIC_STORAGE_KEY, track);
    }
    this.notifyMusicTrack(track);
    if (track === "off") {
      this.enabled = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(SOUND_STORAGE_KEY, "false");
      }
      this.stopMusic();
      this.notify();
      return;
    }
    this.enabled = true;
    if (typeof window !== "undefined") {
      localStorage.setItem(SOUND_STORAGE_KEY, "true");
    }
    if (!opts?.keepMute && this.muted) {
      this.muted = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(MUTE_STORAGE_KEY, "false");
      }
    }
    this.playMusic(track);
    this.notify();
  }

  /** Keep one HTMLAudioElement across HMR so a leftover loop isn't "playing" while the new engine says OFF. */
  private adoptSharedMusicEl() {
    if (typeof window === "undefined") return;
    const host = window as MusicElHost;
    const el = host.__hariRetroMusicEl;
    if (!el) return;
    this.musicEl = el;
    this.bindMusicEl(el);
    if (el.paused || !el.src) return;
    const path = this.currentSrcPath(el);
    const found = MUSIC_POOL.find((t) => path === t.src || path.endsWith(t.src));
    if (found) {
      this.musicTrack = found.id;
      this.enabled = true;
    }
  }

  private bindMusicEl(el: HTMLAudioElement) {
    const host = window as MusicElHost;
    host.__hariRetroMusicEngine = this;
    if (host.__hariRetroMusicBound) return;
    host.__hariRetroMusicBound = true;
    el.addEventListener("ended", () => host.__hariRetroMusicEngine?.advanceNextTrack());
    el.addEventListener("play", () => host.__hariRetroMusicEngine?.notify());
    el.addEventListener("pause", () => host.__hariRetroMusicEngine?.notify());
    el.addEventListener("loadedmetadata", () => host.__hariRetroMusicEngine?.notify());
  }

  private ensureMusicEl() {
    if (typeof window === "undefined") return null;
    const host = window as MusicElHost;
    if (!this.musicEl) {
      this.musicEl = host.__hariRetroMusicEl ?? new Audio();
      host.__hariRetroMusicEl = this.musicEl;
      this.musicEl.loop = false;
      this.musicEl.preload = "auto";
      this.musicEl.volume = this.muted ? 0 : 0.22;
      this.bindMusicEl(this.musicEl);
    } else {
      host.__hariRetroMusicEngine = this;
    }
    return this.musicEl;
  }

  private currentSrcPath(el: HTMLAudioElement): string {
    try {
      return new URL(el.src, window.location.href).pathname;
    } catch {
      return el.src;
    }
  }

  private playMusic(track: string) {
    const el = this.ensureMusicEl();
    if (!el) return;
    const src = MUSIC_SRC[track];
    if (!src) return;

    const gen = ++this.loadGen;
    this.ignoreEnded = true;

    const start = () => {
      if (gen !== this.loadGen) return;
      this.ignoreEnded = false;
      if (this.musicTrack !== track) return;
      el.volume = this.muted ? 0 : 0.22;
      void el.play().catch(() => {
        /* autoplay blocked until another gesture — next cycle will retry */
      });
    };

    if (this.currentSrcPath(el) !== src) {
      el.src = src;
      el.addEventListener("canplay", start, { once: true });
      el.load();
      return;
    }

    try {
      el.currentTime = 0;
    } catch {
      /* ignore */
    }
    start();
  }

  private noiseBuffer(ctx: AudioContext) {
    if (this.noiseBuf && this.noiseBuf.sampleRate === ctx.sampleRate) return this.noiseBuf;
    const length = Math.floor(ctx.sampleRate * 0.9);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let pink = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      pink = Math.max(-1, Math.min(1, pink * 0.86 + white * 0.14));
      data[i] = white * 0.55 + pink * 0.45;
    }
    this.noiseBuf = buffer;
    return buffer;
  }

  /** Airy whoosh for the trainer-card ↔ /portfolio wipe. Not a music sting. */
  public playWipeWhoosh(dir: "expand" | "collapse" = "expand") {
    if (typeof window === "undefined") return;
    this.musicUnlocked = true;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const dur = dir === "expand" ? 0.62 : 0.5;
    const expand = dir === "expand";

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(0.85, t);
    if (expand) {
      filter.frequency.setValueAtTime(420, t);
      filter.frequency.exponentialRampToValueAtTime(3800, t + 0.18);
      filter.frequency.exponentialRampToValueAtTime(900, t + dur);
    } else {
      filter.frequency.setValueAtTime(3200, t);
      filter.frequency.exponentialRampToValueAtTime(240, t + dur);
    }

    const air = ctx.createGain();
    air.gain.setValueAtTime(0.0001, t);
    air.gain.exponentialRampToValueAtTime(expand ? 0.28 : 0.22, t + 0.045);
    air.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(air);
    air.connect(ctx.destination);

    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "sine";
    if (expand) {
      body.frequency.setValueAtTime(168, t);
      body.frequency.exponentialRampToValueAtTime(52, t + dur);
    } else {
      body.frequency.setValueAtTime(70, t);
      body.frequency.exponentialRampToValueAtTime(150, t + dur * 0.85);
    }
    bodyGain.gain.setValueAtTime(0.0001, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.07, t + 0.03);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    body.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + dur + 0.02);
    body.start(t);
    body.stop(t + dur + 0.02);

    const bg = this.musicEl;
    if (bg && !bg.paused && !this.muted) {
      const prev = bg.volume;
      bg.volume = Math.min(prev, 0.06);
      window.setTimeout(() => {
        if (bg) bg.volume = this.muted ? 0 : prev;
      }, Math.round(dur * 1000) + 40);
    }
  }

  private pauseMusic() {
    this.musicEl?.pause();
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
    if (this.musicTrack !== "off" && this.enabled && !this.muted) {
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

  /** Short pew when a boot-fight laser fires. Plays even if BGM is off. */
  public playLaser() {
    this.musicUnlocked = true;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1680, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.11);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1800, t);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.045, t);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.07);
  }

  /** SUCCESS sting — rising arpeggio + sparkle. Plays even if BGM is off. */
  public playWin() {
    this.musicUnlocked = true;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const melody = [
      { f: 523.25, at: 0, dur: 0.1 },
      { f: 659.25, at: 0.08, dur: 0.1 },
      { f: 783.99, at: 0.16, dur: 0.1 },
      { f: 1046.5, at: 0.26, dur: 0.22 },
      { f: 1318.51, at: 0.42, dur: 0.16 },
      { f: 1567.98, at: 0.54, dur: 0.2 },
    ];
    melody.forEach(({ f, at, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f, t + at);
      gain.gain.setValueAtTime(0.06, t + at);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + at);
      osc.stop(t + at + dur + 0.02);
    });

    const sparkle = [1760, 2093, 2637];
    sparkle.forEach((freq, i) => {
      const start = t + 0.62 + i * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.04, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.13);
    });
  }
}

export const retroSound = new RetroAudioEngine();
