"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, Send, ArrowLeft, Hash, Loader2,
    Trash2, AlertCircle, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LoungeMessageSkeleton } from "@/components/ui/skeleton";

interface Message {
    id: string;
    user_id: string;
    display_name: string;
    content: string;
    created_at: string;
    channel: string;
}

interface Reaction {
    message_id: string;
    user_id: string;
    emoji: string;
}

function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CHANNELS = [
    { id: "general", label: "#general" },
    { id: "academic", label: "#study" },
    { id: "projects", label: "#collabs" },
    { id: "off-topic", label: "#rants" },
];

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "🔥", "💡"];

export default function LoungePage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState("Anonymous");
    const [activeChannel, setActiveChannel] = useState("general");
    const [error, setError] = useState<string | null>(null);
    const [showPickerId, setShowPickerId] = useState<string | null>(null);
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

    // Load messages + reactions, subscribe to realtime
    useEffect(() => {
        setLoading(true);
        setMessages([]);
        setReactions([]);

        supabase
            .from("lounge_messages")
            .select("*")
            .eq("channel", activeChannel)
            .order("created_at", { ascending: true })
            .limit(100)
            .then(({ data, error }) => {
                if (error) setError("Could not load messages.");
                else {
                    const msgs = data || [];
                    setMessages(msgs);

                    // Fetch reactions for these messages if any
                    if (msgs.length > 0) {
                        const ids = msgs.map((m: Message) => m.id);
                        supabase
                            .from("lounge_reactions")
                            .select("message_id, user_id, emoji")
                            .in("message_id", ids)
                            .then(({ data: rxData }) => {
                                setReactions(rxData || []);
                            });
                    }
                }
                setLoading(false);
            });

        // Subscribe to messages
        const msgChannel = supabase
            .channel(`lounge:${activeChannel}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "lounge_messages", filter: `channel=eq.${activeChannel}` },
                (payload) => {
                    setMessages(prev => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new as Message];
                    });
                })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "lounge_messages" },
                (payload) => {
                    setMessages(prev => prev.filter(m => m.id !== payload.old.id));
                })
            // Reactions realtime
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "lounge_reactions" },
                (payload) => {
                    setReactions(prev => {
                        if (prev.some(r => r.message_id === payload.new.message_id && r.user_id === payload.new.user_id && r.emoji === payload.new.emoji)) return prev;
                        return [...prev, payload.new as Reaction];
                    });
                })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "lounge_reactions" },
                (payload) => {
                    setReactions(prev => prev.filter(r =>
                        !(r.message_id === payload.old.message_id && r.user_id === payload.old.user_id && r.emoji === payload.old.emoji)
                    ));
                })
            .subscribe();

        return () => { supabase.removeChannel(msgChannel); };
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

    const handleReaction = async (messageId: string, emoji: string) => {
        if (!currentUser) return;
        const existing = reactions.find(r => r.message_id === messageId && r.user_id === currentUser.id && r.emoji === emoji);
        if (existing) {
            await supabase.from("lounge_reactions").delete()
                .eq("message_id", messageId).eq("user_id", currentUser.id).eq("emoji", emoji);
        } else {
            await supabase.from("lounge_reactions").insert({ message_id: messageId, user_id: currentUser.id, emoji });
        }
        setShowPickerId(null);
    };

    const getReactionCounts = (messageId: string) => {
        const msgReactions = reactions.filter(r => r.message_id === messageId);
        const counts: Record<string, number> = {};
        msgReactions.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
        return counts;
    };

    const hasMyReaction = (messageId: string, emoji: string) =>
        reactions.some(r => r.message_id === messageId && r.user_id === currentUser?.id && r.emoji === emoji);

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

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Realtime Active</span>
                    </div>
                </header>

                {/* Channel Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {CHANNELS.map(ch => (
                        <button
                            key={ch.id}
                            onClick={() => setActiveChannel(ch.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === ch.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <Hash className="w-3 h-3" />
                            {ch.label.replace("#", "")}
                        </button>
                    ))}
                </div>

                {/* Message Feed */}
                <div className="flex-1 glass-card rounded-[2rem] flex flex-col overflow-hidden min-h-[420px] max-h-[600px] border-border shadow-2xl">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => <LoungeMessageSkeleton key={i} isOwn={i % 2 === 0} />)}
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
                                    <p className="text-sm font-black uppercase tracking-tight text-foreground">Silence in {CHANNELS.find(c => c.id === activeChannel)?.label}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Be the first to transmit</p>
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isOwn = currentUser?.id === msg.user_id;
                                    const reactionCounts = getReactionCounts(msg.id);
                                    const hasReactions = Object.keys(reactionCounts).length > 0;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.98, y: 5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex gap-3 group relative ${isOwn ? "flex-row-reverse" : ""}`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${isOwn ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground"}`}>
                                                {msg.display_name?.[0]?.toUpperCase() || "?"}
                                            </div>
                                            <div className={`max-w-[80%] space-y-1 ${isOwn ? "items-end text-right" : "items-start text-left"} flex flex-col`}>
                                                <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{isOwn ? "You" : msg.display_name}</span>
                                                    <span className="text-[8px] text-muted-foreground/60">{formatTime(msg.created_at)}</span>
                                                    {isOwn && (
                                                        <button onClick={() => handleDelete(msg.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500 p-1">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-snug break-words shadow-sm transition-all group-hover:shadow-md ${isOwn ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm hover:bg-secondary/80"}`}>
                                                    {msg.content}
                                                </div>

                                                {/* Reactions row */}
                                                <div className={`flex items-center gap-1 flex-wrap pt-0.5 ${isOwn ? "justify-end" : ""}`}>
                                                    {hasReactions && Object.entries(reactionCounts).map(([emoji, count]) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleReaction(msg.id, emoji)}
                                                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all border ${hasMyReaction(msg.id, emoji)
                                                                ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                                                                : "bg-secondary/60 border-transparent text-muted-foreground hover:bg-secondary hover:border-border"
                                                                }`}
                                                        >
                                                            <span>{emoji}</span>
                                                            <span>{count}</span>
                                                        </button>
                                                    ))}

                                                    {/* Emoji toggle button for mobile/hover */}
                                                    {currentUser && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowPickerId(showPickerId === msg.id ? null : msg.id);
                                                            }}
                                                            className={`p-1 rounded-full text-muted-foreground hover:text-primary transition-all ${showPickerId === msg.id ? "bg-secondary opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                                        >
                                                            <Smile className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Emoji picker */}
                                                    <AnimatePresence>
                                                        {showPickerId === msg.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                                                className="absolute bottom-full mb-2 z-50 flex items-center gap-1 bg-card border border-border rounded-2xl px-3 py-1.5 shadow-2xl"
                                                            >
                                                                {EMOJI_OPTIONS.map(e => (
                                                                    <button
                                                                        key={e}
                                                                        onClick={() => handleReaction(msg.id, e)}
                                                                        className={`text-lg hover:scale-135 transition-transform px-1 active:scale-95 ${hasMyReaction(msg.id, e) ? "opacity-100 bg-primary/10 rounded-lg" : "opacity-70 hover:opacity-100"}`}
                                                                    >
                                                                        {e}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
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
                    <div className="border-t border-border p-4 bg-card/30">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder={`Message ${CHANNELS.find(c => c.id === activeChannel)?.label}...`}
                                    maxLength={500}
                                    disabled={!currentUser || sending}
                                    className="w-full rounded-xl bg-secondary/50 border-border h-12 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary shadow-sm pr-12"
                                />
                                <span className={`absolute right-3 bottom-3 text-[9px] font-bold uppercase tracking-widest ${input.length >= 450 ? "text-rose-500" : "text-muted-foreground/40"}`}>
                                    {input.length}/500
                                </span>
                            </div>
                            <Button
                                type="submit"
                                disabled={!input.trim() || !currentUser || sending}
                                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 p-0 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shrink-0"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </Button>
                        </form>
                        {!currentUser && (
                            <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-3">
                                <Link href="/login" className="text-primary hover:underline">Log in</Link> to join the conversation
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
