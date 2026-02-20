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
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/[0.05] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/[0.05] blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="glass-card border-white/5 shadow-2xl shadow-black/20 rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-xl">
                    <CardHeader className="text-center space-y-4 pb-8 pt-10">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-white/10 mx-auto mb-2 shadow-neon relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/20" />
                            {mode === 'login' ? <LogIn className="text-primary w-8 h-8 relative z-10" /> : <UserPlus className="text-primary w-8 h-8 relative z-10" />}
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-heading font-black tracking-tighter uppercase text-foreground leading-none">
                                {mode === 'login' ? "Welcome Back" : "Start Connecting"}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                                {mode === 'login' ? "Access your campus network" : "Join your academic community"}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                        <form onSubmit={handleAuth} className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-muted-foreground uppercase font-bold text-[10px] tracking-widest">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="NAME@UNIVERSITY.EDU"
                                        className="input-glow-bottom pl-6 h-12 uppercase text-xs font-bold tracking-widest text-foreground placeholder:text-muted-foreground/30 border-b border-white/10 focus-visible:border-primary bg-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-muted-foreground uppercase font-bold text-[10px] tracking-widest">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-glow-bottom pl-6 h-12 uppercase text-xs font-bold tracking-widest text-foreground placeholder:text-muted-foreground/30 border-b border-white/10 focus-visible:border-primary bg-transparent"
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
                                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center"
                                >
                                    System Alert: {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold uppercase text-xs tracking-widest hover:bg-primary/90 shadow-neon transition-all active:scale-95"
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
                                    className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
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
