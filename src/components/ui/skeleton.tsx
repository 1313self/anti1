import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-secondary/50",
                className
            )}
        />
    );
}

// Pre-built skeleton cards for each page

export function ResourceCardSkeleton() {
    return (
        <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
        </div>
    );
}

export function GigCardSkeleton() {
    return (
        <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-9 w-9 rounded-xl ml-4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
        </div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-4 w-14 rounded-full" />
                <Skeleton className="h-4 w-18 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
        </div>
    );
}

export function DiscoveryCardSkeleton() {
    return (
        <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex gap-2 pt-2 border-t border-white/5">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="glass-card rounded-2xl p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-12" />
        </div>
    );
}

export function LoungeMessageSkeleton({ isOwn }: { isOwn?: boolean }) {
    return (
        <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""} animate-pulse`}>
            <div className="w-8 h-8 rounded-xl bg-secondary/50 shrink-0" />
            <div className={`max-w-[70%] space-y-2 flex flex-col ${isOwn ? "items-end" : ""}`}>
                <div className="h-3 bg-secondary/30 rounded w-16" />
                <div className={`h-10 bg-secondary/20 rounded-2xl w-48 ${isOwn ? "rounded-tr-sm" : "rounded-tl-sm"}`} />
            </div>
        </div>
    );
}
