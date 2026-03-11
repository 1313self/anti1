"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const words = "ERACONNECT".split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Intro lasts for 4.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.4 * i },
    }),
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={container}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Cinematic Background Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0.05] }}
            transition={{ duration: 4, times: [0, 0.5, 1] }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"
          />
          
          <div className="relative flex flex-col items-center">
            <motion.div
              variants={container}
              className="flex overflow-hidden"
            >
              {words.map((word, index) => (
                <motion.span
                  variants={child}
                  key={index}
                  className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ delay: 2, duration: 2 }}
              className="mt-4 text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] opacity-80"
            >
              The Next Evolution of Networking
            </motion.div>

            {/* Light streak effect */}
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
