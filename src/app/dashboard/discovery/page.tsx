"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { findConnections, generateIcebreaker } from "./actions";
import { supabase } from "@/lib/supabase";
import { Loader2, Radar, Target, UserPlus, X, Users, Info } from "lucide-react";

export default function DiscoveryPage() {
    const [connections, setConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [icebreakers, setIcebreakers] = useState<Record<string, string>>({});
    const [icebreakerLoading, setIcebreakerLoading] = useState<Record<string, boolean>>({});
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        async function getConnections() {
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
            } else {
                setError(result.error || "Alignment protocol failed.");
            }
            setLoading(false);
        }

        getConnections();
    }, []);

    const handleGetIcebreaker = async (connectionId: string) => {
        if (!currentUser) return;
        setIcebreakerLoading(prev => ({ ...prev, [connectionId]: true }));
        const result = await generateIcebreaker(connectionId, currentUser.id);
        setIcebreakerLoading(prev => ({ ...prev, [connectionId]: false }));

        if (result.success) {
            setIcebreakers(prev => ({ ...prev, [connectionId]: result.icebreaker || "" }));
        } else {
            alert("Error generating liaison prompt: " + result.error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative overflow-hidden rounded-3xl">
                <div className="radar-sweep opacity-50" />
                <div className="relative">
                    <Radar className="w-16 h-16 text-cyan-500 animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
                </div>
                <div className="space-y-2 text-center z-10">
                    <p className="text-white font-bold tracking-[0.2em] uppercase text-xs">Scanning Campus Orbit</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest animate-pulse">Analyzing Synergy Matrices...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Info className="w-12 h-12 text-red-500" />
                <p className="text-white/60">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry Scan</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 relative overflow-hidden">
                        <div className="radar-sweep opacity-30 scale-150" />
                        <Target className="w-6 h-6 text-cyan-400 z-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Discover <span className="text-gradient">People</span></h1>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">{connections.length} Recommended Connections</p>
                    </div>
                </div>
                <Button className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 rounded-xl px-6 h-12">
                    <Radar className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {connections.map((connection, index) => (
                        <motion.div
                            key={connection.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="glass-card holographic-hover border-white/5 overflow-hidden group h-full flex flex-col">
                                <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                                    {/* Avatar Placeholder */}
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative shadow-2xl">
                                        <span className="text-4xl font-black">{connection.full_name[0]}</span>
                                        <div className="absolute inset-0 rounded-full border border-cyan-500/50 animate-ping opacity-20" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white font-mono text-[10px]">
                                            {connection.compatibility_score}% COMPATIBLE
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{connection.full_name}</h2>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{connection.academic_aim}</p>
                                    </div>

                                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3">
                                        <p className="text-xs text-cyan-50/70 leading-relaxed font-medium italic">
                                            "{connection.connection_reason}"
                                        </p>
                                    </div>

                                    {icebreakers[connection.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 relative"
                                        >
                                            <MessageCircle className="w-4 h-4 text-blue-400 absolute top-2 right-2" />
                                            <p className="text-xs text-blue-200 leading-relaxed font-bold italic">
                                                Icebreaker: {icebreakers[connection.id]}
                                            </p>
                                        </motion.div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {connection.hobbies?.slice(0, 3).map((tag: string) => (
                                            <Badge key={tag} className="text-[9px] bg-white/5 border-white/10 text-white/40 font-mono tracking-tighter px-1.5 h-5">
                                                {tag.toUpperCase()}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="pt-4 mt-auto flex gap-3">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="flex-1 rounded-xl border-white/10 hover:bg-white/10 hover:border-white/30 group-hover:scale-105 transition-all h-12"
                                        >
                                            <X className="w-5 h-5 text-white/40" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="flex-1 rounded-xl border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 group-hover:scale-105 transition-all h-12"
                                            onClick={() => handleGetIcebreaker(connection.id)}
                                            disabled={icebreakerLoading[connection.id]}
                                        >
                                            {icebreakerLoading[connection.id] ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : <MessageCircle className="w-5 h-5 text-cyan-400" />}
                                        </Button>
                                        <Button size="icon" className="flex-1 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg group-hover:scale-105 transition-all h-12">
                                            <UserPlus className="w-5 h-5 text-white" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white/20" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white/80 uppercase">No people found yet</h3>
                    <p className="text-white/40 text-sm">Try updating your bio to help others find you.</p>
                </div>
                <Link href="/onboarding">
                    <Button variant="link" className="text-cyan-400 uppercase tracking-widest text-xs">Update Bio</Button>
                </Link>
            </div>
        </div>
    );
}

import { LucideIcon } from "lucide-react";
import Link from "next/link";
