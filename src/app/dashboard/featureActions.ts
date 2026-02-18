"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

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
