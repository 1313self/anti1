"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Banknote, Clock, MapPin,
    ArrowLeft, ExternalLink, Filter, TrendingUp,
    CheckCircle2, Building2, Calendar, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getGigs, createGig } from "../featureActions";
import { supabase } from "@/lib/supabase";

export default function HustlePage() {
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [showPostModal, setShowPostModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newGig, setNewGig] = useState({
        role: "",
        company: "",
        type: "Part-time",
        compensation: "",
        deadline: "",
        tags: "",
        hot: false
    });

    const loadGigs = async () => {
        setLoading(true);
        const result = await getGigs();
        if (result.success) {
            setGigs(result.gigs || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadGigs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to post an opportunity.");
                return;
            }

            const result = await createGig({
                ...newGig,
                tags: newGig.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
                user_id: user.id
            });

            if (result.success) {
                setShowPostModal(false);
                setNewGig({ role: "", company: "", type: "Part-time", compensation: "", deadline: "", tags: "", hot: false });
                loadGigs();
            } else {
                alert("Posting failed: " + result.error);
            }
        } catch (err) {
            alert("An error occurred while posting.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-heading font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-neon relative overflow-hidden shrink-0">
                                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground z-10" />
                                <div className="absolute inset-0 bg-white/10 rotate-12 -translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase text-foreground truncate">The <span className="text-gradient">Hustle</span></h1>
                                <p className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Opportunity Market</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => setShowPostModal(true)}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-widest rounded-2xl px-8 h-14 md:h-16 shadow-neon transition-all hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Post Opportunity
                        </Button>
                    </div>
                </header>

                <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground">Available Gigs</span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <Briefcase className="w-12 h-12 text-muted-foreground/20" />
                            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Opportunities...</p>
                        </div>
                    ) : gigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {gigs.map((gig, index) => (
                                    <motion.div
                                        key={gig.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white/5 shadow-lg hover:shadow-primary/20 transition-all cursor-pointer h-full">
                                            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 flex flex-col h-full">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                    <div className="space-y-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className="bg-secondary border-secondary text-muted-foreground font-bold text-[7px] md:text-[8px] px-2 md:px-3 h-5 uppercase tracking-widest">
                                                                {gig.type}
                                                            </Badge>
                                                            {gig.hot && (
                                                                <Badge className="bg-primary/20 border-primary/20 text-primary font-bold text-[7px] md:text-[8px] px-2 md:px-3 h-5 uppercase tracking-widest animate-pulse">
                                                                    Hot
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h2 className="text-xl md:text-2xl font-heading font-black text-foreground uppercase tracking-tight leading-none group-hover:text-primary transition-colors break-words">
                                                            {gig.role}
                                                        </h2>
                                                        <div className="flex items-center gap-2 pt-1 font-bold text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-widest truncate">
                                                            <Building2 className="w-3 h-3 uppercase" /> {gig.company}
                                                        </div>
                                                    </div>
                                                    <div className="text-left sm:text-right shrink-0">
                                                        <div className="text-lg font-black text-foreground tracking-tight">{gig.compensation}</div>
                                                        <div className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{gig.deadline}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 md:gap-2 flex-grow">
                                                    {gig.tags?.map((tag: string) => (
                                                        <Badge key={tag} className="text-[7px] md:text-[8px] bg-secondary border-secondary text-secondary-foreground font-bold tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase shadow-sm">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 md:pt-6 border-t border-white/5 gap-4">
                                                    <div className="flex items-center gap-4 font-bold text-muted-foreground text-[8px] md:text-[9px] uppercase tracking-widest">
                                                        <Calendar className="w-3 h-3" />
                                                        Posted {new Date(gig.created_at).toLocaleDateString()}
                                                    </div>
                                                    <Button size="lg" className="w-full sm:w-auto rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold uppercase text-[9px] md:text-[10px] tracking-widest px-6 md:px-8 h-10 md:h-12 shadow-lg">
                                                        View Details <ExternalLink className="w-4 h-4 ml-2" />
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
                            <div className="w-24 h-24 rounded-[2rem] bg-secondary/50 flex items-center justify-center border border-white/5 shadow-xl animate-float">
                                <Briefcase className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-foreground uppercase tracking-tighter">Market Is Quiet</h3>
                                <p className="text-muted-foreground font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">No active campus gigs found. The professional network is ready for the first opportunity.</p>
                            </div>
                            <Button
                                onClick={() => setShowPostModal(true)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-neon transition-all hover:scale-105"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Post Opportunity
                            </Button>
                        </div>
                    )}
                </div>

                <div className="glass p-10 rounded-[2.5rem] relative overflow-hidden text-center space-y-6 border-primary/20">
                    <div className="absolute inset-0 bg-primary/5" />
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-3xl font-heading font-black uppercase tracking-tight text-foreground">Hire Campus Talent</h3>
                        <p className="text-muted-foreground max-w-md mx-auto text-sm font-medium">Looking for collaborators or interns? Post your academic gig to the entire university network.</p>
                        <Button
                            onClick={() => setShowPostModal(true)}
                            className="bg-foreground text-background hover:bg-foreground/90 rounded-2xl px-12 h-16 font-bold uppercase text-xs tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Post Opportunity
                        </Button>
                    </div>
                </div>
            </main>

            {/* Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPostModal(false)}
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
                                    <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Post Opportunity</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Connect with Campus Talent</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Role/Title</label>
                                                <Input
                                                    required
                                                    value={newGig.role}
                                                    onChange={e => setNewGig({ ...newGig, role: e.target.value })}
                                                    placeholder="E.G. WEB DEVELOPER"
                                                    className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Company/Project</label>
                                                <Input
                                                    required
                                                    value={newGig.company}
                                                    onChange={e => setNewGig({ ...newGig, company: e.target.value })}
                                                    placeholder="E.G. TECH SOC"
                                                    className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                                <select
                                                    value={newGig.type}
                                                    onChange={e => setNewGig({ ...newGig, type: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 h-12 text-xs uppercase font-bold tracking-widest px-3 bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                                                >
                                                    <option className="bg-slate-900 text-foreground">Part-time</option>
                                                    <option className="bg-slate-900 text-foreground">Full-time</option>
                                                    <option className="bg-slate-900 text-foreground">Internship</option>
                                                    <option className="bg-slate-900 text-foreground">Freelance</option>
                                                    <option className="bg-slate-900 text-foreground">One-time</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Compensation</label>
                                                <Input
                                                    required
                                                    value={newGig.compensation}
                                                    onChange={e => setNewGig({ ...newGig, compensation: e.target.value })}
                                                    placeholder="E.G. $20/HR OR STIPEND"
                                                    className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Deadline</label>
                                            <Input
                                                required
                                                value={newGig.deadline}
                                                onChange={e => setNewGig({ ...newGig, deadline: e.target.value })}
                                                placeholder="E.G. FEB 28, 2026"
                                                className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tags (Comma separated)</label>
                                            <Input
                                                value={newGig.tags}
                                                onChange={e => setNewGig({ ...newGig, tags: e.target.value })}
                                                placeholder="E.G. REACT, TAILWIND, REMOTE"
                                                className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 pt-2">
                                            <input
                                                type="checkbox"
                                                id="hot-gig"
                                                checked={newGig.hot}
                                                onChange={e => setNewGig({ ...newGig, hot: e.target.checked })}
                                                className="w-5 h-5 rounded border-white/10 bg-secondary/50 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <label htmlFor="hot-gig" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer">Mark as "Hot" Opportunity (Urgent)</label>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowPostModal(false)}
                                            className="flex-1 rounded-xl h-14 uppercase font-bold text-[10px] tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={submitting}
                                            className="flex-2 rounded-xl h-14 bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest shadow-neon hover:scale-105 transition-all"
                                        >
                                            {submitting ? "Processing..." : "Deploy Hustle"}
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
