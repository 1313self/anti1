// ─────────────────────────────────────────────────────────────────────────────
// EraConnect — Shared TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
    id: string;
    full_name: string;
    academic_aim: string | null;
    bio: string | null;
    hobbies: string[] | null;
    skills: string[] | null;
    study_window: string | null;
    peak_hours: 'morning' | 'night' | null;
    instagram: string | null;
    discord: string | null;
    embedding: number[] | null;
    discovery_count: number;
    last_discovery_date: string | null;
    onboarding_step: number | null;
    updated_at: string;
}

export interface Gig {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    company: string | null;
    type: string;
    location: string | null;
    link: string | null;
    tags: string[] | null;
    created_at: string;
    is_bookmarked?: boolean;
}

export interface Project {
    id: string;
    lead_id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
    tags: string[] | null;
    team_size: number | null;
    created_at: string;
    lead_name?: string; // populated from join
}

export interface Resource {
    id: string;
    user_id: string;
    title: string;
    type: string;
    author_name: string | null;
    university: string | null;
    tags: string[] | null;
    file_url: string | null;
    downloads: number;
    created_at: string;
    is_bookmarked?: boolean;
}

export interface Message {
    id: string;
    user_id: string;
    display_name: string;
    content: string;
    created_at: string;
    reactions?: Reaction[];
    channel?: string;
}

export interface Reaction {
    message_id: string;
    user_id: string;
    emoji: string;
}

export interface ForgeRequest {
    id: string;
    project_id: string;
    user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message: string | null;
    created_at: string;
    profiles?: Pick<Profile, 'full_name'>;
}

export interface DashboardStats {
    savedGigs: number;
    messagesSent: number;
    projectsJoined: number;
}

export interface DiscoveryMatch {
    id: string;
    full_name: string;
    bio: string | null;
    hobbies: string[] | null;
    skills: string[] | null;
    academic_aim: string | null;
    similarity?: number;
    instagram: string | null;
    discord: string | null;
    compatibility_score: number;
    connection_reason: string;
    peak_hours?: 'morning' | 'night' | null;
}
