"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, Send, ArrowLeft, Hash, Loader2,
    UserCircle, Trash2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Message {
    id: string;
    user_id: string;
    display_name: string;
    content: string;
    created_at: string;
}

function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CHANNELS = ["general", "academic", "projects", "off-topic"];

export default function LoungePage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState("Anonymous");
    const [activeChannel, setActiveChannel] = useState("general");
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get current user
    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser(user);
                const { data } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .single();
                if (data?.full_name) setDisplayName(data.full_name);
            }
        }
        init();
    }, []);

    // Load messages + subscribe to realtime
    useEffect(() => {
        setLoading(true);
        setMessages([]);

        // Fetch existing messages for this channel
        supabase
            .from("lounge_messages")
            .select("*")
            .eq("channel", activeChannel)
            .order("created_at", { ascending: true })
            .limit(100)
            .then(({ data, error }) => {
                if (error) setError("Could not load messages.");
                else setMessages(data || []);
                setLoading(false);
            });

        // Subscribe to new messages
        const channel = supabase
            .channel(`lounge:${activeChannel}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "lounge_messages",
                    filter: `channel=eq.${activeChannel}`,
                },
                (payload) => {
                    setMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new as Message];
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "lounge_messages",
                },
                (payload) => {
                    setMessages((prev) => prev.filter(m => m.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [activeChannel]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !currentUser || sending) return;
        setSending(true);
        const content = input.trim();
        setInput("");

        const { error } = await supabase.from("lounge_messages").insert({
            user_id: currentUser.id,
            display_name: displayName,
            content,
            channel: activeChannel,
        });
        if (error) setError("Failed to send. Try again.");
        setSending(false);
        inputRef.current?.focus();
    };

    const handleDelete = async (id: string) => {
        await supabase.from("lounge_messages").delete().eq("id", id);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 relative z-10 p-4 md:p-8 gap-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 md:pt-4">
                    <div className="space-y-3">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xl shrink-0">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-foreground">The <span className="text-gradient">Lounge</span></h1>
                                <p className="text-muted-foreground font-mono text-[9px] uppercase tracking-[0.3em] font-bold">Campus Pulse · Live</p>
                            </div>
                        </div>
                    </div>

                    {/* Live indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Realtime Active</span>
                    </div>
                </header>

                {/* Channels */}
                <div className="flex gap-2 flex-wrap">
                    {CHANNELS.map(ch => (
                        <button
                            key={ch}
                            onClick={() => setActiveChannel(ch)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === ch
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <Hash className="w-3 h-3" />
                            {ch}
                        </button>
                    ))}
                </div>

                {/* Message Feed */}
                <div className="flex-1 glass-card rounded-[2rem] flex flex-col overflow-hidden min-h-[420px] max-h-[520px]">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 no-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tuning in...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
                                <AlertCircle className="w-8 h-8 text-rose-400" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">{error}</p>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Run the SQL migration in Supabase first</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-tight text-foreground">Silence in #{activeChannel}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Be the first to transmit</p>
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => {
                                    const isOwn = currentUser?.id === msg.user_id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${isOwn ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                                                {msg.display_name?.[0]?.toUpperCase() || "?"}
                                            </div>
                                            <div className={`max-w-[70%] space-y-1 ${isOwn ? "items-end" : ""} flex flex-col`}>
                                                <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{isOwn ? "You" : msg.display_name}</span>
                                                    <span className="text-[8px] text-muted-foreground/60">{formatTime(msg.created_at)}</span>
                                                    {isOwn && (
                                                        <button
                                                            onClick={() => handleDelete(msg.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-snug break-words ${isOwn
                                                        ? "bg-primary text-white rounded-tr-sm"
                                                        : "bg-secondary text-foreground rounded-tl-sm"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="border-t border-border p-3 md:p-4">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={`Message #${activeChannel}...`}
                                maxLength={500}
                                disabled={!currentUser || sending}
                                className="flex-1 rounded-xl bg-secondary/50 border-border h-11 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                            />
                            <Button
                                type="submit"
                                disabled={!input.trim() || !currentUser || sending}
                                className="rounded-xl bg-primary hover:bg-primary/90 text-white h-11 px-4 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                            >
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </form>
                        {!currentUser && (
                            <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                                <Link href="/login" className="text-primary hover:underline">Log in</Link> to join the conversation
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
