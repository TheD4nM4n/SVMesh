import { useState, useEffect } from "react";
import type { UpdatePost } from "../utils/markdown";
import { parseMarkdownPost, sortPostsByDate } from "../utils/markdown";

// Fetch markdown files dynamically from the server
const fetchUpdateFiles = async () => {
  const updateModules: Record<string, string> = {};

  try {
    // First, get the list of available files from the API
    const listResponse = await fetch("/api/content/updates");
    if (!listResponse.ok) {
      throw new Error(`Failed to get file list: ${listResponse.status}`);
    }

    const { files } = await listResponse.json();

    // Then fetch each file's content
    for (const fileName of files) {
      try {
        const response = await fetch(`/content/updates/${fileName}`);
        if (response.ok) {
          updateModules[`/updates/${fileName}`] = await response.text();
        } else {
          console.warn(`Failed to fetch ${fileName}: ${response.status}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to load update files:", error);
  }

  return updateModules;
};

export function useUpdates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const updateModules = await fetchUpdateFiles();
        const parsedPosts: UpdatePost[] = [];

        for (const [path, content] of Object.entries(updateModules)) {
          // Extract filename without extension as slug
          const slug = path.split("/").pop()?.replace(".md", "") || "";
          const post = parseMarkdownPost(content, slug);
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
