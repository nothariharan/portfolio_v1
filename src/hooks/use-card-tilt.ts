import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

/**
 * Inner band stays flat. Tilt only ramps in the outer corners so hovering
 * name / stack / sprite doesn't wobble the whole card.
 * 0–DEAD on each axis is dead; the leftover outer band is the corner zone.
 */
const DEAD = 0.4;

function cornerAxis(n: number) {
  const a = Math.abs(n);
  if (a <= DEAD) return 0;
  return Math.sign(n) * ((a - DEAD) / (1 - DEAD));
}

// custom hook for 3d hover tilt effect
export function useCardTilt() {
  // raw values from 0 to 1 — 0.5 is flat / centered
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // corner press — milder than full-surface tracking
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-9, 9]);

  // slightly overdamped so it tracks the cursor without bounce or trail
  const springConfig = { damping: 28, stiffness: 260, mass: 0.3 };
  const springX = useSpring(rotateY, springConfig);
  const springY = useSpring(rotateX, springConfig);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    // measure the listener box, not a tilting child — otherwise the
    // foreshortened rect chases the cursor and the slant lags / jitters
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    const cx = cornerAxis(nx);
    const cy = cornerAxis(ny);

    // product of both axes: edges stay flat, only true corners slant
    x.set(0.5 + cx * Math.abs(cy) * 0.5);
    y.set(0.5 + cy * Math.abs(cx) * 0.5);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return {
    rotateX: springY,
    rotateY: springX,
    handleMouseMove,
    handleMouseLeave,
  };
}
