"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Target, UserPlus, Users, Info, Radar, Loader2, Zap, Instagram, ExternalLink, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { findConnections } from "./actions";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

const ACADEMIC_AIMS = ["Any", "Computer Science", "Design", "Business", "Law", "BioTech", "Fine Arts", "Engineering", "Psychology", "Intl Relations"];
const PEAK_HOURS_OPTIONS = ["Any", "morning", "night"];

export default function DiscoveryPage() {
    const { toast } = useToast();
    const [connections, setConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Filters
    const [peakFilter, setPeakFilter] = useState("Any");
    const [aimFilter, setAimFilter] = useState("Any");

    const filtered = useMemo(() => connections.filter(c => {
        if (peakFilter !== "Any" && c.peak_hours !== peakFilter) return false;
        if (aimFilter !== "Any" && !c.academic_aim?.toLowerCase().includes(aimFilter.toLowerCase())) return false;
        return true;
    }), [connections, peakFilter, aimFilter]);
    const hasFilters = peakFilter !== "Any" || aimFilter !== "Any";

    useEffect(() => {
        async function getConnections() {
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
                    if (result.onboardingRequired) {
                        // Allow specific UI handling for missing profile
                        (window as any).onboardingRequired = true;
                    }
                }
            } catch (err) {
                setError("An unexpected error occurred during discovery.");
            } finally {
                setLoading(false);
            }
        }

        getConnections();
    }, []);



    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative overflow-hidden rounded-[3rem] bg-white/50 border border-slate-100">
                <div className="radar-sweep opacity-10" />
                <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center animate-bounce shadow-sm">
                        <Radar className="w-10 h-10 text-indigo-600" />
                    </div>
                </div>
                <div className="space-y-2 text-center z-10">
                    <p className="text-slate-800 font-black tracking-[0.2em] uppercase text-xs">Scanning Campus Orbit</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest animate-pulse font-bold">Analyzing Synergy Matrices...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm animate-float">
                    <Info className="w-8 h-8 text-rose-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Synergy Engine Offline</h3>
                    <p className="text-slate-500 font-bold max-w-xs">{error}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="rounded-xl px-8 h-12 uppercase font-black text-[10px] tracking-widest border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => window.location.reload()}>Retry Diagnostics</Button>
                    <Link href="/onboarding">
                        <Button className="rounded-xl px-8 h-12 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100">
                            {error.includes("not found") ? "Initialize Profile" : "Update Profile Bio"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 relative overflow-hidden shrink-0">
                        <Target className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                        <div className="absolute inset-0 bg-white/10 rotate-45 translate-y-8" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">Discover <span className="text-gradient">People</span></h1>
                        <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">{filtered.length} of {connections.length} Recommendations</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {remainingAttempts !== null && (
                        <div className="flex items-center justify-center gap-2 px-4 h-12 md:h-14 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <Zap className={`w-4 h-4 ${remainingAttempts > 0 ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                AI Credits: <span className={remainingAttempts > 0 ? "text-indigo-600" : "text-slate-400"}>{remainingAttempts}/3</span>
                            </span>
                        </div>
                    )}
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-12 md:h-14 font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 shadow-xl"
                    >
                        <Radar className="w-4 h-4 mr-2" />
                        Refresh Radar
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    <SlidersHorizontal className="w-3 h-3" />
                    Filters:
                </div>
                {/* Peak hours */}
                <div className="flex items-center gap-1.5">
                    {PEAK_HOURS_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setPeakFilter(opt)} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${peakFilter === opt ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                            }`}>
                            {opt === "morning" ? "☀️ Morning" : opt === "night" ? "🌙 Night" : "⏱ Any Hours"}
                        </button>
                    ))}
                </div>
                <span className="text-border">·</span>
                {/* Academic aim */}
                <select
                    value={aimFilter}
                    onChange={e => setAimFilter(e.target.value)}
                    className="rounded-xl border border-border bg-secondary/50 text-foreground text-[9px] font-black uppercase tracking-widest px-3 h-8 outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all"
                >
                    {ACADEMIC_AIMS.map(a => <option key={a} className="bg-card text-foreground">{a}</option>)}
                </select>
                {hasFilters && (
                    <button onClick={() => { setPeakFilter("Any"); setAimFilter("Any"); }} className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
                        Clear ×
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatePresence>
                    {filtered.map((connection, index) => (
                        <motion.div
                            key={connection.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group h-full flex flex-col border-white shadow-lg shadow-slate-200/40">
                                <div className="relative h-32 md:h-44 bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center border-b border-white">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center relative shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-2xl md:text-3xl font-black text-slate-800">{connection.full_name ? connection.full_name[0] : "U"}</span>
                                        <div className="absolute inset-[-4px] rounded-full border border-indigo-200 animate-pulse opacity-50" />
                                    </div>
                                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                                        <Badge className="bg-white border-slate-100 text-indigo-600 font-black text-[8px] md:text-[9px] px-2 md:px-3 h-5 md:h-6 shadow-sm">
                                            {connection.compatibility_score}% COMPATIBLE
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-5 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col min-w-0">
                                    <div className="space-y-1">
                                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none uppercase truncate">{connection.full_name || "Unknown User"}</h2>
                                        <p className="text-indigo-600 font-mono text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] truncate">{connection.academic_aim || "University Student"}</p>
                                    </div>

                                    <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl md:rounded-2xl p-3 md:p-4">
                                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-bold italic line-clamp-3">
                                            &ldquo;{connection.connection_reason || "You share similar interests."}&rdquo;
                                        </p>
                                    </div>



                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {connection.hobbies?.slice(0, 3).map((tag: string) => (
                                            <Badge key={tag} className="text-[7px] md:text-[8px] bg-slate-50 border-slate-100 text-slate-400 font-black tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        {connection.instagram && (
                                            <a
                                                href={connection.instagram.startsWith('http') ? connection.instagram : `https://instagram.com/${connection.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full rounded-xl border-pink-100 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all h-8 md:h-10 text-slate-400"
                                                >
                                                    <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </Button>
                                            </a>
                                        )}
                                        {connection.discord && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 rounded-xl border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all h-8 md:h-10 text-slate-400"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(connection.discord);
                                                    toast(`Discord copied: ${connection.discord}`, "success");
                                                }}
                                            >
                                                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="pt-2 md:pt-4 mt-auto">
                                        {connection.instagram ? (
                                            <a
                                                href={connection.instagram.startsWith('http') ? connection.instagram : `https://instagram.com/${connection.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full"
                                            >
                                                <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg shadow-pink-100 h-10 md:h-12 border-0">
                                                    <Instagram className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                    Connect on Instagram
                                                </Button>
                                            </a>
                                        ) : (
                                            <Button disabled className="w-full rounded-xl bg-slate-100 text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest h-10 md:h-12 cursor-not-allowed">
                                                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                No Socials Linked
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {connections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                        <Users className="w-10 h-10 text-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">No connections found</h3>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto">Update your intro to help our engine find better matches for you.</p>
                    </div>
                    <Link href="/onboarding" passHref legacyBehavior>
                        <Button asChild variant="outline" className="rounded-xl px-10 h-14 uppercase font-black text-xs tracking-widest border-slate-200 hover:bg-slate-50 transition-all">
                            <a className="flex items-center justify-center w-full h-full">Update My Bio</a>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
