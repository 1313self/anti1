"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { updateProfile } from "@/app/onboarding/actions";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
    User, Mail, Book, Heart, MessageSquare,
    ArrowLeft, Save, Loader2, Sparkles, UserCircle, CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        full_name: "",
        academic_aim: "",
        hobbies: "",
        bio: "",

        study_window: "",
        instagram: "",
        discord: "",
    });

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            // Using public client for read - check RLS!
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData({
                    full_name: data.full_name || "",
                    academic_aim: data.academic_aim || "",
                    hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(", ") : data.hobbies || "",
                    bio: data.bio || "",
                    study_window: data.study_window || "",
                    instagram: data.instagram || "",
                    discord: data.discord || "",
                });
            } else if (error) {
                console.error("Profile load error:", error);
                setError("Profile data not found. Please complete onboarding.");
            }
            setLoading(false);
        }

        getProfile();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setError(null);

        const result = await updateProfile({
            userId: user.id,
            fullName: formData.full_name,
            academicAim: formData.academic_aim,
            hobbies: formData.hobbies,
            bio: formData.bio,
            studyWindow: formData.study_window,
            instagram: formData.instagram,
            discord: formData.discord,
        });

        if (!result.success) {
            const msg = result.error || "Failed to update profile.";
            setError(msg);
            toast(msg, "error");
        } else {
            toast("Profile updated successfully!", "success");
            router.push("/dashboard");
        }
        setSaving(false);
    };

    // Profile completion calculation
    const completionFields = [
        formData.full_name,
        formData.academic_aim,
        formData.bio,
        formData.hobbies,
        formData.instagram,
        formData.discord,
    ];
    const completedCount = completionFields.filter(f => f.trim().length > 0).length;
    const completionPct = Math.round((completedCount / completionFields.length) * 100);
    const completionColor = completionPct === 100 ? "bg-emerald-500" : completionPct >= 60 ? "bg-primary" : "bg-amber-500";

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-white/50 border border-slate-100">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-4xl mx-auto relative z-10 space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 md:pb-6">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="text-slate-400 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Return to Hub
                        </Button>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] md:leading-[0.8] uppercase text-slate-900 break-words">
                            Edit <br /> <span className="text-gradient">Profile</span>
                        </h1>
                    </div>
                </header>

                {/* Profile Completion Bar */}
                <div className="glass-card rounded-[2rem] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Completeness</p>
                            <p className="text-2xl font-black text-foreground">{completionPct}%
                                {completionPct === 100 && <CheckCircle2 className="inline ml-2 w-5 h-5 text-emerald-500" />}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{completedCount}/{completionFields.length} Fields</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                                {completionPct === 100 ? "Profile Complete ✓" : "Complete your profile for better matches"}
                            </p>
                        </div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${completionColor}`}
                        />
                    </div>
                    {completionPct < 100 && (
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Fill in: {completionFields.map((f, i) => !f.trim() ? ["Name", "Academic Focus", "Bio", "Hobbies", "Instagram", "Discord"][i] : null).filter(Boolean).join(" · ")}
                        </p>
                    )}
                </div>

                <Card className="glass-card border-white shadow-2xl shadow-slate-200/50 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-6 md:p-10 pb-4 md:pb-6 flex flex-row items-center gap-4 md:gap-6 border-b border-white bg-slate-50/50">
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                            <UserCircle className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight truncate">Personal Data</CardTitle>
                            <CardDescription className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-widest truncate">Update your campus presence</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10">
                        <form onSubmit={handleSave} className="space-y-8 md:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Full Name
                                    </Label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="Your full name..."
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Book className="w-3 h-3" /> Academic Focus
                                    </Label>
                                    <Input
                                        value={formData.academic_aim}
                                        onChange={e => setFormData({ ...formData, academic_aim: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="What are you studying?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Professional Bio
                                </Label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full h-32 p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-50/50 border-2 border-slate-100 text-slate-700 font-medium text-base md:text-lg focus:border-indigo-400 focus:bg-white outline-none transition-all resize-none shadow-inner"
                                    placeholder="Tell the campus your story..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Heart className="w-3 h-3" /> Interests & Hobbies
                                    </Label>
                                    <Input
                                        value={formData.hobbies}
                                        onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="Reading, Coding, Chess..."
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Study Rhythm
                                    </Label>
                                    <Input
                                        value={formData.study_window}
                                        onChange={e => setFormData({ ...formData, study_window: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="e.g. 4-5 hours / night"
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <span className="text-lg">📸</span> Instagram
                                    </Label>
                                    <Input
                                        value={formData.instagram}
                                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="https://instagram.com/yourprofile"
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <span className="text-lg">💬</span> Discord
                                    </Label>
                                    <Input
                                        value={formData.discord}
                                        onChange={e => setFormData({ ...formData, discord: e.target.value })}
                                        className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                        placeholder="username#1234"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center">
                                    System Error: {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full h-14 md:h-18 rounded-2xl md:rounded-3xl bg-indigo-600 text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-95"
                            >
                                {saving ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : (
                                    <>
                                        Commit Changes <Save className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div >
    );
}
