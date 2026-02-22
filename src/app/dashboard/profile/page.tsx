"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { updateProfile } from "@/app/onboarding/actions";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";
import {
    User, Mail, Book, Heart, MessageSquare,
    ArrowLeft, Save, Loader2, Sparkles, UserCircle, CheckCircle2,
    Code2, Clock, Instagram
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
        skills: "",
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

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                const profile = data as Profile;
                setFormData({
                    full_name: profile.full_name || "",
                    academic_aim: profile.academic_aim || "",
                    hobbies: Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : "",
                    skills: Array.isArray((profile as any).skills) ? (profile as any).skills.join(", ") : "",
                    bio: profile.bio || "",
                    study_window: profile.study_window || "",
                    instagram: profile.instagram || "",
                    discord: profile.discord || "",
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
            skills: formData.skills,
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

    const completionFields = [
        formData.full_name,
        formData.academic_aim,
        formData.bio,
        formData.hobbies,
        formData.skills,
        formData.instagram,
    ];
    const completedCount = completionFields.filter(f => f.trim().length > 0).length;
    const completionPct = Math.round((completedCount / completionFields.length) * 100);
    const completionColor = completionPct === 100 ? "bg-emerald-500" : completionPct >= 60 ? "bg-primary" : "bg-amber-500";

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Synchronizing Hub Identity...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-4xl mx-auto relative z-10 space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 md:pb-6">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Return to Hub
                        </Button>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] md:leading-[0.8] uppercase text-foreground break-words">
                            Edit <br /> <span className="text-gradient">Profile</span>
                        </h1>
                    </div>
                </header>

                {/* Profile Completion Bar */}
                <div className="glass-card rounded-[2rem] p-6 space-y-4 border-border shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Authenticity</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-foreground">{completionPct}%</span>
                                {completionPct === 100 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{completedCount}/{completionFields.length} Channels Synced</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                                {completionPct === 100 ? "Identity Verified ✓" : "Sync more data for priority matching"}
                            </p>
                        </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${completionColor} shadow-neon`}
                        />
                    </div>
                </div>

                <Card className="glass-card border-border shadow-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-6 md:p-10 pb-4 md:pb-6 flex flex-row items-center gap-4 md:gap-6 border-b border-border bg-card/50">
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg shadow-black/5 shrink-0">
                            <UserCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight truncate">Identity Data</CardTitle>
                            <CardDescription className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-widest truncate">Broadcast your presence to the hub</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10">
                        <form onSubmit={handleSave} className="space-y-8 md:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Broadcast Name
                                    </Label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="Identity identifier..."
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Book className="w-3 h-3" /> Core Objective
                                    </Label>
                                    <Input
                                        value={formData.academic_aim}
                                        onChange={e => setFormData({ ...formData, academic_aim: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="Academic intent..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Identity Bio
                                </Label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full h-32 p-4 md:p-6 rounded-xl md:rounded-2xl bg-secondary/50 border border-border text-foreground font-medium text-base focus:border-primary focus:bg-background outline-none transition-all resize-none shadow-inner no-scrollbar"
                                    placeholder="Describe your synergy potential..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Code2 className="w-3 h-3" /> Technical/Soft Skills
                                    </Label>
                                    <Input
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="React, Design, Python..."
                                    />
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest px-1">Comma-separated skills for matching</p>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Heart className="w-3 h-3" /> Interests & Hobbies
                                    </Label>
                                    <Input
                                        value={formData.hobbies}
                                        onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="Chess, Hiking, Gaming..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Study Rhythm
                                    </Label>
                                    <Input
                                        value={formData.study_window}
                                        onChange={e => setFormData({ ...formData, study_window: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="e.g. 5 devs / week"
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                        <Instagram className="w-3 h-3" /> Instagram Handle
                                    </Label>
                                    <Input
                                        value={formData.instagram}
                                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                        placeholder="@example"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Discord ID
                                </Label>
                                <Input
                                    value={formData.discord}
                                    onChange={e => setFormData({ ...formData, discord: e.target.value })}
                                    className="rounded-xl bg-secondary/50 border-border h-12 md:h-14 font-black text-foreground text-base"
                                    placeholder="username#0000"
                                />
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center">
                                    Connection Error: {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full h-14 md:h-16 rounded-2xl md:rounded-3xl bg-primary text-primary-foreground font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                            >
                                {saving ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : (
                                    <>
                                        Broadcast Updates <Save className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
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
