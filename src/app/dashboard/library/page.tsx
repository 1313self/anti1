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
import { useToast } from "@/components/ui/toast";

export default function LibraryPage() {
    const { toast } = useToast();
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
                toast("Please log in to submit a resource.", "error");
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
                toast("Resource submitted successfully!", "success");
                loadResources();
            } else {
                toast("Submission failed: " + result.error, "error");
            }
        } catch (err) {
            toast("An error occurred during submission.", "error");
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
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-heading font-bold uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-neon relative overflow-hidden shrink-0">
                                <LibraryIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground z-10" />
                                <div className="absolute inset-0 bg-white/10 -rotate-45 translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase text-foreground truncate">The <span className="text-gradient">Library</span></h1>
                                <p className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Academic Resource Depot</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex glass p-1.5 md:p-2 rounded-xl md:rounded-2xl w-full lg:w-96 shadow-lg shadow-black/5">
                            <Search className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground ml-2 md:ml-3 mr-2 my-auto" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="SEARCH RESOURCES..."
                                className="border-none bg-transparent shadow-none focus-visible:ring-0 uppercase font-bold text-[9px] md:text-[10px] tracking-widest text-foreground placeholder:text-muted-foreground/50 h-9 md:h-10"
                            />
                        </div>
                        <Button
                            onClick={() => setShowSubmitModal(true)}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-widest rounded-xl px-6 h-12 shadow-neon transition-all hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit
                        </Button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <LibraryIcon className="w-12 h-12 text-muted-foreground/20" />
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Archives...</p>
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
                                    <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white/5 hover:border-primary/20 transition-all h-full">
                                        <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start">
                                                <Badge className="bg-primary/10 border-primary/20 text-primary font-bold text-[8px] md:text-[9px] px-2 md:px-3 h-5 md:h-6 uppercase">
                                                    {(resource.type || 'resource').toUpperCase()}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl transition-all ${bookmarked.includes(resource.id) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'}`}
                                                    onClick={() => toggleBookmark(resource.id)}
                                                >
                                                    <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${bookmarked.includes(resource.id) ? 'fill-current' : ''}`} />
                                                </Button>
                                            </div>

                                            <div className="space-y-2 flex-grow">
                                                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground uppercase tracking-tight leading-tight group-hover:text-primary transition-colors break-words">
                                                    {resource.title}
                                                </h2>
                                                <div className="flex items-center gap-2 text-muted-foreground font-bold text-[9px] md:text-[10px] uppercase tracking-widest truncate">
                                                    <FileText className="w-3 h-3" />
                                                    {resource.author_name ? `By ${resource.author_name}` : 'Shared Resource'} {resource.university && `• ${resource.university}`}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                {resource.tags?.map((tag: string) => (
                                                    <Badge key={tag} className="text-[7px] md:text-[8px] bg-secondary border-secondary text-secondary-foreground font-bold tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/5 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] md:text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Downloads</span>
                                                        <span className="text-[11px] md:text-xs font-bold text-foreground">{resource.downloads || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button className="flex-1 sm:flex-none rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold uppercase text-[9px] md:text-[10px] tracking-widest px-4 md:px-6 h-10 md:h-12 shadow-lg w-full sm:w-auto">
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
                        <div className="w-24 h-24 rounded-[2rem] bg-secondary/50 flex items-center justify-center border border-white/5 shadow-xl animate-float">
                            <BookOpen className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-foreground uppercase tracking-tighter">Library Is Silent</h3>
                            <p className="text-muted-foreground font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">No real-world resources are currently available in the archives. Be the first to initialize the network with shared knowledge.</p>
                        </div>
                        <Button
                            onClick={() => setShowSubmitModal(true)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-neon transition-all hover:scale-105"
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
                        >
                            <div className="p-8 md:p-10 space-y-8">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Submit Resource</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contribute to the Archive</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                                            <Input
                                                required
                                                value={newResource.title}
                                                onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                placeholder="E.G. ADVANCED CALCULUS NOTES"
                                                className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                                <select
                                                    value={newResource.type}
                                                    onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 h-12 text-xs uppercase font-bold tracking-widest px-3 bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                                                >
                                                    <option className="bg-slate-900 text-foreground">Notes</option>
                                                    <option className="bg-slate-900 text-foreground">Slides</option>
                                                    <option className="bg-slate-900 text-foreground">Ebook</option>
                                                    <option className="bg-slate-900 text-foreground">Exam</option>
                                                    <option className="bg-slate-900 text-foreground">Guide</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Author</label>
                                                <Input
                                                    required
                                                    value={newResource.author_name}
                                                    onChange={e => setNewResource({ ...newResource, author_name: e.target.value })}
                                                    placeholder="YOUR NAME"
                                                    className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">University</label>
                                            <Input
                                                required
                                                value={newResource.university}
                                                onChange={e => setNewResource({ ...newResource, university: e.target.value })}
                                                placeholder="E.G. HARVARD"
                                                className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tags (Comma separated)</label>
                                            <Input
                                                value={newResource.tags}
                                                onChange={e => setNewResource({ ...newResource, tags: e.target.value })}
                                                placeholder="E.G. MATH, CS, SEMESTER 1"
                                                className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowSubmitModal(false)}
                                            className="flex-1 rounded-xl h-14 uppercase font-bold text-[10px] tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={submitting}
                                            className="flex-2 rounded-xl h-14 bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest shadow-neon hover:scale-105 transition-all"
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
