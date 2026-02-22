"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function signUpUser(formData: { email: string; password: string }) {
    try {
        const { email, password } = formData;

        // Create user with admin privileges to auto-confirm
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (error) {
            if (error.message.includes("User already registered")) {
                throw new Error("Activation Failed: Profile already exists in the EraConnect system.");
            }
            throw error;
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error("Error in signUpUser:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Bypasses email confirmation for a user.
 * Useful for development or when email delivery is unreliable.
 */
export async function confirmUserAccount(email: string) {
    try {
        // Find the user first
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        const user = users.find(u => u.email === email);
        if (!user) throw new Error("Cloud Identity not found.");

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (updateError) throw updateError;
        return { success: true };
    } catch (error) {
        console.error("Error in confirmUserAccount:", error);
        return { success: false, error: (error as Error).message };
    }
}
