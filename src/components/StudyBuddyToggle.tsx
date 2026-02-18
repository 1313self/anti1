"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateStudyStatus } from "@/app/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { BookOpen, Zap } from "lucide-react";
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
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${isLive ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isLive ? 'bg-white/20' : 'bg-slate-50'}`}>
                    <BookOpen className={`w-7 h-7 ${isLive ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div className="space-y-1 text-center md:text-left">
                    <Label className={`text-xl font-black uppercase tracking-tight ${isLive ? 'text-white' : 'text-slate-900'}`}>Study Mode</Label>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-white/60' : 'text-slate-400'}`}>
                        {isLive ? 'Status: Currently Active' : 'Status: Ready for Session'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {isLive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm"
                    >
                        <Zap className="w-3 h-3 text-white animate-pulse" />
                        <span className="text-[10px] text-white font-black tracking-widest uppercase">Era Connect</span>
                    </motion.div>
                )}
                <Switch
                    checked={isLive}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                    className={`h-10 w-20 p-1.5 data-[state=checked]:bg-white/20 data-[state=unchecked]:bg-slate-100`}
                />
            </div>
        </div>
    );
}
