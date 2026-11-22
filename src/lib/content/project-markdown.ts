import { unified } from "unified";
import remarkParse from "remark-parse";
import type { PhrasingContent, RootContent } from "mdast";

export type NarrativeBlock = { type: "paragraph"; text: string } | { type: "list"; items: string[] };
export type NarrativeSection = { id: string; title: string; blocks: NarrativeBlock[] };

function plainText(children: PhrasingContent[]): string {
  return children.map((node) => {
    if (node.type === "text" || node.type === "inlineCode") return node.value;
    if (node.type === "emphasis" || node.type === "strong") return plainText(node.children);
    throw new Error(`Unsupported narrative inline content: ${node.type}`);
  }).join("");
}

export function parseProjectMarkdown(source: string): NarrativeSection[] {
  const tree = unified().use(remarkParse).parse(source);
  const sections: NarrativeSection[] = [];
  for (const node of tree.children as RootContent[]) {
    if (node.type === "heading" && node.depth === 2) {
      const title = plainText(node.children).trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (!id || sections.some((section) => section.id === id)) throw new Error("Narrative headings must be nonempty and unique");
      sections.push({ id, title, blocks: [] });
      continue;
    }
    const section = sections.at(-1);
    if (!section) throw new Error("Narratives must start with a level-two heading");
    if (node.type === "paragraph") section.blocks.push({ type: "paragraph", text: plainText(node.children) });
    else if (node.type === "list") {
      const items = node.children.map((item) => item.children.map((child) => {
        if (child.type !== "paragraph") throw new Error("Narrative lists must contain plain paragraphs");
        return plainText(child.children);
      }).join(" "));
      section.blocks.push({ type: "list", items });
    } else throw new Error(`Unsupported narrative block: ${node.type}`);
  }
  if (!sections.length || sections.some((section) => section.blocks.length === 0)) throw new Error("Narratives require populated sections");
  return sections;
}
