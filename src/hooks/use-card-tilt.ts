import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

// custom hook for 3d hover tilt effect
export function useCardTilt() {
  // raw values from 0 to 1
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // gentle tilt — steeper rotateX foreshortens the top edge until the frame looks gone
  const rotateX = useTransform(y, [0, 1], [4, -4]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

  // spring physics for smooth tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(rotateY, springConfig);
  const springY = useSpring(rotateX, springConfig);

  // update tilt based on cursor coordinates
  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  // snap back to center when cursor leaves
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
