
"use client";

import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    icon?: LucideIcon;
    className?: string;
}

export default function PageHeader({ title, icon: Icon, className }: PageHeaderProps) {
    return (
        <header className={`w-full px-6 py-4 flex items-center justify-between bg-transparent z-10 shrink-0 ${className}`}>

            {/* Left: ShopMate Logo */}
            <div className="w-20 md:w-32 flex-shrink-0">
                <Image
                    src="/ShopMate_logo.svg"
                    alt="Shop Mate AI"
                    width={120}
                    height={60}
                    className="object-contain w-full h-auto"
                    priority
                />
            </div>

            {/* Center: Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                <h1 className="font-bold text-xl md:text-3xl text-primary-brown">{title}</h1>
                {Icon && <Icon className="w-5 h-5 md:w-8 md:h-8 text-primary-brown" strokeWidth={2.5} />}
            </div>

            {/* Right: Fathallah Logo */}
            <div className="w-14 md:w-20 flex-shrink-0">
                <Image
                    src="/fathallah_logo.svg"
                    alt="Fathallah"
                    width={80}
                    height={80}
                    className="object-contain w-full h-auto"
                    priority
                />
            </div>
        </header>
    );
}
