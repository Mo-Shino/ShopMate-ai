"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full relative flex flex-col overflow-hidden bg-bg-cream">
      {/* Top Right: Fathallah Logo */}
      <div className="absolute top-8 right-8 z-10 w-16 md:w-20">
        <Image
          src="/fathallah_logo.svg"
          alt="Fathallah Market"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Main Content: Center */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-8 w-full px-4">

        {/* Welcome Text - Scaled Down */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h2 className="font-fredoka font-bold text-2xl md:text-4xl text-primary-brown opacity-80">
            Welcome To
          </h2>
        </motion.div>

        {/* Container for Logo & Button Alignment */}
        {/* Scaled down container to fit screen perfectly */}
        <div className="w-[85%] max-w-[400px] md:max-w-[550px] lg:max-w-[650px] flex flex-col items-center gap-4">

          {/* ShopMate Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative w-full"
          >
            <Image
              src="/ShopMate_logo.svg"
              alt="Shop Mate AI"
              width={700}
              height={350}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Start Chat Button - Bot Mate Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Link
              href="/chat"
              className="group relative block w-full"
            >
              <div className="relative bg-[#E88D4B] text-white h-16 md:h-24 rounded-full flex items-center justify-between px-6 md:px-10 overflow-hidden shadow-[0_8px_0_#c46927,0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_0_0_#c46927,0_0_0_rgba(0,0,0,0)] active:translate-y-2 transition-all duration-150 transform hover:-translate-y-1">

                {/* Text */}
                <span className="font-fredoka font-bold text-3xl md:text-5xl drop-shadow-sm z-10">
                  Start Chat
                </span>

                {/* Right Icon: Animated Bot */}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full backdrop-blur-sm shadow-inner border border-white/10 group-hover:bg-white/30 transition-colors duration-300">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 3 }}
                    >
                      <Bot className="text-white w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </div>

                {/* Shine/Glass Effect Highlighting */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />

                {/* Subtle Tech Pattern Background (optional) */}
                <div className="absolute right-0 top-0 h-full w-32 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              </div>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary-brown/5 to-transparent pointer-events-none" />
    </div>
  );
}
