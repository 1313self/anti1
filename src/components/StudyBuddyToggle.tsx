"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateStudyStatus } from "@/app/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function StudyBuddyToggle() {
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUserId(user.id);
                // Fetch current status
                supabase.from('profiles').select('live_now').eq('id', user.id).single().then(({ data }) => {
                    if (data) setIsLive(data.live_now || false);
                });
            }
        });
    }, []);

    const handleToggle = async (checked: boolean) => {
        if (!userId) return;
        setLoading(true);
        const result = await updateStudyStatus(userId, checked);
        if (result.success) {
            setIsLive(checked);
        }
        setLoading(false);
    };

    return (
        <div className={`p-5 rounded-[1.5rem] border transition-all duration-500 flex items-center justify-between ${isLive ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${isLive ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                    <BookOpen className={`w-5 h-5 ${isLive ? 'text-cyan-400' : 'text-white/20'}`} />
                </div>
                <div className="space-y-1">
                    <Label className="text-sm font-black text-white uppercase tracking-tight">Study Mode</Label>
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest leading-none">
                        {isLive ? 'Status: Active' : 'Status: Off'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isLive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] text-cyan-400 font-black tracking-widest uppercase">BROADCASTING</span>
                    </motion.div>
                )}
                <Switch
                    checked={isLive}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                    className="data-[state=checked]:bg-cyan-500"
                />
            </div>
        </div>
    );
}
