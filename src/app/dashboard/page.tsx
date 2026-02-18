"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Library,
    Terminal,
    Briefcase,
    Users,
    MessageSquare,
    ChevronRight,
    TrendingUp,
    Radar,
    Target,
    Zap,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudyBuddyToggle } from "@/components/StudyBuddyToggle";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    return (
        <div className="space-y-8 pb-20">
            {/* Welcome Hero - Now more integrated */}
            <section className="relative overflow-hidden rounded-[2rem] p-10 glass shadow-2xl border-white/5 group">
                <div className="radar-sweep opacity-10 scale-150" />
                <div className="relative z-10 flex flex-col lg:flex-row gap-12 justify-between items-center text-center lg:text-left">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em]">
                            <Zap className="w-3 h-3 fill-cyan-400" /> Welcome back
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.8] uppercase">
                            Your <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-medium">
                            You have new relevant connections waiting for you. The Library has been updated with new files.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                            <Link href="/dashboard/discovery">
                                <Button size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-2xl px-10 h-16 font-black uppercase text-xs tracking-widest shadow-lg shadow-cyan-500/20">
                                    Find Connections
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5 px-10 h-16 uppercase font-black text-xs tracking-widest">
                                View Recent
                            </Button>
                        </div>
                    </div>

                    <div className="w-full lg:w-96 space-y-4">
                        <StudyBuddyToggle />
                        <Card className="bg-black/40 border-white/5 rounded-[1.5rem] p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Study Schedule</h3>
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 rounded-xl h-12 text-[10px] border-white/5 hover:bg-white/5 font-black uppercase tracking-widest">MORNING</Button>
                                <Button variant="outline" className="flex-1 rounded-xl h-12 text-[10px] border-white/5 bg-white/5 border-white/20 font-black uppercase tracking-widest">LATENIGHT</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[250px]">

                {/* Discovery Engine - Radar Pulse */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 md:row-span-1 group"
                >
                    <Link href="/dashboard/discovery" className="block h-full">
                        <Card className="glass-card holographic-hover h-full relative overflow-hidden flex flex-col justify-between border-white/5">
                            <div className="radar-sweep opacity-20" />
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <Radar className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <Badge className="bg-cyan-500 text-black text-[10px] font-black tracking-widest">ACTIVE</Badge>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter mt-4">Discover People</CardTitle>
                                <CardDescription className="text-white/40 text-xs">Find and connect with other students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-cyan-400/60 font-mono text-[10px] uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    12 Active Students
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* The Forge - Expanded */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 md:row-span-1 group"
                >
                    <Link href="/dashboard/forge" className="block h-full">
                        <Card className="glass-card holographic-hover h-full bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/10">
                            <CardHeader>
                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 w-fit">
                                    <Terminal className="w-6 h-6 text-green-400" />
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter mt-4">The Forge</CardTitle>
                                <CardDescription className="text-white/40 text-xs text-pretty italic">Venture collaboration for elite student hackers and founders.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="border-green-500/20 text-green-400 text-[10px]">ALPHA PROJECT</Badge>
                                    <Badge variant="outline" className="border-green-500/20 text-green-400 text-[10px]">NEW SPRINT</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* The Library - Ticker Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 md:row-span-1 group overflow-hidden"
                >
                    <Link href="/dashboard/library" className="block h-full">
                        <Card className="glass-card holographic-hover h-full flex flex-col justify-between border-white/5">
                            <CardHeader>
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit">
                                    <Library className="w-6 h-6 text-blue-400" />
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter mt-4">The Library</CardTitle>
                                <CardDescription className="text-white/40 text-xs">Curated academic asset repository.</CardDescription>
                            </CardHeader>

                            {/* Horizontal Ticker */}
                            <div className="relative h-12 bg-black/20 mt-2 border-y border-white/5 flex items-center overflow-hidden">
                                <motion.div
                                    animate={{ x: [0, -1000] }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="flex gap-12 whitespace-nowrap px-4"
                                >
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-blue-300 uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <Download className="w-3 h-3" /> Artifact_Ref_L02_Calc.pdf
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <Download className="w-3 h-3" /> Data_Structures_CheatSheet.epub
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            <CardContent className="pt-4">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="animate-pulse">●</span> Syncing: 24 New Files Found
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* The Hustle - Prominent */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-1 md:row-span-1 group"
                >
                    <Link href="/dashboard/hustle" className="block h-full">
                        <Card className="glass-card holographic-hover h-full bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border-orange-500/10">
                            <CardHeader>
                                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 w-fit">
                                    <Briefcase className="w-6 h-6 text-orange-400" />
                                </div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter mt-4">The Hustle</CardTitle>
                                <CardDescription className="text-white/40 text-[10px]">Career & Placement Ops.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-[10px] text-orange-200">
                                    GAIA Corp Hiring Now
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* The Lounge - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-1 md:row-span-1 group"
                >
                    <Link href="/dashboard/lounge" className="block h-full">
                        <Card className="glass-card holographic-hover h-full border-purple-500/10">
                            <CardHeader>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit">
                                    <MessageSquare className="w-6 h-6 text-purple-400" />
                                </div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter mt-4">The Lounge</CardTitle>
                                <CardDescription className="text-white/40 text-[10px]">Strategic Socializing.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
