import React from "react";
import { motion } from "framer-motion";
import contactBg from "../../assets/images/contact.png";

export default function ContactHero() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center">

      {/* Background Image */}
      <img
        src={contactBg}
        alt="Contact Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Optional white overlay for better readability */}
      <div className="absolute inset-0 bg-white/10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-[6px] text-blue-600 font-semibold"
        >
          WE'RE HERE TO HELP
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-6xl  text-slate-900 mt-4"
        >
          Get in Touch With Us
        </motion.h1>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3 mt-8"
        >
          <div className="w-20 h-[3px] bg-blue-600 rounded-full"></div>

          <div className="w-4 h-4 rounded-full bg-blue-600"></div>

          <div className="w-20 h-[3px] bg-blue-600 rounded-full"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-lg md:text-xl text-slate-700 leading-9 max-w-3xl mx-auto"
        >
          Whether you're searching for your dream home, planning your next
          investment, or have questions about any property, our team is here to
          help.
          <br />
          Send us a message and we'll get back to you as soon as possible.
        </motion.p>

      </div>

    </section>
  );
}