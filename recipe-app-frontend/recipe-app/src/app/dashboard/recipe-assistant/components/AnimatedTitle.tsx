import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedTitleProps {
  title: string;
  className?: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  title,
  className = "",
}) => {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedTitle("");
    let currentText = "";
    const interval = setInterval(() => {
      if (currentText.length < title.length) {
        currentText = title.slice(0, currentText.length + 1);
        setDisplayedTitle(currentText);
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [title]);

  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className} flex items-center`}
    >
      {displayedTitle}
      {isTyping && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block ml-1 w-[2px] h-[1em] bg-current"
        />
      )}
    </motion.h2>
  );
};
