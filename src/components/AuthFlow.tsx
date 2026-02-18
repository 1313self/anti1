"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, LogIn, UserPlus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { signUpUser } from "@/app/auth/actions";

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error("Auth error:", error);
                setError(error.message);
            } else {
                router.push("/dashboard");
            }
        } else {
            // New Server-Side Sign-Up for Auto-Confirmation
            const result = await signUpUser({ email, password });

            if (!result.success) {
                setError(result.error || "System Protocol Error: Failed to initialize account.");
            } else {
                // Sign in immediately after auto-confirm sign-up to establish session
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) {
                    setError("Activation Error: Account created but login protocol failed.");
                } else {
                    router.push("/onboarding");
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Soft Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="glass-card border-white shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                    <CardHeader className="text-center space-y-4 pb-8 pt-10">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 mx-auto mb-2 shadow-sm">
                            {mode === 'login' ? <LogIn className="text-indigo-600 w-8 h-8" /> : <UserPlus className="text-indigo-600 w-8 h-8" />}
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                                {mode === 'login' ? "Welcome Back" : "Start Connecting"}
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                                {mode === 'login' ? "Access your campus network" : "Join your academic community"}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                        <form onSubmit={handleAuth} className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="NAME@UNIVERSITY.EDU"
                                        className="input-glow-bottom pl-6 h-12 uppercase text-xs font-black tracking-widest text-slate-800 placeholder:text-slate-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-400 uppercase font-black text-[10px] tracking-widest">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-glow-bottom pl-6 h-12 uppercase text-xs font-black tracking-widest text-slate-800 placeholder:text-slate-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest text-center"
                                >
                                    System Alert: {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <span className="flex items-center gap-2">
                                        {mode === 'login' ? "Initialize Login" : "Initialize Account"}
                                        <Sparkles className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push(mode === 'login' ? "/signup" : "/login")}
                                    className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                >
                                    {mode === 'login' ? "New here? Create profile" : "Member? Login to hub"}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
