"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Plus, MessageSquare, Users as UsersIcon,
    ArrowLeft, Rocket, Code, Lightbulb, Target,
    CheckCircle2, Clock, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getProjects } from "../featureActions";

export default function ForgePage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            const result = await getProjects();
            if (result.success) {
                setProjects(result.projects || []);
            }
            setLoading(false);
        }
        loadProjects();
    }, []);

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.03] blur-[120px] rounded-full" />

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
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 relative overflow-hidden shrink-0">
                                <Terminal className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-500/20 blur-xl" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">The <span className="text-gradient">Forge</span></h1>
                                <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Innovation Incubator</p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full lg:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 md:px-10 h-14 md:h-16 font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Initiate Project
                    </Button>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Terminal className="w-12 h-12 text-slate-100" />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Firing Up Furnaces...</p>
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <AnimatePresence>
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white shadow-lg shadow-slate-200/40 h-full flex flex-col">
                                        <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${project.type === 'Software' ? 'bg-indigo-50 text-indigo-600' : project.type === 'Business' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {project.type === 'Software' ? <Code className="w-4 h-4 md:w-5 md:h-5" /> : project.type === 'Business' ? <Target className="w-4 h-4 md:w-5 md:h-5" /> : <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />}
                                                </div>
                                                <Badge variant="outline" className="border-slate-100 text-slate-400 font-black text-[8px] md:text-[9px] px-2 md:px-3 h-5 md:h-6 uppercase tracking-widest">
                                                    {project.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 md:space-y-2">
                                                <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none group-hover:text-indigo-600 transition-colors truncate">
                                                    {project.name}
                                                </h2>
                                                <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest truncate">Project Lead</p>
                                            </div>

                                            <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-bold italic border-l-2 border-slate-100 pl-4 line-clamp-2 md:line-clamp-none">
                                                &ldquo;{project.vision}&rdquo;
                                            </p>

                                            <div className="space-y-2 md:space-y-3">
                                                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Seeking Talent:</span>
                                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                    {project.needs?.map((skill: string) => (
                                                        <Badge key={skill} className="text-[7px] md:text-[8px] bg-white border-slate-100 text-slate-500 font-black tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase shadow-sm">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0 mt-auto">
                                            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-1.5 md:-space-x-2">
                                                        {[...Array(Math.min(3, project.members_count || 1))].map((_, i) => (
                                                            <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[7px] md:text-[8px] font-black text-slate-400">
                                                                {String.fromCharCode(65 + i)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">+{project.members_count || 1} Team</span>
                                                </div>
                                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest px-4 md:px-6 h-10 md:h-12 shadow-lg shadow-indigo-100">
                                                    Request Seat
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center border border-slate-800 shadow-xl shadow-slate-200 animate-float">
                            <Rocket className="w-10 h-10 text-amber-500" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Forge Is Cold</h3>
                            <p className="text-slate-400 font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">No active innovation projects found. Great ventures start with a single initialization.</p>
                        </div>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-xl transition-all hover:scale-105">
                            <Plus className="w-4 h-4 mr-2" />
                            Initialize Project
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
