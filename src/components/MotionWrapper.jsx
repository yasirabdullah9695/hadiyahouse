import React from "react";
import { motion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1];

export function FadeIn({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: PREMIUM_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: PREMIUM_EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}