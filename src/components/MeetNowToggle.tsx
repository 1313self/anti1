"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Lightbulb, HelpCircle, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMeetNowStatus } from "@/app/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";

const INTENTS = [
    { id: "coffee", label: "Coffee Chat", icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/10" },
    { id: "brainstorm", label: "Brainstorm", icon: Lightbulb, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { id: "help", label: "Quick Help", icon: HelpCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export function MeetNowToggle() {
    const { toast } = useToast();
    const [isLive, setIsLive] = useState(false);
    const [activeIntent, setActiveIntent] = useState<string | null>(null);
    const [agenda, setAgenda] = useState("");
    const [loading, setLoading] = useState(true);
    const [liveCount, setLiveCount] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("live_now, meeting_intent")
                    .eq("id", user.id)
                    .single();
                
                if (mounted && data) {
                    setIsLive(!!data.live_now);
                    setActiveIntent(data.meeting_intent);
                }
            }
            
            // Initial count
            const { count } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("live_now", true);
            
            if (mounted) {
                setLiveCount(count || 0);
                setLoading(false);
            }
        }

        init();

        const channel = supabase
            .channel("live-users-meet")
            .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
                supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true })
                    .eq("live_now", true)
                    .then(({ count }) => {
                        if (mounted) setLiveCount(count || 0);
                    });
            })
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const handleToggle = async (intentId: string | null) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
 
        const newStatus = !!intentId;
        const targetIntent = newStatus ? `${intentId}: ${agenda}` : null;
 
        setLoading(true);
        const res = await updateMeetNowStatus(user.id, newStatus, targetIntent);
        
        if (res.success) {
            setIsLive(newStatus);
            setActiveIntent(targetIntent);
            if (!newStatus) setAgenda(""); 
            toast(newStatus ? `Ready for ${intentId}!` : "Status hidden.", "success");
        } else {
            toast("Failed to update status.", "error");
        }
        setLoading(false);
    };

    return (
        <div className="relative">
            <motion.div 
                layout
                className={`glass p-6 md:p-8 rounded-[2.5rem] border ${isLive ? 'border-primary/40 shadow-neon' : 'border-white/5'} transition-all`}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]' : 'bg-muted-foreground/30'}`} />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight text-foreground">Flash Networking</h2>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-[280px]">
                            {isLive 
                                ? `You are visible on discovery for ${activeIntent?.replace('-', ' ')}.` 
                                : "Broadcast your availability to meet people on campus right now."
                            }
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {INTENTS.map((intent) => {
                                const Icon = intent.icon;
                                const isActive = activeIntent?.split(":")[0] === intent.id;
                                return (
                                    <Button
                                        key={intent.id}
                                        onClick={() => {
                                            if (isLive && isActive) {
                                                handleToggle(null); // Turn off
                                            } else {
                                                setActiveIntent(intent.id); // Select intent
                                                if (isLive) setIsLive(false); // Reset to allow agenda update
                                            }
                                        }}
                                        disabled={loading}
                                        variant="outline"
                                        className={`relative h-14 md:h-16 px-6 rounded-2xl border-white/5 font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'}`}
                                    >
                                        <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : intent.color}`} />
                                        {intent.label}
                                        {isActive && (
                                            <motion.div layoutId="intent-glow" className="absolute inset-0 bg-primary/20 blur-xl -z-10" />
                                        )}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Agenda Input */}
                        <AnimatePresence>
                            {activeIntent && !isLive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <input
                                        type="text"
                                        placeholder={`What's your ${activeIntent} agenda? (e.g. Discussing SaaS ideas)`}
                                        value={agenda}
                                        onChange={(e) => setAgenda(e.target.value)}
                                        className="flex-1 bg-secondary/50 border border-white/10 rounded-2xl px-6 h-14 text-sm font-medium focus:outline-none focus:border-primary/50 text-foreground"
                                    />
                                    <Button
                                        onClick={() => handleToggle(activeIntent)}
                                        disabled={!agenda.trim() || loading}
                                        className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-neon"
                                    >
                                        Transmit Status
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4 pl-0 md:pl-6 border-l-0 md:border-l border-white/10 shrink-0">
                        <div className="text-right">
                            <div className="text-2xl font-black text-foreground">{liveCount}</div>
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ready to Meet</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
