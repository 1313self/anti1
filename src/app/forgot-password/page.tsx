"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: "Protocol Initialized: Check your email for the reset link." });
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
                        <Link href="/login" className="absolute left-8 top-10 text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-white/10 mx-auto mb-2 shadow-neon relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/20" />
                            <Mail className="text-primary w-8 h-8 relative z-10" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-heading font-black tracking-tighter uppercase text-foreground leading-none">
                                Reset Access
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                                Recover your account identity
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                        {!message || message.type === 'error' ? (
                            <form onSubmit={handleReset} className="space-y-8">
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

                                {message?.type === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center"
                                    >
                                        Alert: {message.text}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold uppercase text-xs tracking-widest hover:bg-primary/90 shadow-neon transition-all active:scale-95"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            Send Reset Link
                                            <Sparkles className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 py-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    {message.text}
                                </div>
                                <Button
                                    onClick={() => router.push("/login")}
                                    variant="ghost"
                                    className="text-primary font-bold uppercase text-[10px] tracking-widest hover:bg-primary/10"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
