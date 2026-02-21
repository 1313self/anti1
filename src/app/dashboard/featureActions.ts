"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Client for auth-context operations (uses anon key + RLS)
function getAnonClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// --- Resources (Library) ---

export async function getResources() {
    try {
        const { data, error } = await supabaseAdmin
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, resources: data };
    } catch (error) {
        console.error("Error fetching resources:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createResource(data: {
    title: string;
    type: string;
    author_name: string;
    university: string;
    tags: string[];
    user_id: string;
}) {
    try {
        const { user_id, ...rest } = data;
        const { error } = await supabaseAdmin
            .from('resources')
            .insert([{ ...rest, author_id: user_id }]);

        if (error) throw error;
        revalidatePath("/dashboard/library");
        return { success: true };
    } catch (error) {
        console.error("Error creating resource:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- Gigs (Hustle) ---

export async function getGigs() {
    try {
        const { data, error } = await supabaseAdmin
            .from('gigs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, gigs: data };
    } catch (error) {
        console.error("Error fetching gigs:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createGig(data: {
    role: string;
    company: string;
    type: string;
    compensation: string;
    deadline: string;
    tags: string[];
    user_id: string;
    hot?: boolean;
}) {
    try {
        const { user_id, ...rest } = data;
        const { error } = await supabaseAdmin
            .from('gigs')
            .insert([{ ...rest, posted_by: user_id }]);

        if (error) throw error;
        revalidatePath("/dashboard/hustle");
        return { success: true };
    } catch (error) {
        console.error("Error creating gig:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- Projects (Forge) ---

export async function getProjects() {
    try {
        const { data, error } = await supabaseAdmin
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, projects: data };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createProject(data: {
    name: string;
    vision: string;
    type: string;
    needs: string[];
    user_id: string;
    status?: string;
}) {
    try {
        const { user_id, ...rest } = data;
        const { error } = await supabaseAdmin
            .from('projects')
            .insert([{ ...rest, lead_id: user_id, members_count: 1 }]);

        if (error) throw error;
        revalidatePath("/dashboard/forge");
        return { success: true };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- Hustle Bookmarks ---

export async function getBookmarkedGigIds(userId: string): Promise<string[]> {
    const { data } = await supabaseAdmin
        .from("hustle_bookmarks")
        .select("gig_id")
        .eq("user_id", userId);
    return data?.map((r: any) => r.gig_id) ?? [];
}

export async function toggleBookmark(userId: string, gigId: string, isBookmarked: boolean) {
    try {
        if (isBookmarked) {
            await supabaseAdmin
                .from("hustle_bookmarks")
                .delete()
                .eq("user_id", userId)
                .eq("gig_id", gigId);
        } else {
            await supabaseAdmin
                .from("hustle_bookmarks")
                .insert([{ user_id: userId, gig_id: gigId }]);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

// --- Forge Requests ---

export async function getMyForgeRequests(userId: string): Promise<{ project_id: string; status: string }[]> {
    const { data } = await supabaseAdmin
        .from("forge_requests")
        .select("project_id, status")
        .eq("user_id", userId);
    return data ?? [];
}

export async function requestToJoin(userId: string, projectId: string, message: string) {
    try {
        const { error } = await supabaseAdmin
            .from("forge_requests")
            .insert([{ user_id: userId, project_id: projectId, message }]);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

// --- Profile Skills ---

export async function updateSkills(userId: string, skills: string[]) {
    try {
        const { error } = await supabaseAdmin
            .from("profiles")
            .update({ skills })
            .eq("id", userId);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

// --- Dashboard Stats ---

export async function getDashboardStats(userId: string) {
    try {
        const [bookmarks, messages] = await Promise.all([
            supabaseAdmin.from("hustle_bookmarks").select("id", { count: "exact", head: true }).eq("user_id", userId),
            supabaseAdmin.from("lounge_messages").select("id", { count: "exact", head: true }).eq("user_id", userId),
        ]);
        return {
            success: true,
            savedCount: bookmarks.count ?? 0,
            messageCount: messages.count ?? 0,
        };
    } catch {
        return { success: false, savedCount: 0, messageCount: 0 };
    }
}
