import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import type { Heading } from "./types";

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

/**
 * Renders markdown to HTML and injects stable, unicode-safe ids into h2/h3
 * headings so they can be deep-linked (e.g. from a table of contents).
 */
export async function renderMarkdown(
  content: string
): Promise<{ contentHtml: string; headings: Heading[] }> {
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content || "");
  const contentHtml = processed.toString();

  const headings: Heading[] = [];
  const headingRegex = /<h([2-3])>(.*?)<\/h[2-3]>/g;
  let i = 0;
  const contentHtmlWithIds = contentHtml.replace(headingRegex, (_m, level: string, text: string) => {
    const plain = text.replace(/<[^>]+>/g, "");
    const slugBase = plain
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    const id = `${slugBase || "section"}-${i}`;
    headings.push({ level: Number(level), text: plain, id });
    i += 1;
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return { contentHtml: contentHtmlWithIds, headings };
}
