"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MessageSquare, ScanBarcode, Percent, Gamepad2, ListChecks, Menu, ChevronLeft } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/list", icon: ListChecks, label: "Shopping List" },
    { href: "/scan", icon: ScanBarcode, label: "Scan Item" },
    { href: "/offers", icon: Percent, label: "Offers" },
    { href: "/kids", icon: Gamepad2, label: "Kids Mode" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);

    // Hide sidebar on full-screen routes
    if (pathname.startsWith('/survey') || pathname.startsWith('/shinawy-analytics')) {
        return null;
    }

    return (
        <aside
            className={clsx(
                "fixed z-50 bg-primary-brown text-bg-cream shadow-2xl transition-all duration-500 ease-in-out font-fredoka",
                // Mobile: Bottom Nav (Fixed Height)
                "bottom-0 left-0 w-full h-20 flex flex-row items-center justify-between px-6 py-2",
                // Desktop: Dynamic Width
                "md:top-0 md:left-0 md:h-full md:flex-col md:justify-start md:py-8 md:px-0",
                isExpanded ? "md:w-60" : "md:w-24"
            )}
        >
            {/* Menu Icon (Desktop Only) */}
            <div className="hidden md:flex w-full justify-center mb-8 relative">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    {isExpanded ? <ChevronLeft className="w-8 h-8 opacity-80" /> : <Menu className="w-8 h-8 opacity-80" />}
                </button>
            </div>

            <nav className="flex-1 flex w-full
                /* Mobile: Horizontal Row */
                flex-row justify-between items-center gap-1
                /* Desktop: Vertical Column - Tighter Spacing */
                md:flex-col md:gap-3 md:px-4 md:justify-start
            ">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center rounded-2xl transition-all duration-300 relative group overflow-hidden whitespace-nowrap",
                                /* Mobile Sizing */
                                "justify-center w-12 h-12 flex-col",
                                /* Desktop Sizing */
                                "md:h-14 md:w-full md:flex-row",
                                isExpanded ? "md:justify-start md:px-6" : "md:justify-center",
                                isActive
                                    ? "bg-bg-cream text-primary-brown shadow-md md:shadow-none"
                                    : "hover:bg-white/10 text-bg-cream/60 hover:text-bg-cream"
                            )}
                        >
                            {/* Active Indicator (Desktop Only) */}
                            {isActive && !isExpanded && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-orange rounded-l-full"
                                />
                            )}

                            {/* Icon */}
                            <item.icon className={clsx("transition-all duration-300", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]", "w-6 h-6 md:w-7 md:h-7")} />

                            {/* Label (Desktop Expanded Only) */}
                            <span
                                className={clsx(
                                    "hidden md:block text-base font-bold transition-all duration-300 overflow-hidden",
                                    isExpanded ? "w-auto opacity-100 ml-4 delay-100" : "w-0 opacity-0 ml-0"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
