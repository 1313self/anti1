"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateEmbedding, getFlashModel } from "@/lib/gemini";

const DAILY_DISCOVERY_LIMIT = 3;

export async function findConnections(userId: string) {
    try {
        // 1. Get user profile and embedding using Admin context
        const { data: userProfile, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError || !userProfile) {
            return {
                success: false,
                error: "Your profile was not found. Please complete the onboarding protocol to initialize your digital identity.",
                onboardingRequired: true
            };
        }

        // Auto-heal missing embeddings if bio exists
        if (!userProfile.embedding && userProfile.bio?.trim()) {
            console.log("Discovery Engine: Missing vector data detected. Initiating auto-healing for user:", userId);
            const embedding = await generateEmbedding(userProfile.bio);
            if (embedding) {
                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update({ embedding })
                    .eq('id', userId);

                if (!updateError) {
                    userProfile.embedding = embedding;
                    console.log("Discovery Engine: Profile healed successfully.");
                } else {
                    console.error("Discovery Engine: Healing failed (database error):", updateError);
                }
            } else {
                console.error("Discovery Engine: Healing failed (AI generation error). Check Gemini API Key.");
            }
        }

        if (!userProfile.embedding) {
            return {
                success: false,
                error: "Discovery Engine Activation Failed: A descriptive bio is required for synergy analysis. Please head to your profile to complete this setup.",
                onboardingRequired: true
            };
        }

        // --- Rate Limiting Logic ---
        const today = new Date().toISOString().split('T')[0];
        let currentCount = userProfile.discovery_count || 0;
        const lastDate = userProfile.last_discovery_date;

        if (lastDate !== today) {
            currentCount = 0; // Reset for new day
        }

        const useFallback = currentCount >= DAILY_DISCOVERY_LIMIT;

        if (!useFallback) {
            // Increment count if we are going to use the API
            await supabaseAdmin
                .from('profiles')
                .update({
                    discovery_count: currentCount + 1,
                    last_discovery_date: today
                })
                .eq('id', userId);
        } else {
            console.log(`Discovery Engine: Rate limit reached for user ${userId}. Using fallback mechanism.`);
        }

        const remainingAttempts = Math.max(0, DAILY_DISCOVERY_LIMIT - (useFallback ? currentCount : currentCount + 1));

        // 2. Search for similar profiles using match_profiles RPC (Admin bypass RLS)
        const { data: matches, error: matchError } = await (supabaseAdmin.rpc('match_profiles', {
            query_embedding: userProfile.embedding,
            match_threshold: 0.5,
            match_count: 10,
        }) as any).select('id, full_name, bio, hobbies, skills, academic_aim, similarity, instagram, discord, github_username, university, live_now, meeting_intent, meet_now_expiry');

        if (matchError) throw matchError;

        // Filter out the user themselves
        const filteredMatches = (matches || []).filter((m: any) => m.id !== userId);

        if (filteredMatches.length === 0) {
            return { success: true, connections: [], remainingAttempts };
        }

        let finalConnections = [];

        if (!useFallback) {
            // 3a. Standard Mode: Use Gemini 1.5 Flash to analyze connections
            try {
                const prompt = `
            You are an AI Synergy Analyst for "EraConnect", a professional campus networking platform.
            Target User Profile:
            - Name: ${userProfile.full_name}
            - Bio: ${userProfile.bio}
            - Skills: ${userProfile.skills?.join(", ") || "None listed"}
            - Hobbies: ${userProfile.hobbies?.join(", ")}
            - Academic Aim: ${userProfile.academic_aim}
            - Peak Hours: ${userProfile.peak_hours}

            Potential Collaborators:
            ${filteredMatches.map((m: any, i: number) => `
            Collaborator ${i + 1}:
            - Name: ${m.full_name}
            - Bio: ${m.bio}
            - Skills: ${m.skills?.join(", ") || "None listed"}
            - Major: ${m.academic_aim}
            - Live Now: ${m.live_now ? "YES" : "NO"}
            - Meeting Intent: ${m.meeting_intent || "N/A"}
            `).join("\n")}

            For each collaborator, provide:
            1. A compatibility_score (1-100). 
               - Higher scores for complementary skills (e.g., Designer + Developer).
               - SIGNIFICANT bonus (+20) if they are "Live Now" and their "Meeting Intent" matches the target user's context (e.g., both want Coffee Chat or Help).
               - High scores for shared niche goals.
            2. A connection_reason (One friendly, short sentence. If they are Live, mention why their intent is a great match for a quick campus meetup).

            Return the data in a strict JSON array format:
            [
                {"id": "match_id_1", "compatibility_score": 85, "connection_reason": "..."},
                ...
            ]
            Ensure the order matches the potential collaborators provided.
            `.trim();

                const flashModel = getFlashModel(); // Get rotated client
                const result = await flashModel.generateContent(prompt);
                const responseText = result.response.text();

                // Extract JSON from response (handling potential markdown formatting)
                const jsonMatch = responseText.match(/\[[\s\S]*\]/);
                const analyzedMatches = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

                // Combine data
                finalConnections = filteredMatches.map((m: any) => {
                    const analysis = analyzedMatches.find((a: any) => a.id === m.id) ||
                        analyzedMatches[filteredMatches.indexOf(m)]; // fallback by index
                    return {
                        ...m,
                        compatibility_score: analysis?.compatibility_score || 70,
                        connection_reason: analysis?.connection_reason || "You share similar academic interests."
                    };
                });
            } catch (aiError) {
                console.error("Gemini API Error (falling back to vector scores):", aiError);
                // If API fails, fallback to vector scores
                finalConnections = mapFallbackResults(filteredMatches, userProfile);
            }
        } else {
            // 3b. Fallback Mode: Use Vector Scores
            finalConnections = mapFallbackResults(filteredMatches, userProfile);
        }

        return { success: true, connections: finalConnections, limitReached: useFallback, remainingAttempts };

    } catch (error) {
        console.error("Error in findConnections:", error);
        return { success: false, error: (error as Error).message };
    }
}

// Helper to generate a deterministic reason based on profile data
function generateDeterministicReason(userProfile: any, matchProfile: any): string {
    const sharedSkills = userProfile.skills?.filter((s: string) => matchProfile.skills?.includes(s)) || [];
    const sharedHobbies = userProfile.hobbies?.filter((h: string) => matchProfile.hobbies?.includes(h)) || [];
    const sameAim = userProfile.academic_aim === matchProfile.academic_aim;
    const samePeak = userProfile.peak_hours === matchProfile.peak_hours;

    // Flash Networking Robustness: Intent Match
    if (userProfile.live_now && matchProfile.live_now && userProfile.meeting_intent && matchProfile.meeting_intent) {
        const myIntent = userProfile.meeting_intent.split(":")[0]?.toLowerCase();
        const theirIntent = matchProfile.meeting_intent.split(":")[0]?.toLowerCase();
        if (myIntent === theirIntent) {
            return `Perfect match! You both want a ${myIntent} right now on campus.`;
        }
    }

    if (sharedSkills.length > 0) {
        return `You both excel in ${sharedSkills.join(" and ")}, making you a powerful duo.`;
    }
    if (sameAim && sharedHobbies.length > 0) {
        return `You both study ${matchProfile.academic_aim} and enjoy ${sharedHobbies[0]}.`;
    }
    if (sameAim) {
        return `You are both focused on ${matchProfile.academic_aim}, ideal for academic collaboration.`;
    }
    if (matchProfile.live_now) {
        return `${matchProfile.full_name} is live now for a ${matchProfile.meeting_intent?.split(":")[0] || "chat"}!`;
    }
    if (sharedHobbies.length > 0) {
        return `You both share an interest in ${sharedHobbies.join(" and ")}.`;
    }
    if (samePeak) {
        return `You both prefer being active during the ${matchProfile.peak_hours}.`;
    }

    return "High potential for collaboration based on academic synergy.";
}

function mapFallbackResults(matches: any[], userProfile: any) {
    return matches.map((m: any) => ({
        ...m,
        // Convert similarity (0-1) to score (0-100), ensuring int
        compatibility_score: Math.round((m.similarity || 0) * 100),
        connection_reason: generateDeterministicReason(userProfile, m)
    }));
}


