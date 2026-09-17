/**
 * 8-Bit Web Audio Sound Synthesizer + looping BGM
 *
 * SFX emulates classic GBA / Pokemon menu beeps with Web Audio
 * (square / pulse waveforms). BGM uses original chiptune loops in
 * /public/audio — not ripped from any game OST.
 */

export type MusicTrackId = "off" | "town" | "route" | "title";

const MUSIC_ORDER: MusicTrackId[] = ["off", "town", "route", "title"];

const MUSIC_SRC: Record<Exclude<MusicTrackId, "off">, string> = {
  town: "/audio/bgm-town.ogg",
  route: "/audio/bgm-route.ogg",
  title: "/audio/bgm-title.ogg",
};

const MUSIC_LABEL: Record<MusicTrackId, string> = {
  off: "OFF",
  town: "TOWN",
  route: "ROUTE",
  title: "TITLE",
};

const MUSIC_STORAGE_KEY = "trainer_card_music";
const SOUND_STORAGE_KEY = "trainer_card_sound";

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;
  private musicTrack: MusicTrackId = "off";
  private musicEl: HTMLAudioElement | null = null;
  private musicUnlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === "true";
      }
      const music = localStorage.getItem(MUSIC_STORAGE_KEY) as MusicTrackId | null;
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

  public getMusicTrack(): MusicTrackId {
    return this.musicTrack;
  }

  public getMusicLabel(): string {
    return MUSIC_LABEL[this.musicTrack];
  }

  /** SOUND plaque: OFF → TOWN → ROUTE → TITLE → OFF */
  public cycleMusic(): MusicTrackId {
    this.musicUnlocked = true;
    this.initContext();
    const idx = MUSIC_ORDER.indexOf(this.musicTrack);
    const next = MUSIC_ORDER[(idx + 1) % MUSIC_ORDER.length];
    this.setMusicTrack(next);
    if (next !== "off") {
      this.playSelect();
    } else {
      this.playBip("low");
    }
    return next;
  }

  public setMusicTrack(track: MusicTrackId) {
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
      // ducked under SFX — soft stage bed
      this.musicEl.volume = 0.22;
    }
    return this.musicEl;
  }

  private playMusic(track: Exclude<MusicTrackId, "off">) {
    const el = this.ensureMusicEl();
    if (!el) return;
    const src = MUSIC_SRC[track];
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
   * Pokemon Menu Confirm / Select (Classic A-button chirping beep)
   */
  public playSelect() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    // Quick two-step frequency jump (GBA menu tone)
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(880.0, t + 0.04); // A5

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  /**
   * Card Flip Whoosh (Retro ascending arpeggio sweep)
   */
  public playFlip() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(261.63, t); // C4
    osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.12); // G5

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  /**
   * Menu Hover / Cursor Navigation Tick (Subtle 8-bit blip)
   */
  public playCursor() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.015); // E6

    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  /**
   * Button / Color Cycle / Zoom Blip
   */
  public playBip(pitch: "high" | "low" = "high") {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(pitch === "high" ? 659.25 : 440.0, t); // E5 or A4

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.055);
  }

  /**
   * Badge / Achievement Sparkle Chime (GBA level-up / item sparkle)
   */
  public playSparkle() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
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
