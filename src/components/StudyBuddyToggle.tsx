import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateStudyStatus, getLiveStudyCount } from "@/app/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { BookOpen, Zap, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FocusTimer } from "./FocusTimer";

export function StudyBuddyToggle() {
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [liveCount, setLiveCount] = useState(0);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUserId(user.id);
                supabase.from('profiles').select('live_now').eq('id', user.id).single().then(({ data }) => {
                    if (data) setIsLive(data.live_now || false);
                });
            }
        });

        // Initial count
        getLiveStudyCount().then(res => {
            if (res.success) setLiveCount(res.count);
        });

        // Realtime subscription for live count
        const channel = supabase
            .channel('live-profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                getLiveStudyCount().then(res => {
                    if (res.success) setLiveCount(res.count);
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
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
        <div className={`rounded-[2.5rem] border transition-all duration-700 overflow-hidden ${isLive ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-200' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isLive ? 'bg-white/20 rotate-12' : 'bg-slate-50'}`}>
                        <BookOpen className={`w-8 h-8 ${isLive ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-1.5 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <Label className={`text-2xl font-black uppercase tracking-tight ${isLive ? 'text-white' : 'text-slate-900'}`}>Study Mode</Label>
                            {liveCount > 0 && (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Users className="w-3 h-3" />
                                    <span>{liveCount} Active</span>
                                </div>
                            )}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLive ? 'text-white/60' : 'text-slate-400'}`}>
                            {isLive ? 'Currently in Session' : 'Ready to Focus?'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <AnimatePresence>
                        {isLive && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="hidden lg:flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full border border-white/30 backdrop-blur-md"
                            >
                                <Zap className="w-3.5 h-3.5 text-white animate-pulse" />
                                <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">Phase 1 Active</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Switch
                        checked={isLive}
                        onCheckedChange={handleToggle}
                        disabled={loading}
                        className={`h-12 w-24 p-2 data-[state=checked]:bg-white/20 data-[state=unchecked]:bg-slate-100`}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isLive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="border-t border-white/10 bg-indigo-700/30 backdrop-blur-sm p-8"
                    >
                        <FocusTimer isStudyModeActive={isLive} onToggleStudyMode={handleToggle} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
