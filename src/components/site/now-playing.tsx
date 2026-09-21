"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { retroSound, type MusicSnapshot } from "@/lib/sound";
import { SpriteBtn } from "@/components/site/hud-sprite-button";

const EMPTY: MusicSnapshot = {
  track: "off",
  title: "nothing playing",
  muted: false,
  playing: false,
  currentTime: 0,
  duration: 0,
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function EqCover({ playing }: { playing: boolean }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-end justify-center gap-[3px] overflow-hidden rounded-md border border-portfolio-border bg-portfolio-border/50 px-1.5 pb-1.5"
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`now-eq-bar w-[3px] rounded-full bg-portfolio-text/80 ${playing ? "" : "is-idle"}`}
          style={{ height: `${10 + (i % 3) * 5}px` }}
        />
      ))}
    </div>
  );
}

export function NowPlaying() {
  const reduce = useReducedMotion();
  const [snap, setSnap] = useState<MusicSnapshot>(EMPTY);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const sync = () => {
      const next = retroSound.snapshot();
      setSnap(next);
      setTime(next.currentTime);
      setDuration(next.duration);
    };
    sync();
    return retroSound.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!snap.playing) return;
    const id = window.setInterval(() => {
      setTime(retroSound.getCurrentTime());
      setDuration(retroSound.getDuration());
    }, 200);
    return () => window.clearInterval(id);
  }, [snap.playing, snap.track]);

  const idle = snap.track === "off";
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const subtitle = idle ? "tap change to start" : snap.muted ? "muted" : "chiptune loop";

  const skip = () => {
    retroSound.skipTrack();
  };

  const mute = () => {
    if (idle) {
      retroSound.skipTrack();
      return;
    }
    retroSound.toggleMute();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (idle || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    retroSound.seek(pct * duration);
    setTime(retroSound.getCurrentTime());
  };

  return (
    <>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed bottom-4 left-4 z-30 flex items-end gap-2 max-[720px]:bottom-3 max-[720px]:left-3"
      >
        <div className="pointer-events-auto flex min-w-0 items-center gap-3 rounded-lg border border-portfolio-border bg-portfolio-card/95 px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <EqCover playing={snap.playing} />
          <div className="min-w-0 w-[158px] max-[720px]:w-[132px]">
            <p
              className="truncate text-[13px] font-medium leading-tight text-portfolio-text"
              aria-live="polite"
            >
              {snap.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] text-portfolio-muted">{subtitle}</p>
            <div className="mt-2 flex items-center gap-2">
              <div
                role="slider"
                aria-label="track progress"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(time)}
                aria-disabled={idle}
                tabIndex={idle ? -1 : 0}
                onClick={seek}
                onKeyDown={(e) => {
                  if (idle || duration <= 0) return;
                  if (e.key === "ArrowRight") retroSound.seek(Math.min(duration, time + 5));
                  if (e.key === "ArrowLeft") retroSound.seek(Math.max(0, time - 5));
                }}
                className={`relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10 ${
                  idle ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-portfolio-text/85"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[9px] tabular-nums text-portfolio-muted/80">
                {formatTime(time)}
              </span>
            </div>
          </div>
        </div>

        <SpriteBtn
          src="/ui/btn-change-music.webp"
          label="change music"
          onClick={skip}
          width={256}
          height={256}
          className="pointer-events-auto w-[62px] max-[720px]:w-[52px]"
        />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: reduce ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 right-4 z-30 max-[720px]:bottom-3 max-[720px]:right-3"
      >
        <SpriteBtn
          src={snap.muted ? "/ui/btn-mute.webp" : "/ui/btn-unmute.webp"}
          label={idle ? "start music" : snap.muted ? "unmute music" : "mute music"}
          onClick={mute}
          width={256}
          height={256}
          className="w-[58px] max-[720px]:w-[50px]"
        />
      </motion.div>
    </>
  );
}
