"use client";

import { useCartStore } from "@/stores/useCartStore";
import { Trash2, Plus, ListChecks, Check, X, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";

export default function ListPage() {
    const { cart, removeFromCart, toggleItemCheck, addToCart, updateItem } = useCartStore();
    const [manualInput, setManualInput] = useState("");
    const [manualPrice, setManualPrice] = useState("");

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");

    // Sort: Unchecked items first, then Checked items
    const sortedCart = useMemo(() => {
        return [...cart].sort((a, b) => {
            if (a.checked === b.checked) return 0;
            return a.checked ? 1 : -1; // Checked items go to bottom
        });
    }, [cart]);

    // Calculate Total (only for items with price)
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    }, [cart]);

    const handleAddManualItem = () => {
        if (!manualInput.trim()) return;

        addToCart({
            id: Date.now().toString(),
            name: manualInput,
            category: "Manual",
            price: parseFloat(manualPrice) || 0,
            image: undefined,
            barcode: undefined
        });
        setManualInput("");
        setManualPrice("");
    };

    const startEditing = (id: string, name: string, price?: number) => {
        setEditingId(id);
        setEditName(name);
        setEditPrice(price ? price.toString() : "");
    };

    const saveEdit = () => {
        if (editingId) {
            updateItem(editingId, {
                name: editName,
                price: parseFloat(editPrice) || 0
            });
            setEditingId(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#dbe3c9] relative font-fredoka overflow-hidden">

            {/* Header: Exact match to Chat Page */}
            <PageHeader title="Shopping List" icon={ListChecks} className="bg-[#dbe3c9]" />

            {/* Total Price Banner (if > 0) */}
            <AnimatePresence>
                {totalPrice > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#69482d] text-white text-center py-2 font-bold shadow-md z-1"
                    >
                        Total Estimated: {totalPrice.toFixed(2)} EGP
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4 scrollbar-hide pt-4">
                <div className="mx-auto w-full max-w-4xl flex flex-col gap-4"> {/* Centering Container */}
                    <AnimatePresence mode="popLayout">
                        {sortedCart.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                className="flex flex-col items-center justify-center h-full text-[#69482d] mt-20"
                            >
                                <ListChecks size={80} className="mb-4 opacity-20" />
                                <p className="text-xl font-bold opacity-50">Your list is empty</p>
                            </motion.div>
                        ) : (
                            sortedCart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={clsx(
                                        "rounded-xl p-0 shadow-md flex items-center overflow-hidden transition-all duration-500 relative group",
                                        // Brand Identity: #69482d (Brown), #e07b37 (Orange), #dbe3c9 (BG)
                                        item.checked ? "bg-[#69482d] opacity-80" : "bg-[#e07b37]"
                                    )}
                                >
                                    {/* Left Color Strip */}
                                    <div className={clsx(
                                        "w-3 self-stretch",
                                        item.checked ? "bg-[#3e2b1e]" : "bg-[#b35a1f]" // Darker shades for strip
                                    )}></div>

                                    {/* Content Container */}
                                    <div className="flex-1 flex items-center justify-between p-4 pl-3 min-h-[5rem]">

                                        {/* Edit Mode vs View Mode */}
                                        {editingId === item.id ? (
                                            <div className="flex items-center gap-2 flex-1 animate-in fade-in zoom-in duration-200">
                                                <input
                                                    autoFocus
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="bg-white/90 text-black rounded px-2 py-1 flex-1 font-bold outline-none"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    className="bg-white/90 text-black rounded px-2 py-1 w-20 font-bold outline-none"
                                                    type="number"
                                                    placeholder="Price"
                                                />
                                                <button onClick={saveEdit} className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                                                    <Save size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col cursor-pointer" onClick={() => startEditing(item.id, item.name, item.price)}>
                                                <h3 className={clsx(
                                                    "font-bold text-xl md:text-2xl text-white transition-all duration-300",
                                                    item.checked && "line-through opacity-60 decoration-2 decoration-white/50"
                                                )}>
                                                    {item.name}
                                                </h3>
                                                {(item.price || 0) > 0 && (
                                                    <p className={clsx("text-white/80 text-sm font-medium", item.checked && "opacity-50")}>
                                                        {item.price} EGP
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions Right */}
                                        {editingId !== item.id && (
                                            <div className="flex items-center gap-3">

                                                {/* Edit Button (Visible on Hover/Focus or just subtle) */}
                                                <button
                                                    onClick={() => startEditing(item.id, item.name, item.price)}
                                                    className="opacity-100 md:opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity p-2"
                                                >
                                                    <Edit2 size={18} />
                                                </button>

                                                {/* Toggle Checkbox */}
                                                <button
                                                    onClick={() => toggleItemCheck(item.id)}
                                                    className={clsx(
                                                        "w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ease-out transform active:scale-95",
                                                        item.checked
                                                            ? "bg-transparent border-white/50 text-white/50 scale-90" // Bought State
                                                            : "bg-white border-white text-[#e07b37] shadow-lg scale-100 hover:scale-110" // To Buy State (Text is Orange)
                                                    )}
                                                >
                                                    {/* User Request: Unchecked = Check (to buy), Checked = X (undo) */}
                                                    {item.checked ? <X size={28} strokeWidth={3} /> : <Check size={28} strokeWidth={4} />}
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-white/30 hover:text-white/90 p-1 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Input Area */}
            <div className="p-6 w-full flex justify-center mb-4 z-20">
                <div className="w-full max-w-2xl relative h-16 md:h-20 group flex items-center gap-2">

                    {/* Price Input (New) */}
                    <input
                        type="number"
                        value={manualPrice}
                        onChange={(e) => setManualPrice(e.target.value)}
                        placeholder="Price"
                        className="w-24 h-full bg-[#e07b37] placeholder:text-white/70 text-white font-bold text-lg md:text-xl px-4 rounded-3xl outline-none shadow-xl text-center"
                    />

                    {/* Name Input */}
                    <div className="flex-1 h-full relative">
                        <input
                            type="text"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddManualItem()}
                            placeholder="Write To Add In List"
                            className="w-full h-full bg-[#e07b37] placeholder:text-white/70 text-white font-bold text-xl px-6 rounded-3xl outline-none shadow-xl pr-16 transition-transform focus:scale-[1.01]"
                        />
                        {/* Enlarged Add Button */}
                        <button
                            onClick={handleAddManualItem}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-[#dbe3c9] rounded-full flex items-center justify-center text-[#e07b37] shadow-md hover:scale-110 hover:rotate-90 transition-all duration-300"
                        >
                            <Plus size={36} strokeWidth={4} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
