"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Banknote, Clock, MapPin,
    ArrowLeft, ExternalLink, Filter, TrendingUp,
    CheckCircle2, Building2, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const SAMPLE_GIGS = [
    {
        id: "g1",
        role: "Frontend Developer Intern",
        company: "Nexus Labs",
        type: "Remote / Part-time",
        compensation: "$25/hr",
        deadline: "Apply by March 1st",
        posted: "2 days ago",
        hot: true,
        tags: ["React", "TypeScript", "Startups"]
    },
    {
        id: "g2",
        role: "UI/UX Designer",
        company: "CreativFlow",
        type: "On-campus / Project based",
        compensation: "$500 Flat",
        deadline: "Rolling applications",
        posted: "5 hours ago",
        hot: false,
        tags: ["Figma", "Branding", "Gigs"]
    },
    {
        id: "g3",
        role: "Data Research Assistant",
        company: "University AI Lab",
        type: "Hybrid / 10 hrs week",
        compensation: "Stipend",
        deadline: "Feb 28th",
        posted: "1 day ago",
        hot: true,
        tags: ["Python", "Research", "Stipend"]
    }
];

export default function HustlePage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-rose-600 flex items-center justify-center shadow-xl shadow-rose-100 relative overflow-hidden shrink-0">
                                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 rotate-12 -translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">The <span className="text-gradient">Hustle</span></h1>
                                <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Opportunity Market</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 md:flex-none rounded-2xl border-slate-100 bg-white hover:bg-slate-50 px-6 md:px-8 h-14 md:h-16 uppercase font-black text-[10px] tracking-widest text-slate-500 transition-all shadow-sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </header>

                <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400">Trending Global Gigs</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <AnimatePresence>
                            {SAMPLE_GIGS.map((gig, index) => (
                                <motion.div
                                    key={gig.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white shadow-lg shadow-slate-200/40 hover:shadow-rose-100/50 transition-all cursor-pointer">
                                        <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="space-y-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className="bg-slate-50 border-slate-100 text-slate-400 font-black text-[7px] md:text-[8px] px-2 md:px-3 h-5 uppercase tracking-widest">
                                                            {gig.type}
                                                        </Badge>
                                                        {gig.hot && (
                                                            <Badge className="bg-rose-50 border-rose-100 text-rose-600 font-black text-[7px] md:text-[8px] px-2 md:px-3 h-5 uppercase tracking-widest animate-pulse">
                                                                Hot
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none group-hover:text-rose-600 transition-colors break-words">
                                                        {gig.role}
                                                    </h2>
                                                    <div className="flex items-center gap-2 pt-1 font-bold text-slate-400 text-[9px] md:text-[10px] uppercase tracking-widest truncate">
                                                        <Building2 className="w-3 h-3 uppercase" /> {gig.company}
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right shrink-0">
                                                    <div className="text-lg font-black text-slate-900 tracking-tight">{gig.compensation}</div>
                                                    <div className="text-[8px] md:text-[9px] font-black text-rose-400 uppercase tracking-widest">{gig.deadline}</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                {gig.tags.map(tag => (
                                                    <Badge key={tag} className="text-[7px] md:text-[8px] bg-slate-50 border-slate-100 text-slate-400 font-black tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase shadow-sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 md:pt-6 border-t border-slate-50 gap-4">
                                                <div className="flex items-center gap-4 font-bold text-slate-300 text-[8px] md:text-[9px] uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    Posted {gig.posted}
                                                </div>
                                                <Button size="lg" className="w-full sm:w-auto rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[9px] md:text-[10px] tracking-widest px-6 md:px-8 h-10 md:h-12 shadow-lg">
                                                    View Details <ExternalLink className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden text-center space-y-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-transparent" />
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-3xl font-black uppercase tracking-tight">Hire Global Talent</h3>
                        <p className="text-white/60 max-w-md mx-auto text-sm font-medium">Looking for collaborators or interns? Post your academic gig to the entire university network.</p>
                        <Button className="bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl px-12 h-16 font-black uppercase text-xs tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">
                            Post Opportunity
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
