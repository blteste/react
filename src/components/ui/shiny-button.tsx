"use client";

import React, { useState } from "react";
import {
  motion,
  type AnimationProps,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

interface BtnCusProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  textSize?: string;
  textColor?: string;
  buttonWidth?: string;
  buttonHeight?: string;
}

const BtnCus = React.forwardRef<HTMLButtonElement, BtnCusProps>(
  ({ 
    children, 
    className, 
    textSize = "text-[20px]", 
    textColor = "text-white", 
    buttonWidth = "w-[150px]", 
    buttonHeight = "h-[50px]", 
    ...props 
  }, ref) => {
    const [isAnimating, setIsAnimating] = useState(true);

    const handleAnimationComplete = () => {
      setIsAnimating(false);
    };

    return (
      <motion.button
        ref={ref}
        {...animationProps}
        {...props}
        disabled={isAnimating}
        onAnimationComplete={handleAnimationComplete}
        className={cn(
          `relative flex items-center justify-center rounded-[18px] ${buttonWidth} ${buttonHeight} font-medium bg-[#0022FF] backdrop-blur-xl border-2 border-[#0022FF] transition-all duration-300 ease-in-out`,
          className
        )}
        whileHover={{
          scale: 1.2,
          y: -12,
          boxShadow: "0 0 40px 12px rgba(0, 34, 255, 0.8)",
          pointerEvents: isAnimating ? "none" : "auto",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.2,
        }}
      >
        <span
          className={cn(
            `${textSize} ${textColor} font-semibold uppercase tracking-wide`
          )}
        >
          {children}
        </span>
      </motion.button>
    );
  }
);

BtnCus.displayName = "BtnCus";

export default BtnCus;
