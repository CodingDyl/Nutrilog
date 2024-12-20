"use client";
import React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../../lib/utils";
import { Calendar, History, Home } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = React.useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit mx-auto border border-transparent dark:border-emerald-700 rounded-full bg-emerald-600 dark:bg-emerald-700 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-10 pl-10 py-4 items-center justify-center space-x-8",
          className
        )}
      >
        {[
          { name: "Home", icon: <Home size={28} />, link: "/" },
          { name: "Calendar", icon: <Calendar size={28} />, link: "/calendar" },
          { name: "History", icon: <History size={28} />, link: "/history" },
        ].map((navItem, idx) => (
          <a
            key={`nav-item-${idx}`}
            href={navItem.link}
            className="relative text-white items-center flex space-x-1 hover:text-emerald-100"
          >
            {navItem.icon}
            <span className="sr-only">{navItem.name}</span>
          </a>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}; 