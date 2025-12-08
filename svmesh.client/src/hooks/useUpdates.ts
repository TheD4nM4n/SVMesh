import { useState, useEffect } from "react";
import type { UpdatePost } from "../utils/markdown";
import { parseMarkdownPost, sortPostsByDate } from "../utils/markdown";

// Import all markdown files dynamically
const updateModules = import.meta.glob("/src/content/updates/*.md", {
  as: "raw",
  eager: true,
});

export function useUpdates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const parsedPosts: UpdatePost[] = [];

        for (const [path, content] of Object.entries(updateModules)) {
          // Extract filename without extension as slug
          const slug = path.split("/").pop()?.replace(".md", "") || "";
          const post = await parseMarkdownPost(content as string, slug);
          parsedPosts.push(post);
        }

        // Sort posts by date (newest first)
        const sortedPosts = sortPostsByDate(parsedPosts);
        setPosts(sortedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load updates");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return { posts, loading, error };
}
