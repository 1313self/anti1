"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Compass } from "lucide-react";

interface PillarPlaceholderProps {
    title: string;
    description: string;
}

export function PillarPlaceholder({ title, description }: PillarPlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 md:p-8 relative overflow-hidden bg-background">
            {/* Background Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/[0.03] blur-[80px] md:blur-[120px] rounded-full" />

            <div className="max-w-2xl w-full text-center space-y-8 md:space-y-10 relative z-10 px-4">
                <div className="space-y-4 md:space-y-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm mx-auto group">
                        <Compass className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none break-words">
                            {title}
                        </h1>
                        <p className="text-indigo-600 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">Status: Engineering in Progress</p>
                    </div>
                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium line-clamp-4 md:line-clamp-none">
                        {description} We are currently building this space to provide the best possible campus experience for you.
                    </p>
                </div>

                <div className="pt-4 md:pt-6">
                    <Link href="/dashboard" className="block sm:inline-block">
                        <Button size="lg" className="w-full sm:w-auto rounded-xl md:rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 uppercase font-black text-[10px] md:text-xs tracking-[0.2em] px-8 md:px-12 h-14 md:h-16 shadow-xl shadow-indigo-100 transition-all hover:scale-105">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
