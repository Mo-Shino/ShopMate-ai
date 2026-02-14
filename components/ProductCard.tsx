"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Product, useCartStore } from "@/stores/useCartStore";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative group">
            <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                {/* Placeholder for product image if not provided */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                    {/* In a real app, use product.image. For prototype, detailed mock or placeholder */}
                    <span className="text-4xl text-primary-brown font-fredoka opacity-20">
                        {product.name.charAt(0)}
                    </span>
                </div>
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                )}

                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-3 right-3 bg-brand-orange text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="font-fredoka font-semibold text-lg text-primary-brown leading-tight line-clamp-2">
                    {product.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="font-bold text-brand-orange text-xl">
                        {product.price} <span className="text-xs font-normal text-primary-brown">EGP</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
