"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
    return null;
}

const NO_BLUR_ROUTES = ['/shinawy-analytics', '/survey'];

export default function SurveyGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showBlur, setShowBlur] = useState(false);

    useEffect(() => {
        if (NO_BLUR_ROUTES.some(r => pathname.startsWith(r))) {
            setShowBlur(false);
            return;
        }
        const surveyCompleted = getCookie("survey_completed") === "true";
        const adminAccess = getCookie("admin_access") === "true";
        setShowBlur(surveyCompleted && !adminAccess);
    }, [pathname]);

    if (!showBlur) return <>{children}</>;

    return (
        <>
            {/* Blurred background — fully non-interactive */}
            <div
                aria-hidden="true"
                style={{ filter: 'blur(12px) brightness(0.45)', pointerEvents: 'none', userSelect: 'none' }}
            >
                {children}
            </div>

            {/* Full-screen overlay — blocks all interaction */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6"
                    style={{
                        pointerEvents: 'auto',
                        background: 'rgba(50, 30, 15, 0.55)',
                        backdropFilter: 'blur(2px)',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.05 }}
                        className="relative w-full max-w-sm md:max-w-xl"
                    >
                        {/* Outer glow ring */}
                        <div
                            className="absolute -inset-6 rounded-[3rem] opacity-30 blur-3xl"
                            style={{ background: 'radial-gradient(circle, #e07b37 0%, transparent 70%)' }}
                        />

                        {/* Main Card */}
                        <div
                            className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                            style={{ background: 'linear-gradient(150deg, #69482d 0%, #3d2510 100%)' }}
                        >
                            {/* Decorative top stripe */}
                            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #e07b37, #f5a05f, #e07b37)' }} />

                            {/* Decorative watermark circles — hidden on mobile */}
                            <div className="hidden md:block absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
                                style={{ background: '#e07b37' }} />
                            <div className="hidden md:block absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-8"
                                style={{ background: '#e07b37' }} />

                            {/* Content */}
                            <div className="relative z-10 px-5 py-7 md:px-10 md:py-12 text-center">
                                {/* Logos */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center justify-center gap-4 mb-8"
                                >
                                    <Image src="/ShopMate_logo(light).svg" alt="ShopMate" width={44} height={44} className="opacity-90" />
                                    <div className="w-px h-8 opacity-30" style={{ background: '#dbe3c9' }} />
                                    <Image src="/fathallah_logo(light).svg" alt="Fathalla" width={40} height={40} className="opacity-90" />
                                </motion.div>

                                {/* Animated icon */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                    className="text-5xl md:text-8xl mb-4 md:mb-6 leading-none"
                                >
                                    🛒
                                </motion.div>

                                {/* Thank you headline */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="text-2xl md:text-4xl font-bold mb-2 md:mb-3"
                                    style={{
                                        color: '#dbe3c9',
                                        fontFamily: 'var(--font-fredoka)',
                                        direction: 'rtl',
                                        textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    شكراً لمشاركتك! 🎉
                                </motion.h1>

                                {/* Subheading */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-base md:text-xl font-semibold mb-1 md:mb-2"
                                    style={{ color: '#e07b37', fontFamily: 'var(--font-fredoka)', direction: 'rtl' }}
                                >
                                    ShopMate AI — Capstone Team 21 project
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.45 }}
                                    className="text-xs md:text-sm mb-5 md:mb-10"
                                    style={{ color: 'rgba(219,227,201,0.55)', direction: 'rtl' }}
                                >
                                    رأيك ساعدنا نبني تجربة تسوق أذكى وأسهل 💪
                                </motion.p>

                                {/* Divider — hidden on very small screens */}
                                <div className="hidden sm:flex items-center gap-4 mb-5 md:mb-8 px-4">
                                    <div className="flex-1 h-px" style={{ background: 'rgba(219,227,201,0.15)' }} />
                                    <span className="text-2xl">✨</span>
                                    <div className="flex-1 h-px" style={{ background: 'rgba(219,227,201,0.15)' }} />
                                </div>

                                {/* Pulsing COMING SOON badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                                    style={{
                                        background: 'rgba(224,123,55,0.18)',
                                        border: '1.5px solid rgba(224,123,55,0.4)',
                                    }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.8 }}
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ background: '#e07b37' }}
                                    />
                                    <span
                                        className="text-sm font-bold tracking-[0.25em]"
                                        style={{ color: '#e07b37' }}
                                    >
                                        COMING SOON
                                    </span>
                                </motion.div>

                                {/* Back to survey — styled button */}
                                <motion.a
                                    href="/?reset=survey"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.75, type: "spring", stiffness: 260 }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200"
                                    style={{
                                        color: '#dbe3c9',
                                        border: '1.5px solid rgba(219,227,201,0.35)',
                                        background: 'rgba(219,227,201,0.08)',
                                        fontFamily: 'var(--font-fredoka)',
                                        letterSpacing: '0.03em',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.background = 'rgba(219,227,201,0.15)';
                                        el.style.borderColor = 'rgba(219,227,201,0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.background = 'rgba(219,227,201,0.08)';
                                        el.style.borderColor = 'rgba(219,227,201,0.35)';
                                    }}
                                >
                                    <span className="text-base">📋</span>
                                    أعد الاستبيان
                                    <span className="text-base">←</span>
                                </motion.a>
                            </div>

                            {/* Decorative bottom stripe */}
                            <div className="h-1 w-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent, #e07b37, transparent)' }} />
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
