export interface UpdateMetadata {
  title: string;
  date: string;
  summary: string;
  tag?: string;
}

export interface UpdatePost {
  metadata: UpdateMetadata;
  content: string;
  slug: string;
}

export async function parseMarkdownPost(
  markdownContent: string,
  slug: string
): Promise<UpdatePost> {
  // Extract frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);

  if (!match) {
    throw new Error("Invalid markdown format - missing frontmatter");
  }

  const [, frontmatter, content] = match;

  // Parse frontmatter
  const metadata: UpdateMetadata = {
    title: "",
    date: "",
    tag: "",
    summary: "",
  };

  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key.trim() in metadata) {
        (metadata as any)[key.trim()] = value;
      }
    }
  });

  return {
    metadata,
    content: content.trim(),
    slug,
  };
}

export function sortPostsByDate(posts: UpdatePost[]): UpdatePost[] {
  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}
