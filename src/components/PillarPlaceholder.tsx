"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PillarPlaceholder({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="glass shadow-2xl rounded-[2.5rem] p-12 max-w-2xl border-white/5 relative overflow-hidden">
                <div className="radar-sweep opacity-10" />
                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
                            {title}
                        </h1>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Status: Coming Soon</p>
                    </div>
                    <p className="text-white/60 text-lg leading-relaxed">
                        {description} We are currently working on this feature to help you connect even better.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5 uppercase font-black text-xs tracking-widest px-10 h-14">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
