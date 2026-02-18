"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Search, Download, Bookmark,
    Share2, Filter, ArrowLeft, Library as LibraryIcon,
    Sparkles, ExternalLink, FileText, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getResources, createResource } from "../featureActions";
import { supabase } from "@/lib/supabase";

export default function LibraryPage() {
    const [search, setSearch] = useState("");
    const [bookmarked, setBookmarked] = useState<string[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);

    // Modal & Form State
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newResource, setNewResource] = useState({
        title: "",
        type: "Notes",
        author_name: "",
        university: "",
        tags: ""
    });

    const loadResources = async () => {
        setLoading(true);
        const result = await getResources();
        if (result.success) {
            setResources(result.resources || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadResources();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to submit a resource.");
                return;
            }

            const result = await createResource({
                ...newResource,
                tags: newResource.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
                user_id: user.id
            });

            if (result.success) {
                setShowSubmitModal(false);
                setNewResource({ title: "", type: "Notes", author_name: "", university: "", tags: "" });
                loadResources();
            } else {
                alert("Submission failed: " + result.error);
            }
        } catch (err) {
            alert("An error occurred during submission.");
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = resources.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.tags && r.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
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
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 relative overflow-hidden shrink-0">
                                <LibraryIcon className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 -rotate-45 translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">The <span className="text-gradient">Library</span></h1>
                                <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Academic Resource Depot</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex bg-white/80 backdrop-blur-xl border border-white p-1.5 md:p-2 rounded-xl md:rounded-2xl w-full lg:w-96 shadow-lg shadow-slate-200/50">
                            <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-300 ml-2 md:ml-3 mr-2 my-auto" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="SEARCH RESOURCES..."
                                className="border-none bg-transparent shadow-none focus-visible:ring-0 uppercase font-black text-[9px] md:text-[10px] tracking-widest text-slate-800 h-9 md:h-10"
                            />
                        </div>
                        <Button
                            onClick={() => setShowSubmitModal(true)}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl px-6 h-12 shadow-lg transition-all hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit
                        </Button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <LibraryIcon className="w-12 h-12 text-slate-100" />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Synchronizing Archives...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((resource, index) => (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white shadow-lg shadow-slate-200/40 hover:shadow-indigo-100/50 transition-all h-full">
                                        <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start">
                                                <Badge className="bg-indigo-50 border-indigo-100 text-indigo-600 font-black text-[8px] md:text-[9px] px-2 md:px-3 h-5 md:h-6 uppercase">
                                                    {(resource.type || 'resource').toUpperCase()}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl transition-all ${bookmarked.includes(resource.id) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-200 hover:text-indigo-400'}`}
                                                    onClick={() => toggleBookmark(resource.id)}
                                                >
                                                    <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${bookmarked.includes(resource.id) ? 'fill-current' : ''}`} />
                                                </Button>
                                            </div>

                                            <div className="space-y-2 flex-grow">
                                                <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors break-words">
                                                    {resource.title}
                                                </h2>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest truncate">
                                                    <FileText className="w-3 h-3" />
                                                    {resource.author_name ? `By ${resource.author_name}` : 'Shared Resource'} {resource.university && `• ${resource.university}`}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                {resource.tags?.map((tag: string) => (
                                                    <Badge key={tag} className="text-[7px] md:text-[8px] bg-slate-50 border-slate-100 text-slate-400 font-black tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-50 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-300 tracking-widest">Downloads</span>
                                                        <span className="text-[11px] md:text-xs font-black text-slate-800">{resource.downloads || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button className="flex-1 sm:flex-none rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[9px] md:text-[10px] tracking-widest px-4 md:px-6 h-10 md:h-12 shadow-lg w-full sm:w-auto">
                                                        <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xl shadow-slate-100 animate-float">
                            <BookOpen className="w-10 h-10 text-slate-200" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Library Is Silent</h3>
                            <p className="text-slate-400 font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">No real-world resources are currently available in the archives. Be the first to initialize the network with shared knowledge.</p>
                        </div>
                        <Button
                            onClick={() => setShowSubmitModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-xl transition-all hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit Resource
                        </Button>
                    </div>
                )}
            </main>

            {/* Submission Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSubmitModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
                        >
                            <div className="p-8 md:p-10 space-y-8">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Submit Resource</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contribute to the Archive</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                                            <Input
                                                required
                                                value={newResource.title}
                                                onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                placeholder="E.G. ADVANCED CALCULUS NOTES"
                                                className="rounded-xl border-slate-100 h-12 text-xs uppercase font-bold tracking-widest"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                                <select
                                                    value={newResource.type}
                                                    onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                                                    className="w-full rounded-xl border border-slate-100 h-12 text-xs uppercase font-bold tracking-widest px-3 bg-white outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                                                >
                                                    <option>Notes</option>
                                                    <option>Slides</option>
                                                    <option>Ebook</option>
                                                    <option>Exam</option>
                                                    <option>Guide</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                                                <Input
                                                    required
                                                    value={newResource.author_name}
                                                    onChange={e => setNewResource({ ...newResource, author_name: e.target.value })}
                                                    placeholder="YOUR NAME"
                                                    className="rounded-xl border-slate-100 h-12 text-xs uppercase font-bold tracking-widest"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">University</label>
                                            <Input
                                                required
                                                value={newResource.university}
                                                onChange={e => setNewResource({ ...newResource, university: e.target.value })}
                                                placeholder="E.G. HARVARD"
                                                className="rounded-xl border-slate-100 h-12 text-xs uppercase font-bold tracking-widest"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Tags (Comma separated)</label>
                                            <Input
                                                value={newResource.tags}
                                                onChange={e => setNewResource({ ...newResource, tags: e.target.value })}
                                                placeholder="E.G. MATH, CS, SEMESTER 1"
                                                className="rounded-xl border-slate-100 h-12 text-xs uppercase font-bold tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowSubmitModal(false)}
                                            className="flex-1 rounded-xl h-14 uppercase font-black text-[10px] tracking-widest text-slate-400"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={submitting}
                                            className="flex-2 rounded-xl h-14 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
                                        >
                                            {submitting ? "Processing..." : "Submit to Vault"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
