"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, ArrowUp } from "lucide-react";
import { useChatStore, Message } from "@/stores/useChatStore";
import { useCartStore } from "@/stores/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

export default function ChatPage() {
    const { messages, addMessage, isTyping, setTyping } = useChatStore();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        addMessage(userMsg);
        setInput("");
        setTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.response || data.error || "API Error: " + response.statusText);
            }

            let botText = data.response;
            let suggestedProducts: Array<{ id?: string; name: string; category?: string; reason?: string; is_sponsored?: boolean; price?: number }> = [];
            let shouldAddToCart = false;

            // Attempt to parse JSON response from the bot
            try {
                let cleanJson = data.response;
                if (cleanJson.includes("```json")) {
                    cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "");
                }

                const parsed = JSON.parse(cleanJson);
                botText = parsed.reply;
                shouldAddToCart = parsed.should_add_to_cart || false;

                // Formatting Fix: Remove bold markers for cleaner UI
                botText = botText.replace(/\*\*/g, "");

                if (parsed.suggested_products && Array.isArray(parsed.suggested_products) && parsed.suggested_products.length > 0) {
                    suggestedProducts = parsed.suggested_products;

                    // Auto-Add Logic
                    if (shouldAddToCart) {
                        const { addToCart } = useCartStore.getState();
                        suggestedProducts.forEach((p) => {
                            // Use placeholder price if missing, ensuring No Price rule doesn't break logic
                            addToCart({
                                id: p.id || Math.random().toString(36).substr(2, 9),
                                name: p.name,
                                category: p.category || "General",
                                price: 0
                            });
                        });
                        botText += "\n\n✅ *Has been added to cart.*";
                    }
                }
            } catch (e) {
                console.warn("Bot response was not valid JSON, using raw text.", e);
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botText || "I'm listening...",
                sender: "bot",
                timestamp: new Date(),
                suggestedProducts: suggestedProducts // Pass to UI
            };
            addMessage(botMsg);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = (error as Error).message;

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `⚠️ **Error detected:**\n${errorMessage}\n\n(Simulated Mode Active)`,
                sender: "bot",
                timestamp: new Date(),
            };
            addMessage(botMsg);
        } finally {
            setTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-cream relative overflow-hidden font-fredoka">

            {/* Header: Designed to match Figma */}
            <header className="px-6 py-4 flex items-center justify-between bg-bg-cream z-10 shadow-sm md:shadow-none">

                {/* Left: ShopMate Logo (SVG) */}
                <div className="w-24 md:w-32">
                    <Image
                        src="/ShopMate_logo.svg"
                        alt="Shop Mate AI"
                        width={120}
                        height={60}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Center: Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl text-primary-brown">Chat Bot</h1>
                    <Bot className="w-6 h-6 md:w-8 md:h-8 text-primary-brown" strokeWidth={2.5} />
                </div>

                {/* Right: Fathallah Logo */}
                <div className="w-16 md:w-20">
                    <Image
                        src="/fathallah_logo.svg"
                        alt="Fathallah"
                        width={80}
                        height={80}
                        className="object-contain"
                        priority
                    />
                </div>
            </header>


            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 scrollbar-hide w-full">
                {/* Centered Container for Messages */}
                <div className="w-[85%] max-w-5xl mx-auto flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className={clsx(
                                    "flex w-full items-start gap-4",
                                    // Figma: User on LEFT, Bot on RIGHT
                                    msg.sender === "user" ? "flex-row" : "flex-row-reverse"
                                )}
                            >
                                {/* Avatar */}
                                <div className={clsx(
                                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-2",
                                    msg.sender === "user"
                                        ? "bg-[#E88D4B] border-[#E88D4B]"
                                        : "bg-[#69482d] border-[#69482d]"
                                )}>
                                    {msg.sender === "user"
                                        ? <User className="text-white w-7 h-7" />
                                        : <Bot className="text-white w-7 h-7" />
                                    }
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={clsx(
                                        "max-w-[75%] p-4 md:p-6 text-lg md:text-xl relative shadow-md font-medium leading-relaxed",
                                        // User: Orange, Rounded, Tail pointing Left
                                        msg.sender === "user"
                                            ? "bg-[#E88D4B] text-white rounded-[2rem] rounded-tl-none"
                                            : "bg-[#69482d] text-bg-cream rounded-[2rem] rounded-tr-none"
                                    )}
                                >
                                    <p className="whitespace-pre-wrap dir-rtl">
                                        {msg.text}
                                    </p>

                                    {/* Suggested Products Grid */}
                                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                            {msg.suggestedProducts.map((p, idx) => (
                                                <div key={idx} className="bg-white/90 p-3 rounded-xl shadow-sm text-primary-brown flex justify-between items-center transition-all hover:scale-[1.02]">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm lg:text-base">{p.name}</span>
                                                        <span className="text-xs text-gray-500">{p.reason}</span>
                                                        {/* Optional: Show 'Sponsored' badge if valid */}
                                                        {p.is_sponsored && <span className="text-[10px] bg-yellow-100 text-yellow-700 w-fit px-2 py-0.5 rounded-full mt-1">Partner Brand</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const { addToCart } = useCartStore.getState();
                                                            addToCart({
                                                                ...p,
                                                                id: p.id || Math.random().toString(36).substr(2, 9),
                                                                price: 0 // Default for No-Price Rule
                                                            });
                                                            // Optional: Add feedback toast here
                                                        }}
                                                        className="bg-brand-orange text-white p-2 rounded-lg hover:bg-[#d67d3c] transition-colors"
                                                        title="Add to Cart"
                                                    >
                                                        <div className="w-5 h-5 flex items-center justify-center">+</div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </motion.div>
                        ))}




                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex w-full items-start gap-4 flex-row-reverse"
                            >
                                {/* Bot Avatar */}
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-2 bg-[#69482d] border-[#69482d]">
                                    <Bot className="text-white w-7 h-7" />
                                </div>

                                {/* Typing Bubble */}
                                <div className="bg-[#69482d] p-6 rounded-[2rem] rounded-tr-none min-w-[100px] flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Input Area */}
            <div className="p-4 md:p-8 bg-transparent w-full flex justify-center mb-4">
                <div className="w-[85%] max-w-5xl relative shadow-2xl rounded-full bg-[#E88D4B] flex items-center p-2 pr-2 h-16 md:h-20 transition-transform focus-within:scale-[1.01]">

                    {/* Input Field */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask Anything"
                        className="flex-1 bg-transparent border-none outline-none px-8 text-white text-xl md:text-2xl placeholder:text-white/70 font-bold font-fredoka h-full"
                    />

                    {/* Send Button (Arrow Up) */}
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-[#69482d] hover:bg-[#5a3d24] text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md m-1"
                    >
                        <ArrowUp size={32} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
}
