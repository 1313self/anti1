export interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

/**
 * Fetches the top 3 a student's public GitHub repositories as "Proof-of-Skill".
 * This uses the public GitHub API and does not require an API key for basic use (subject to rate limits).
 */
export async function getStudentRepos(username: string): Promise<GithubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error("GitHub API Error");
    }

    const repos: GithubRepo[] = await response.json();
    return repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at
    }));
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}
