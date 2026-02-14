"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import { useCartStore } from "@/stores/useCartStore";
import products from "@/lib/products.json";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Scan, X, Zap } from "lucide-react";
import clsx from "clsx";

export default function ScanPage() {
    const [, setResult] = useState("");
    const [scannedProduct, setScannedProduct] = useState<typeof products[0] | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    const { ref } = useZxing({
        onDecodeResult(result) {
            setResult(result.getText());
            handleScan(result.getText());
        },
        onError() {
            // Camera errors are expected on devices without cameras
        },
        constraints: {
            video: { facingMode: "environment" }
        }
    });

    const handleScan = (barcode: string) => {
        // Prevent spamming
        if (scannedProduct && scannedProduct.barcode === barcode) return;

        const product = products.find((p) => p.barcode === barcode);
        if (product) {
            setScannedProduct(product);
            setIsSimulating(false); // Close simulation modal if open
            // Play a success sound effect here if we had one
        } else {
            // Handle unknown barcode? for now just ignore or show error
        }
    };

    const confirmAdd = () => {
        if (scannedProduct) {
            addToCart(scannedProduct);
            setScannedProduct(null); // Close modal
            setResult(""); // Reset
        }
    };

    return (
        <div className="h-full flex flex-col items-center p-6 relative overflow-hidden bg-bg-cream font-fredoka">

            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-brown/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col items-center mb-8 z-10">
                <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
                    <Scan className="w-8 h-8 text-brand-orange" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-2 tracking-tight">Scan Item</h1>
                <p className="text-primary-brown/60 text-lg text-center max-w-md">
                    Point your camera at a product barcode to verify price and add to cart.
                </p>
            </div>

            {/* Camera Viewfinder Area */}
            <div className="relative w-full max-w-2xl flex-1 max-h-[50vh] min-h-[300px] bg-black rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl z-10 group">
                {/* The Camera Feed */}
                <video ref={ref as React.RefObject<HTMLVideoElement>} className="w-full h-full object-cover opacity-90" />

                {/* Scanning Animation Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Corners */}
                    <div className="w-[80%] h-[60%] border-2 border-white/30 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand-orange -mt-1 -ml-1 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand-orange -mt-1 -mr-1 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand-orange -mb-1 -ml-1 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand-orange -mb-1 -mr-1 rounded-br-lg"></div>

                        {/* Scanning Laser Line */}
                        <motion.div
                            animate={{ top: ["10%", "90%", "10%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-4 right-4 h-0.5 bg-brand-orange shadow-[0_0_15px_rgba(232,141,75,0.8)]"
                        />
                    </div>
                </div>

                {/* Darken Overlay when simulating */}
                {isSimulating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20" />}
            </div>

            {/* Dev Mode Trigger */}
            <button
                onClick={() => setIsSimulating(true)}
                className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white rounded-full text-primary-brown/50 hover:text-primary-brown transition-all text-sm font-medium border border-transparent hover:border-primary-brown/10 z-10"
            >
                <Zap size={16} />
                <span>Dev Mode: Simulate Scan</span>
            </button>


            {/* Simulation Sidebar / Modal */}
            <AnimatePresence>
                {isSimulating && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="absolute inset-y-0 right-0 w-full md:w-96 bg-white z-40 shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-bg-cream/50">
                            <h2 className="text-xl font-bold text-primary-brown">Simulate Barcode</h2>
                            <button onClick={() => setIsSimulating(false)} className="p-2 hover:bg-black/5 rounded-full text-primary-brown">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            <p className="text-sm text-gray-500 mb-2">Select a product to simulate a successful barcode scan:</p>
                            {products.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => handleScan(p.barcode)}
                                    className="w-full flex items-center p-3 rounded-xl hover:bg-brand-orange/10 border border-gray-100 hover:border-brand-orange/30 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 bg-bg-cream rounded-lg flex items-center justify-center text-lg font-bold text-primary-brown mr-3">
                                        {p.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-primary-brown group-hover:text-brand-orange transition-colors">{p.name}</div>
                                        <div className="text-xs text-gray-400 font-mono tracking-wider">{p.barcode}</div>
                                    </div>
                                    <div className="font-bold text-brand-orange">{p.price} LE</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Scanned Product Modal (Success) */}
            <AnimatePresence>
                {scannedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Confetti / Glow effect */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-orange/20 to-transparent pointer-events-none" />

                            <div className="w-24 h-24 bg-brand-orange rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-orange/30 z-10 ring-4 ring-white">
                                <CheckCircle size={40} className="text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-primary-brown mb-2 leading-tight">{scannedProduct.name}</h2>
                            <p className="text-gray-500 mb-6 text-sm flex items-center gap-2">
                                <Scan size={14} />
                                {scannedProduct.barcode}
                            </p>

                            <div className="w-full bg-bg-cream rounded-2xl p-4 mb-8">
                                <p className="text-sm text-primary-brown/70 uppercase font-bold tracking-widest mb-1">Price</p>
                                <p className="text-4xl font-bold text-brand-orange">{scannedProduct.price} <span className="text-lg">EGP</span></p>
                            </div>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setScannedProduct(null)}
                                    className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAdd}
                                    className="flex-1 py-4 rounded-2xl bg-brand-orange text-white font-bold hover:bg-[#d67d3c] hover:shadow-lg hover:shadow-brand-orange/30 transition-all flex items-center justify-center gap-2"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
