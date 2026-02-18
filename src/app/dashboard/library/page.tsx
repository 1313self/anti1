"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Search, Download, Bookmark,
    Share2, Filter, ArrowLeft, Library as LibraryIcon,
    Sparkles, ExternalLink, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const SAMPLE_RESOURCES = [
    {
        id: "r1",
        title: "Advanced Data Structures & Algorithms",
        type: "Notes",
        author: "Alex Rivera",
        university: "Tech Institute",
        tags: ["CS", "Theory"],
        downloads: 124,
        date: "2 days ago"
    },
    {
        id: "r2",
        title: "Modern UI/UX Design Principles",
        type: "Guide",
        author: "Sarah Chen",
        university: "Design Academy",
        tags: ["Design", "UX"],
        downloads: 89,
        date: "5 days ago"
    },
    {
        id: "r3",
        title: "Blockchain for Supply Chain",
        type: "Whitepaper",
        author: "Michael Ross",
        university: "Global Business",
        tags: ["Finance", "Crypto"],
        downloads: 45,
        date: "1 week ago"
    },
    {
        id: "r4",
        title: "Quantum Computing 101",
        type: "Lecture",
        author: "Dr. Elena Vance",
        university: "Science Lab",
        tags: ["Physics", "Computing"],
        downloads: 210,
        date: "3 days ago"
    }
];

export default function LibraryPage() {
    const [search, setSearch] = useState("");
    const [bookmarked, setBookmarked] = useState<string[]>([]);

    const filtered = SAMPLE_RESOURCES.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    const toggleBookmark = (id: string) => {
        setBookmarked(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 relative overflow-hidden">
                                <LibraryIcon className="w-8 h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 -rotate-45 translate-y-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">The <span className="text-gradient">Library</span></h1>
                                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Shared Knowledge Depot</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white/80 backdrop-blur-xl border border-white p-2 rounded-2xl w-full md:w-96 shadow-lg shadow-slate-200/50">
                        <Search className="w-5 h-5 text-slate-300 ml-3 mr-2 my-auto" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="SEARCH RESOURCES..."
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 uppercase font-black text-[10px] tracking-widest text-slate-800 h-10"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {filtered.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass-card rounded-[2.5rem] overflow-hidden group border-white shadow-lg shadow-slate-200/40 hover:shadow-indigo-100/50 transition-all">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 font-black text-[9px] px-3 h-6">
                                                {resource.type.toUpperCase()}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-xl transition-all ${bookmarked.includes(resource.id) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-200 hover:text-indigo-400'}`}
                                                onClick={() => toggleBookmark(resource.id)}
                                            >
                                                <Bookmark className={`w-5 h-5 ${bookmarked.includes(resource.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                {resource.title}
                                            </h2>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <FileText className="w-3 h-3" />
                                                By {resource.author} • {resource.university}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {resource.tags.map(tag => (
                                                <Badge key={tag} className="text-[8px] bg-slate-50 border-slate-100 text-slate-400 font-black tracking-widest px-2 h-5 uppercase">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Downloads</span>
                                                    <span className="text-xs font-black text-slate-800">{resource.downloads}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Shared</span>
                                                    <span className="text-xs font-black text-slate-800">{resource.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline" className="rounded-xl border-slate-100 hover:bg-slate-50">
                                                    <Share2 className="w-4 h-4 text-slate-400" />
                                                </Button>
                                                <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest px-6 h-12 shadow-lg">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Get File
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                            <LibraryIcon className="w-10 h-10 text-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">No resources matched</h3>
                            <p className="text-slate-500 font-medium max-w-xs mx-auto">Try a different keyword or major.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
