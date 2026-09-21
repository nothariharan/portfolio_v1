"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { retroSound, type MusicSnapshot } from "@/lib/sound";

const EMPTY: MusicSnapshot = {
  track: "off",
  title: "nothing playing",
  muted: false,
  playing: false,
  paused: true,
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
      className="relative flex h-12 w-12 shrink-0 items-end justify-center gap-[3px] overflow-hidden rounded-lg bg-gradient-to-b from-white/12 to-white/[0.03] px-2 pb-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`now-eq-bar w-[3px] rounded-full bg-white/85 ${playing ? "" : "is-idle"}`}
          style={{ height: `${8 + ((i * 3) % 11)}px` }}
        />
      ))}
    </div>
  );
}

function Hit({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-portfolio-muted transition-colors hover:text-portfolio-text active:scale-95 cursor-pointer"
    >
      {children}
    </button>
  );
}

export function NowPlaying() {
  const reduce = useReducedMotion();
  const [snap, setSnap] = useState<MusicSnapshot>(EMPTY);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const next = retroSound.snapshot();
      setSnap(next);
      if (!dragRef.current) {
        setTime(next.currentTime);
        setDuration(next.duration);
      }
    };
    sync();
    return retroSound.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!snap.playing) return;
    const id = window.setInterval(() => {
      if (dragRef.current) return;
      setTime(retroSound.getCurrentTime());
      setDuration(retroSound.getDuration());
    }, 200);
    return () => window.clearInterval(id);
  }, [snap.playing, snap.track]);

  const idle = snap.track === "off";
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const subtitle = idle ? "queue a loop" : snap.muted ? "muted" : "chiptune loop";

  const seekToClientX = useCallback(
    (clientX: number) => {
      const el = barRef.current;
      if (!el || duration <= 0 || idle) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const next = pct * duration;
      setTime(next);
      retroSound.seek(next);
    },
    [duration, idle],
  );

  const onBarPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (idle || duration <= 0) return;
    dragRef.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    seekToClientX(e.clientX);
  };

  const onBarPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    seekToClientX(e.clientX);
  };

  const onBarPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed bottom-4 left-4 z-30 max-[720px]:bottom-3 max-[720px]:left-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pointer-events-auto w-[280px] max-[720px]:w-[min(280px,calc(100vw-5.5rem))] rounded-2xl border border-portfolio-border bg-portfolio-card/95 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <EqCover playing={snap.playing} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight text-portfolio-text" aria-live="polite">
              {snap.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] text-portfolio-muted">{subtitle}</p>
          </div>
          <Hit label={snap.muted ? "unmute" : "mute"} onClick={() => retroSound.toggleMute()}>
            {snap.muted ? <VolumeX className="h-4 w-4" strokeWidth={1.75} /> : <Volume2 className="h-4 w-4" strokeWidth={1.75} />}
          </Hit>
        </div>

        <div
          ref={barRef}
          role="slider"
          aria-label="track progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-disabled={idle}
          tabIndex={idle ? -1 : 0}
          onPointerDown={onBarPointerDown}
          onPointerMove={onBarPointerMove}
          onPointerUp={onBarPointerUp}
          onPointerCancel={onBarPointerUp}
          onKeyDown={(e) => {
            if (idle || duration <= 0) return;
            if (e.key === "ArrowRight") retroSound.seek(Math.min(duration, time + 5));
            if (e.key === "ArrowLeft") retroSound.seek(Math.max(0, time - 5));
          }}
          className={`group relative mt-3 h-5 cursor-pointer ${idle ? "cursor-default" : ""}`}
        >
          <span className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/12" />
          <span
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white"
            style={{ width: `${progress * 100}%` }}
          />
          <span
            className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-opacity ${
              hover || dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        <div className="mt-1 flex items-center justify-between font-mono text-[9px] tabular-nums text-portfolio-muted/80">
          <span>{formatTime(time)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-1 flex items-center justify-center gap-2">
          <Hit label="previous track" onClick={() => retroSound.prevTrack()}>
            <SkipBack className="h-4 w-4" strokeWidth={1.75} fill="currentColor" />
          </Hit>
          <button
            type="button"
            aria-label={snap.playing ? "pause" : "play"}
            onClick={() => retroSound.togglePlay()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-portfolio-bg shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {snap.playing ? (
              <Pause className="h-[15px] w-[15px]" strokeWidth={2} fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-[15px] w-[15px]" strokeWidth={2} fill="currentColor" />
            )}
          </button>
          <Hit label="next track" onClick={() => retroSound.skipTrack()}>
            <SkipForward className="h-4 w-4" strokeWidth={1.75} fill="currentColor" />
          </Hit>
        </div>
      </div>
    </motion.div>
  );
}
