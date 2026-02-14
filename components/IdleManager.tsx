"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdsStore } from "@/stores/useAdsStore";
import { useCartStore } from "@/stores/useCartStore";
import { useChatStore } from "@/stores/useChatStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserPlus, ShoppingCart, MessageSquare, Loader2 } from "lucide-react";

export default function IdleManager() {
    const { isIdle, setIdle } = useAdsStore();
    const { clearCart } = useCartStore();
    const { clearChat } = useChatStore();
    const router = useRouter();

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [adsImages, setAdsImages] = useState<string[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    // Fetch Ads on Mount
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads');
                const data = await res.json();
                if (data.images && data.images.length > 0) {
                    setAdsImages(data.images);
                } else {
                    // Fallback if no images found
                    setAdsImages(["/placeholder.jpg"]);
                }
            } catch (error) {
                console.error("Failed to fetch ads:", error);
            }
        };
        fetchAds();
    }, []);

    // Idle Timer Logic
    const resetTimer = useCallback(() => {
        if (isIdle) {
            // If idle and specific interaction happens, we don't just dismiss.
            // We show the modal. See 'handleInteraction' below.
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIdle(true);
            setShowWelcomeModal(false); // Ensure modal is closed when screensaver starts
        }, 30000); // 30 seconds
    }, [isIdle, setIdle]);

    useEffect(() => {
        const events = ["mousemove", "touchstart", "keydown", "click", "scroll"];
        const onActivity = () => resetTimer();

        events.forEach(event => window.addEventListener(event, onActivity));
        resetTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, onActivity));
        };
    }, [resetTimer]);

    // Carousel Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isIdle && adsImages.length > 0 && !showWelcomeModal) {
            interval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % adsImages.length);
            }, 5000); // Change ad every 5s
        }
        return () => clearInterval(interval);
    }, [isIdle, adsImages, showWelcomeModal]);

    // Handle User Interaction while Idle
    const handleScreenTap = () => {
        if (isIdle && !showWelcomeModal) {
            setShowWelcomeModal(true);
        }
    };

    // Session Logic
    const handleMakeDecision = (isNewCustomer: boolean) => {
        if (isNewCustomer) {
            // New Customer: Reset Everything
            clearCart();
            clearChat();
            router.push("/"); // Go to Home
        }
        // Same Customer: Just resume (do nothing, just close)

        setShowWelcomeModal(false);
        setIdle(false);
        resetTimer();
    };

    if (!isIdle) return null;

    return (
        <AnimatePresence>
            {isIdle && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black cursor-pointer overflow-hidden"
                    onClick={handleScreenTap}
                >
                    {/* Carousel */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentAdIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {adsImages.length > 0 ? (
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${adsImages[currentAdIndex]})` }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary-brown text-bg-cream">
                                    <Loader2 className="w-12 h-12 animate-spin" />
                                </div>
                            )}

                            {/* Overlay Gradient for Text readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Tap to Wake Hint */}
                    {!showWelcomeModal && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2, repeat: Infinity, repeatType: "reverse", duration: 2 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-fredoka text-xl bg-black/40 px-6 py-2 rounded-full backdrop-blur-md"
                        >
                            Tap screen to wake up
                        </motion.div>
                    )}

                    {/* Welcome Back Modal */}
                    <AnimatePresence>
                        {showWelcomeModal && (
                            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
                                    className="bg-bg-cream rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg text-center font-fredoka border-4 border-primary-brown relative over"
                                >
                                    <h2 className="text-4xl font-bold text-primary-brown mb-2">Welcome Back!</h2>
                                    <p className="text-xl text-primary-brown/70 mb-8">Are you the same customer?</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Option 1: Same Customer */}
                                        <button
                                            onClick={() => handleMakeDecision(false)}
                                            className="group relative flex items-center justify-between p-5 bg-white border-2 border-primary-brown/10 rounded-3xl hover:border-brand-orange hover:bg-brand-orange/5 transition-all duration-300 shadow-sm hover:shadow-md text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-brown/10 rounded-full flex items-center justify-center text-primary-brown group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-primary-brown">Yes, it&apos;s me</h3>
                                                    <p className="text-sm opacity-60">Continue with my cart & chat</p>
                                                </div>
                                            </div>
                                            {/* Icons for context */}
                                            <div className="flex gap-1 opacity-40">
                                                <ShoppingCart size={16} />
                                                <MessageSquare size={16} />
                                            </div>
                                        </button>

                                        {/* Option 2: New Customer */}
                                        <button
                                            onClick={() => handleMakeDecision(true)}
                                            className="group relative flex items-center justify-between p-5 bg-primary-brown text-bg-cream rounded-3xl hover:bg-brand-orange transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-bg-cream">
                                                    <UserPlus size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">New Customer</h3>
                                                    <p className="text-sm opacity-80">Start a fresh session</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
