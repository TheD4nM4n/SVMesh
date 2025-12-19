export interface PageMetadata {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  rightImage?: string;
  rightImageAlt?: string;
  attributionUrl?: string;
}

export interface ParsedPage {
  metadata: PageMetadata;
  content: string;
}

export async function parsePageMarkdown(pageName: string): Promise<ParsedPage> {
  try {
    // Fetch the markdown file from the server with cache busting
    const cacheBuster = `?v=${Date.now()}`;
    const response = await fetch(`/content/pages/${pageName}.md${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    const rawContent = await response.text();

    // Parse frontmatter
    const frontmatterMatch = rawContent.match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    );

    if (!frontmatterMatch) {
      throw new Error(`Invalid markdown format for page: ${pageName}`);
    }

    const [, frontmatterStr, content] = frontmatterMatch;

    // Parse YAML frontmatter
    const metadata: PageMetadata = {};
    const lines = frontmatterStr.split("\n");

    for (const line of lines) {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        (metadata as any)[key] = value;
      }
    }

    return {
      metadata,
      content: content.trim(),
    };
  } catch (error) {
    console.error(`Error loading page content for ${pageName}:`, error);
    throw error;
  }
}
