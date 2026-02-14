"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdsStore } from "@/stores/useAdsStore";
import { motion, AnimatePresence } from "framer-motion";

// Hardcoded ads for prototype based on what's available
const adsImages = [
    "/ads/6.png",
    "/ads/7.png",
    "/ads/8.png",
    "/ads/9.png",
];

export default function IdleManager() {
    const { isIdle, setIdle } = useAdsStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    const resetTimer = useCallback(() => {
        if (isIdle) {
            setIdle(false);
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIdle(true);
        }, 30000); // 30 seconds
    }, [isIdle, setIdle]);

    useEffect(() => {
        // Events to track activity
        const onActivity = () => resetTimer();

        window.addEventListener("mousemove", onActivity);
        window.addEventListener("touchstart", onActivity);
        window.addEventListener("keydown", onActivity);
        window.addEventListener("click", onActivity);

        resetTimer(); // Start timer

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            window.removeEventListener("mousemove", onActivity);
            window.removeEventListener("touchstart", onActivity);
            window.removeEventListener("keydown", onActivity);
            window.removeEventListener("click", onActivity);
        };
    }, [resetTimer]);

    // Ads Carousel Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isIdle) {
            interval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % adsImages.length);
            }, 5000); // Change ad every 5s
        }
        return () => clearInterval(interval);
    }, [isIdle]);

    // Dynamic file list loading is hard in client-side without API, so we rely on hardcoded list or passed props.
    // I will update the adsImages array in a separate step or just assume names if standard.
    // For now, using placeholders effectively.

    return (
        <AnimatePresence>
            {isIdle && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black cursor-none"
                    onClick={() => setIdle(false)} // Dismiss on click
                >
                    {/* Carousel */}
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentAdIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                {/* Check if images exist, otherwise show placeholder */}
                                {/* We will assume valid paths for now */}
                                {/* Using a placeholder if image load fails? wrapper. */}
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${adsImages[currentAdIndex]})` }}
                                >
                                    {/* Fallback text if image fails to load or empty */}
                                    {!adsImages[currentAdIndex] && (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white">
                                            <div className="text-center">
                                                <h1 className="text-6xl mb-4 text-fredoka">Special Offer!</h1>
                                                <p className="text-2xl font-inter">Tap to dismiss</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Overlay Text */}
                        <div className="absolute bottom-10 w-full text-center text-white/50 animate-pulse font-fredoka">
                            Touch screen to resume shopping
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
