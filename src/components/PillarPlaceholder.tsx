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
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 relative overflow-hidden bg-background">
            {/* Background Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] blur-[120px] rounded-full" />

            <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
                <div className="space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm mx-auto group">
                        <Compass className="w-10 h-10 text-indigo-600 group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                            {title}
                        </h1>
                        <p className="text-indigo-600 font-mono text-[10px] uppercase tracking-[0.4em] font-black">Status: Engineering in Progress</p>
                    </div>
                    <p className="text-slate-500 text-xl leading-relaxed font-medium">
                        {description} We are currently building this space to provide the best possible campus experience for you.
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 uppercase font-black text-xs tracking-[0.2em] px-12 h-16 shadow-xl shadow-indigo-100 transition-all hover:scale-105">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
