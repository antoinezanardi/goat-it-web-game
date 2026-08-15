import type { TocLink } from "@nuxt/content";

import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";

function mapSectionsToTocLinks(sections: DocsTocSection[]): TocLink[] {
  const tocLinks: TocLink[] = [];
  const ancestors: TocLink[] = [];

  for (const section of sections) {
    if (section.id.includes("#")) {
      const tocLink: TocLink = {
        id: section.id.slice(section.id.indexOf("#") + 1),
        text: section.title,
        depth: section.level,
      };

      while (ancestors.length > 0) {
        const topAncestor = ancestors.at(-1);

        if (topAncestor === undefined || topAncestor.depth < section.level) {
          break;
        }

        ancestors.pop();
      }

      const parent = ancestors.at(-1);

      if (parent === undefined) {
        tocLinks.push(tocLink);
      } else {
        parent.children = [...parent.children ?? [], tocLink];
      }

      ancestors.push(tocLink);
    }
  }
  return tocLinks;
}

export { mapSectionsToTocLinks };