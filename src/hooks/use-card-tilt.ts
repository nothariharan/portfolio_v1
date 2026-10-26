import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";
// tab starts back at top

// center stays calm; the sides lean so the card feels in your hand
function edgeRamp(n: number, dead: number) {
  const a = Math.abs(n);
  if (a <= dead) return 0;
  const t = (a - dead) / (1 - dead);
  return Math.sign(n) * t;
}

// custom hook for 3d hover tilt effect
export function useCardTilt() {
  // raw values from 0 to 1 — 0.5 is flat /centered
  const x =useMotionValue(0.5);
  const y= useMotionValue(0.5);

  // side lean, kept short so the card doesn't flop
  const rotateX =useTransform(y,[0, 1], [9, -9]);
  const rotateY= useTransform(x, [0, 1], [-13, 13]);

  // slightly overdamped so it tracks the cursor without bounce or trail
  const springConfig ={ damping: 28, stiffness: 260, mass: 0.3 };
  const springX= useSpring(rotateY, springConfig);
  const springY =useSpring(rotateX, springConfig);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    // measure the listener box, not a tilting child — otherwise the
    // foreshortened rect chases the cursor and the slant lags / jitters
    const rect= event.currentTarget.getBoundingClientRect();
    const nx =((event.clientX - rect.left) / rect.width) * 2 - 1;
   const ny= ((event.clientY - rect.top) / rect.height) * 2 - 1;

    const cx = edgeRamp(nx, 0.18);
    const cy = edgeRamp(ny, 0.28);

    // left and right edges tilt even through the middle of the card
    x.set(0.5 + cx * 0.5);
    y.set(0.5 + cy * (0.4 + 0.6 * Math.abs(cx)) * 0.5);
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
