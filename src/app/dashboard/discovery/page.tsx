"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Target, UserPlus, Users, Info, Radar, Loader2, Zap, Instagram, ExternalLink, SlidersHorizontal, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { findConnections } from "./actions";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { DiscoveryMatch } from "@/lib/types";
import { DiscoveryCardSkeleton } from "@/components/ui/skeleton";

const ACADEMIC_AIMS = ["Any", "Computer Science", "Design", "Business", "Law", "BioTech", "Fine Arts", "Engineering", "Psychology", "Intl Relations"];
const PEAK_HOURS_OPTIONS = ["Any", "morning", "night"];

export default function DiscoveryPage() {
    const { toast } = useToast();
    const [connections, setConnections] = useState<DiscoveryMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Filters & Search
    const [search, setSearch] = useState("");
    const [peakFilter, setPeakFilter] = useState("Any");
    const [aimFilter, setAimFilter] = useState("Any");

    const filtered = useMemo(() => connections.filter(c => {
        const matchesSearch = c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            c.academic_aim?.toLowerCase().includes(search.toLowerCase()) ||
            (c.hobbies && c.hobbies.some(h => h.toLowerCase().includes(search.toLowerCase()))) ||
            ((c as any).skills && (c as any).skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));
        const matchesPeak = peakFilter === "Any" || c.peak_hours === peakFilter;
        const matchesAim = aimFilter === "Any" || c.academic_aim?.toLowerCase().includes(aimFilter.toLowerCase());

        return matchesSearch && matchesPeak && matchesAim;
    }), [connections, search, peakFilter, aimFilter]);

    const hasFilters = peakFilter !== "Any" || aimFilter !== "Any" || search !== "";

    useEffect(() => {
        async function getConnections() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setError("Please log in to initiate discovery.");
                    setLoading(false);
                    return;
                }
                setCurrentUser(user);

                const result = await findConnections(user.id);
                if (result.success) {
                    setConnections(result.connections || []);
                    if (result.remainingAttempts !== undefined) {
                        setRemainingAttempts(result.remainingAttempts);
                    }
                } else {
                    setError(result.error || "Connection protocol failed.");
                }
            } catch (err) {
                setError("An unexpected error occurred during discovery.");
            } finally {
                setLoading(false);
            }
        }

        getConnections();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-sm animate-float">
                    <Info className="w-8 h-8 text-rose-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Synergy Engine Offline</h2>
                    <p className="text-muted-foreground font-bold max-w-xs">{error}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="rounded-xl px-8 h-12 uppercase font-black text-[10px] tracking-widest border-border text-muted-foreground hover:bg-accent" onClick={() => window.location.reload()}>Retry Diagnostics</Button>
                    <Link href="/onboarding">
                        <Button className="rounded-xl px-8 h-12 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/10">
                            {error.includes("not found") ? "Initialize Profile" : "Update Profile Bio"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 relative overflow-hidden shrink-0">
                        <Target className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground z-10" />
                        <div className="absolute inset-0 bg-white/10 rotate-45 translate-y-8" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-foreground truncate">Discover <span className="text-gradient">People</span></h1>
                        <p className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">
                            {loading ? "Scanning orbit..." : `${filtered.length} Recommendations found`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex glass p-1.5 rounded-xl md:rounded-2xl w-full lg:w-80 shadow-lg shadow-black/5">
                        <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2 my-auto" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search names or skills..."
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 font-black text-[9px] md:text-[10px] tracking-widest text-foreground placeholder:text-muted-foreground/50 h-9 md:h-11"
                        />
                    </div>
                    {remainingAttempts !== null && (
                        <div className="flex items-center justify-center gap-2 px-4 h-11 md:h-14 rounded-2xl bg-primary/5 border border-primary/10">
                            <Zap className={`w-3.5 h-3.5 ${remainingAttempts > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                AI Hub: <span className={remainingAttempts > 0 ? "text-primary" : "text-muted-foreground"}>{remainingAttempts}/3</span>
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border pb-6 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
                    <SlidersHorizontal className="w-3 h-3" />
                    Refine Radar:
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {PEAK_HOURS_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setPeakFilter(opt)} className={`shrink-0 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${peakFilter === opt ? "bg-primary text-primary-foreground border-primary shadow-lg" : "border-border text-muted-foreground hover:bg-accent"
                            }`}>
                            {opt === "morning" ? "☀️ Day" : opt === "night" ? "🌙 Night" : "⏱ All Time"}
                        </button>
                    ))}
                    <span className="text-border mx-1">|</span>
                    <select
                        value={aimFilter}
                        onChange={e => setAimFilter(e.target.value)}
                        className="rounded-xl border border-border bg-secondary/50 text-foreground text-[9px] font-black uppercase tracking-widest px-4 h-9 outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all"
                    >
                        {ACADEMIC_AIMS.map(a => <option key={a} className="bg-card text-foreground">{a}</option>)}
                    </select>
                </div>
                {hasFilters && (
                    <button onClick={() => { setPeakFilter("Any"); setAimFilter("Any"); setSearch(""); }} className="ml-auto text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
                        Reset Radar ×
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]">
                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6].map(i => <DiscoveryCardSkeleton key={i} />)}
                    </>
                ) : filtered.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((connection, index) => (
                            <motion.div
                                key={connection.id}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full"
                            >
                                <Card className="glass-card rounded-[2.5rem] overflow-hidden group h-full flex flex-col border-border shadow-2xl transition-all hover:border-primary/30">
                                    <div className="relative h-32 md:h-40 bg-gradient-to-br from-primary/5 to-secondary/50 flex items-center justify-center border-b border-border">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-background border border-border flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <span className="text-2xl md:text-3xl font-black text-foreground">{connection.full_name ? connection.full_name[0] : "U"}</span>
                                            <div className="absolute inset-[-4px] rounded-full border border-primary/20 animate-pulse opacity-50" />
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-background/80 backdrop-blur-md border border-primary/20 text-primary font-black text-[8px] md:text-[9px] px-2.5 h-6 shadow-sm">
                                                {connection.compatibility_score}% MATCH
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col">
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-none uppercase truncate">{connection.full_name || "Nexus User"}</h2>
                                            <p className="text-primary font-mono text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] truncate">{connection.academic_aim || "University Student"}</p>
                                        </div>

                                        <div className="bg-secondary/40 border border-border rounded-2xl p-4 flex-1">
                                            <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed font-bold italic line-clamp-4">
                                                &ldquo;{connection.connection_reason || "You share overlapping skillsets and academic objectives."}&rdquo;
                                            </p>
                                        </div>

                                        {/* Skills & Hobbies */}
                                        <div className="space-y-3">
                                            {(connection as any).skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(connection as any).skills.slice(0, 4).map((skill: string) => (
                                                        <Badge key={skill} className="text-[7px] md:text-[8px] bg-primary/10 border-primary/20 text-primary font-black tracking-widest px-2 h-5 uppercase shadow-sm">
                                                            <Sparkles className="w-2.5 h-2.5 mr-1" />
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-1.5">
                                                {connection.hobbies?.slice(0, 3).map((tag: string) => (
                                                    <Badge key={tag} className="text-[7px] md:text-[8px] bg-secondary border-border text-muted-foreground font-black tracking-widest px-2 h-5 uppercase shadow-sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-auto">
                                            {connection.instagram ? (
                                                <Button
                                                    asChild
                                                    className="w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase text-[10px] tracking-widest shadow-xl h-12 md:h-14 border-0 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <a
                                                        href={connection.instagram.startsWith('http') ? connection.instagram : `https://instagram.com/${connection.instagram.replace('@', '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Instagram className="w-4 h-4 mr-2" />
                                                        Connect Profile
                                                    </a>
                                                </Button>
                                            ) : (
                                                <Button disabled className="w-full rounded-2xl bg-secondary/50 text-muted-foreground font-black uppercase text-[10px] tracking-widest h-12 md:h-14 cursor-not-allowed border-dashed border-border border-2">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Social Locked
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-secondary flex items-center justify-center border border-border shadow-xl animate-float">
                            <Radar className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">No Matches Detected</h3>
                            <p className="text-muted-foreground font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">Adjust your radar filters or update your bio to find peer connections.</p>
                        </div>
                        {hasFilters && (
                            <Button onClick={() => { setPeakFilter("Any"); setAimFilter("Any"); setSearch(""); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-neon transition-all hover:scale-105">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
