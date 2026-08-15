import type { TocLink } from "@nuxt/content";

import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";

function mapSectionToTocLink(section: DocsTocSection): TocLink {
  return {
    id: section.id.slice(section.id.indexOf("#") + 1),
    text: section.title,
    depth: section.level,
  };
}

function pruneDeeperAncestors(ancestors: TocLink[], level: number): void {
  let topAncestor = ancestors.at(-1);

  while (topAncestor !== undefined && topAncestor.depth >= level) {
    ancestors.pop();
    topAncestor = ancestors.at(-1);
  }
}

function appendTocLink(tocLinks: TocLink[], ancestors: TocLink[], tocLink: TocLink): void {
  const parent = ancestors.at(-1);

  if (parent === undefined) {
    tocLinks.push(tocLink);
  } else {
    parent.children = [...parent.children ?? [], tocLink];
  }

  ancestors.push(tocLink);
}

function mapSectionsToTocLinks(sections: DocsTocSection[]): TocLink[] {
  const tocLinks: TocLink[] = [];
  const ancestors: TocLink[] = [];

  for (const section of sections) {
    if (section.id.includes("#")) {
      const tocLink = mapSectionToTocLink(section);

      pruneDeeperAncestors(ancestors, section.level);
      appendTocLink(tocLinks, ancestors, tocLink);
    }
  }
  return tocLinks;
}

export { mapSectionsToTocLinks };