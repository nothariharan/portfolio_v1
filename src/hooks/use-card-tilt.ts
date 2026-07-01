import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

// custom hook for that 3d holographic tilt on hover
export function useCardTilt() {
  // raw motion values from 0 to 1
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // transform normalized values into rotation degrees — kept gentle so the
  // card doesn't skew buttons out from under the cursor while interacting
  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);

  // add spring physics for smooth interpolation
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(rotateY, springConfig);
  const springY = useSpring(rotateX, springConfig);

  // update tilt based on cursor position relative to the element box
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
