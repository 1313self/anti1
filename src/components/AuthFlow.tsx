"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

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

        const { error } = mode === 'login'
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
        } else {
            router.push(mode === 'signup' ? "/onboarding" : "/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />

            <Card className="glass-card border-white/5 bg-white/5 backdrop-blur-[40px] w-full max-w-md relative z-10">
                <CardHeader className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mx-auto mb-4">
                        {mode === 'login' ? <LogIn className="text-cyan-400 w-6 h-6" /> : <UserPlus className="text-cyan-400 w-6 h-6" />}
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase text-white">
                        {mode === 'login' ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">
                        {mode === 'login' ? "Enter your campus credentials" : "Join the campus network today"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <Input
                                    type="email"
                                    placeholder="name@university.edu"
                                    className="input-glow-bottom pl-6 h-12 uppercase text-xs"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-glow-bottom pl-6 h-12 uppercase text-xs"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/90 shadow-xl"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? "Initialize Login" : "Initialize Account"}
                        </Button>

                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => router.push(mode === 'login' ? "/signup" : "/login")}
                                className="text-white/40 font-mono text-[10px] uppercase tracking-widest hover:text-cyan-400 transition-colors"
                            >
                                {mode === 'login' ? "New here? Create an account" : "Already have an account? Login"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
