"use client";

import { useState } from "react";
import { Percent, Croissant, Milk, Beef, Apple, ShoppingBasket, Sparkles, X, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// 1. Data Structure
const categories = [
    { id: "all", label: "All Offers", icon: Sparkles },
    { id: "bakery", label: "Bakery", icon: Croissant },
    { id: "dairy", label: "Dairy", icon: Milk },
    { id: "meat", label: "Meat & Poultry", icon: Beef },
    { id: "fresh", label: "Fruits & Veg", icon: Apple },
    { id: "pantry", label: "Pantry", icon: ShoppingBasket },
];

const offers = [
    {
        id: 1,
        category: "bakery",
        title: "Morning Bliss",
        subtitle: "Fresh French Croissants",
        discount: "25%",
        desc: "Buttery, flaky, and baked fresh every morning. Perfect for your breakfast.",
        icon: Croissant,
        gradient: "from-orange-400 to-amber-600",
        shadow: "shadow-orange-500/30",
        accent: "bg-orange-500",
        textAccent: "text-orange-500"
    },
    {
        id: 2,
        category: "dairy",
        title: "Creamy Delight",
        subtitle: "Imported Cheddar Cheese",
        discount: "20%",
        desc: "Aged for 12 months. Rich flavor that melts perfectly in your sandwiches.",
        icon: Milk,
        gradient: "from-yellow-400 to-orange-500",
        shadow: "shadow-yellow-500/30",
        accent: "bg-yellow-500",
        textAccent: "text-yellow-500"
    },
    {
        id: 3,
        category: "meat",
        title: "Grill Master",
        subtitle: "Premium Angus Beef",
        discount: "18%",
        desc: "Freshly minced, high-quality beef. Ideal for juicy burgers and kofta.",
        icon: Beef,
        gradient: "from-red-500 to-rose-700",
        shadow: "shadow-red-500/30",
        accent: "bg-red-500",
        textAccent: "text-red-500"
    },
    {
        id: 4,
        category: "fresh",
        title: "Orchard Fresh",
        subtitle: "Organic Red Apples",
        discount: "15%",
        desc: "Crisp, sweet, and hand-picked. Full of vitamins for a healthy snack.",
        icon: Apple,
        gradient: "from-green-500 to-emerald-700",
        shadow: "shadow-green-500/30",
        accent: "bg-green-500",
        textAccent: "text-green-500"
    },
    {
        id: 5,
        category: "pantry",
        title: "Italian Touch",
        subtitle: "Premium Pasta Selection",
        discount: "Buy 2 Get 1",
        desc: "Authentic Italian pasta. Made from 100% durum wheat semolina.",
        icon: ShoppingBasket,
        gradient: "from-amber-700 to-amber-900",
        shadow: "shadow-amber-900/30",
        accent: "bg-amber-800",
        textAccent: "text-amber-800"
    },
];

export default function OffersPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);

    // Filter Logic
    const filteredOffers = selectedCategory === "all"
        ? offers
        : offers.filter(offer => offer.category === selectedCategory);

    return (
        <div className="h-full flex flex-col bg-bg-cream font-fredoka overflow-hidden relative">
            {/* 1. Standardized Header with Logos */}
            <PageHeader title="Special Offers" icon={Percent} className="mb-2" />

            {/* 2. Scrollable Category Filters */}
            <div className="w-full px-6 mb-6">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 shadow-sm snap-start shrink-0 border",
                                    isSelected
                                        ? "bg-primary-brown text-bg-cream border-primary-brown scale-105 shadow-lg"
                                        : "bg-white text-primary-brown/60 border-primary-brown/10 hover:bg-primary-brown/5 hover:border-primary-brown/30"
                                )}
                            >
                                <cat.icon size={18} className={isSelected ? "text-brand-orange" : "text-primary-brown/60"} />
                                <span className="font-bold text-sm tracking-wide">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Offer Cards Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredOffers.map((offer) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                key={offer.id}
                                className={clsx(
                                    "relative rounded-[2rem] p-6 text-white overflow-hidden group cursor-pointer",
                                    "bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
                                    offer.gradient,
                                    offer.shadow
                                )}
                                onClick={() => setSelectedOffer(offer)}
                            >
                                {/* Background Patterns (Glassmorphism) */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />

                                {/* NEW: Discount Badge (Ribbon Style) */}
                                <div className="absolute top-0 right-6 w-16 h-20 bg-white shadow-lg flex flex-col items-center justify-center rounded-b-lg border-t-4 border-white/50 z-20 overflow-hidden group-hover:h-24 transition-all duration-300">
                                    <div className={`absolute top-0 left-0 w-full h-1 ${offer.accent}`} />
                                    <span className={`text-xl font-black ${offer.textAccent} drop-shadow-sm text-center leading-none px-1`}>
                                        {offer.discount.replace('%', '')}
                                    </span>
                                    {offer.discount.includes('%') && (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">% OFF</span>
                                    )}
                                    <div className="absolute bottom-0 w-full flex">
                                        <div className="h-2 w-1/2 bg-white skew-y-12 origin-bottom-right"></div>
                                        <div className="h-2 w-1/2 bg-white -skew-y-12 origin-bottom-left"></div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        {/* NEW: Icon Box (Floating Circle) */}
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                            <offer.icon className="text-white drop-shadow-md" size={32} />
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1 text-white/70 flex items-center gap-1">
                                            <Tag size={12} /> {offer.category}
                                        </h3>
                                        <h2 className="text-2xl font-bold leading-tight mb-2 pr-16">
                                            {offer.title}
                                        </h2>
                                        <p className="text-sm text-white/90 font-medium leading-relaxed opacity-90 line-clamp-2">
                                            {offer.desc}
                                        </p>
                                    </div>

                                    {/* Action Button (Visible on Hover/Touch) */}
                                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-bold">Expires in 2 days</span>
                                        <button className="bg-white text-primary-brown px-4 py-2 rounded-xl text-xs font-bold hover:bg-bg-cream transition-colors shadow-sm flex items-center gap-1">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredOffers.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-primary-brown/50">
                        <ShoppingBasket size={48} className="mb-4 opacity-30" />
                        <p className="text-lg">No offers in this category yet.</p>
                    </div>
                )}
            </div>

            {/* ARTISTIC DETAILS MODAL */}
            <AnimatePresence>
                {selectedOffer && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOffer(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            layoutId={`offer-${selectedOffer.id}`}
                            className={clsx(
                                "relative w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl",
                                "bg-gradient-to-br text-white",
                                selectedOffer.gradient
                            )}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            {/* Artistic Background Watermark */}
                            <selectedOffer.icon
                                className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 rotate-12"
                                strokeWidth={1}
                            />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedOffer(null)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/40 transition-colors backdrop-blur-md border border-white/10"
                            >
                                <X size={20} className="text-white" />
                            </button>

                            <div className="relative z-10 p-8 flex flex-col items-center text-center h-full min-h-[400px]">
                                {/* Icon Badge */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-6xl shadow-2xl border border-white/30 mb-6 rotate-3"
                                >
                                    <selectedOffer.icon size={48} className="text-white drop-shadow-lg" />
                                </motion.div>

                                {/* Category */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-4 py-1 bg-black/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/10"
                                >
                                    {selectedOffer.category}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-black mb-2 leading-none"
                                >
                                    {selectedOffer.title}
                                </motion.h2>
                                <motion.h3
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-lg font-medium opacity-90 mb-6"
                                >
                                    {selectedOffer.subtitle}
                                </motion.h3>

                                {/* Description */}
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-white/80 leading-relaxed font-medium mb-8"
                                >
                                    {selectedOffer.desc}
                                </motion.p>

                                {/* Artistic Discount Display (No Price) */}
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="mt-auto w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between"
                                >
                                    <div className="text-left">
                                        <span className="block text-xs uppercase opacity-70 mb-1">Great Deal</span>
                                        <span className="text-4xl font-black tracking-tighter">{selectedOffer.discount}</span>
                                    </div>
                                    <div className="h-10 w-px bg-white/20 mx-4"></div>
                                    <div className="text-right">
                                        <span className="block text-xs uppercase opacity-70 mb-1">Valid Until</span>
                                        <span className="font-bold">Sunday</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
