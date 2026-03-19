"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateStudyStatus(userId: string, isLive: boolean) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ live_now: isLive })
            .eq('id', userId);

        if (error) throw error;

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error in updateStudyStatus:", error);
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
