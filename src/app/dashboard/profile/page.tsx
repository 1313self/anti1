"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { updateProfile } from "@/app/onboarding/actions";

import { useRouter } from "next/navigation";
import {
    User, Mail, Book, Heart, MessageSquare,
    ArrowLeft, Save, Loader2, Sparkles, UserCircle
} from "lucide-react";

export default function ProfilePage() {
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
        });

        if (!result.success) {
            setError(result.error || "Failed to update profile protocol.");
        } else {
            router.push("/dashboard");
        }
        setSaving(false);
    };

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

            <main className="max-w-4xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Return to Hub
                        </Button>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.8] uppercase text-slate-900">
                            Edit <br /> <span className="text-gradient">Profile</span>
                        </h1>
                    </div>
                </header>

                <Card className="glass-card border-white shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-4 flex flex-row items-center gap-6 border-b border-white bg-slate-50/50">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-indigo-100">
                            <UserCircle className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personal Data</CardTitle>
                            <CardDescription className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Update your campus presence</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={handleSave} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Full Name
                                    </Label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="input-glow-bottom text-lg font-black text-slate-800 placeholder:text-slate-200 h-14"
                                        placeholder="Your full name..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-2">
                                        <Book className="w-3 h-3" /> Academic Focus
                                    </Label>
                                    <Input
                                        value={formData.academic_aim}
                                        onChange={e => setFormData({ ...formData, academic_aim: e.target.value })}
                                        className="input-glow-bottom text-lg font-black text-slate-800 placeholder:text-slate-200 h-14"
                                        placeholder="What are you studying?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Professional Bio
                                </Label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full h-32 p-6 rounded-2xl bg-slate-50/50 border-2 border-slate-100 text-slate-700 font-medium text-lg focus:border-indigo-400 focus:bg-white outline-none transition-all resize-none shadow-inner"
                                    placeholder="Tell the campus your story..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-2">
                                        <Heart className="w-3 h-3" /> Interests & Hobbies
                                    </Label>
                                    <Input
                                        value={formData.hobbies}
                                        onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                                        className="input-glow-bottom text-lg font-black text-slate-800 placeholder:text-slate-200 h-14"
                                        placeholder="Reading, Coding, Chess..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Study Rhythm
                                    </Label>
                                    <Input
                                        value={formData.study_window}
                                        onChange={e => setFormData({ ...formData, study_window: e.target.value })}
                                        className="input-glow-bottom text-lg font-black text-slate-800 placeholder:text-slate-200 h-14"
                                        placeholder="e.g. 4-5 hours / night"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest text-center">
                                    System Error: {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full h-18 rounded-3xl bg-indigo-600 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        Commit Changes <Save className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
