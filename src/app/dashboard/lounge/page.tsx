"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, Send, Sparkles, UserCircle,
    ArrowLeft, Hash, Zap, Heart, Share2, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const SAMPLE_POSTS = [
    {
        id: "p1",
        user: "Sarah Chen",
        content: "Just finished the React Architecture workshop. Really impressed by the modular patterns discussed! 🚀",
        time: "12m ago",
        likes: 24,
        replies: 5,
        tag: "Engineering"
    },
    {
        id: "p2",
        user: "Alex Rivera",
        content: "Looking for anyone interested in joining a weekend hackathon focus on Climate Tech. DM me! 🌍",
        time: "45m ago",
        likes: 12,
        replies: 8,
        tag: "HackerMode"
    },
    {
        id: "p3",
        user: "Marcus Gao",
        content: "The library is surprisingly quiet today. Perfect for deep focus sessions. 📚✨",
        time: "2h ago",
        likes: 38,
        replies: 2,
        tag: "Focus"
    }
];

export default function LoungePage() {
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-4xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-100 relative overflow-hidden shrink-0">
                                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 rotate-45 -translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">The <span className="text-gradient">Lounge</span></h1>
                                <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Campus Pulse Feed</p>
                            </div>
                        </div>
                    </div>
                </header>

                <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] border-white shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardContent className="p-5 md:p-8 space-y-4 md:space-y-6">
                        <div className="flex gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                            </div>
                            <div className="flex-1 relative min-w-0">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Share something with the campus..."
                                    className="w-full h-24 md:h-32 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50/50 border border-slate-100 text-sm md:text-base text-slate-700 font-medium outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                                />
                                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex gap-1.5 md:gap-2">
                                    <Button size="icon" variant="ghost" className="w-7 h-7 md:w-8 md:h-8 rounded-lg text-slate-400">
                                        <Hash className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </Button>
                                    <Button size="icon" className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-90">
                                        <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400">Recent Transmissions</span>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <AnimatePresence>
                            {SAMPLE_POSTS.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] border-white shadow-lg shadow-slate-200/30 overflow-hidden group">
                                        <CardContent className="p-5 md:p-8 flex gap-4 md:gap-6">
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                                                <span className="text-lg md:text-xl font-black text-indigo-600">{post.user[0]}</span>
                                            </div>
                                            <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="min-w-0">
                                                        <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase leading-none truncate">{post.user}</h3>
                                                        <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest block mt-1">{post.time} • #{post.tag}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="w-7 h-7 md:w-8 md:h-8 rounded-lg text-slate-300">
                                                        <MoreHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed break-words">{post.content}</p>
                                                <div className="flex items-center gap-4 md:gap-6 pt-1 md:pt-2">
                                                    <button className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                                                        <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" /> {post.likes}
                                                    </button>
                                                    <button className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors">
                                                        <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" /> {post.replies}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors ml-auto">
                                                        <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="text-center py-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200">End of Transmissions</p>
                </div>
            </main>
        </div>
    );
}
