"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateMeetNowStatus(userId: string, isLive: boolean, intent: string | null = null) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ 
                live_now: isLive,
                meeting_intent: intent,
                meet_now_expiry: isLive ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : null // Default 1 hour
            })
            .eq('id', userId);

        if (error) throw error;

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/discovery");
        return { success: true };
    } catch (error) {
        console.error("Error in updateMeetNowStatus:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getLiveStudyCount() {
    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('live_now', true);
        
        if (error) throw error;
        return { success: true, count: count || 0 };
    } catch (error) {
        console.error("Error in getLiveStudyCount:", error);
        return { success: false, count: 0 };
    }
}
