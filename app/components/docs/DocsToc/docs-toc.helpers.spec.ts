import { describe, expect, it } from "vitest";
import type { TocLink } from "@nuxt/content";

import { mapSectionsToTocLinks } from "@/components/docs/DocsToc/docs-toc.helpers";
import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";

describe(mapSectionsToTocLinks, () => {
  it("should return an empty array when no sections are provided.", () => {
    expect(mapSectionsToTocLinks([])).toStrictEqual<TocLink[]>([]);
  });

  it("should map flat sections to top-level toc links when they are all at the same level.", () => {
    const sections: DocsTocSection[] = [
      { id: "/rules#concept", title: "The concept", level: 2 },
      { id: "/rules#golden-rule", title: "The golden rule", level: 2 },
    ];

    expect(mapSectionsToTocLinks(sections)).toStrictEqual<TocLink[]>([
      { id: "concept", text: "The concept", depth: 2 },
      { id: "golden-rule", text: "The golden rule", depth: 2 },
    ]);
  });

  it("should extract the anchor after the first hash when the section id contains a hash.", () => {
    const sections: DocsTocSection[] = [{ id: "/rules/section#my-heading", title: "My heading", level: 2 }];

    expect(mapSectionsToTocLinks(sections)).toStrictEqual<TocLink[]>([{ id: "my-heading", text: "My heading", depth: 2 }]);
  });

  it("should skip sections when the section id has no hash.", () => {
    const sections: DocsTocSection[] = [
      { id: "/rules", title: "Rules", level: 1 },
      { id: "/rules#concept", title: "The concept", level: 2 },
    ];

    expect(mapSectionsToTocLinks(sections)).toStrictEqual<TocLink[]>([{ id: "concept", text: "The concept", depth: 2 }]);
  });

  it("should nest deeper sections under the nearest shallower preceding section when the level goes back up.", () => {
    const sections: DocsTocSection[] = [
      { id: "/rules#concept", title: "The concept", level: 2 },
      { id: "/rules#detail", title: "A detail", level: 3 },
      { id: "/rules#other-detail", title: "Another detail", level: 3 },
      { id: "/rules#golden-rule", title: "The golden rule", level: 2 },
    ];

    expect(mapSectionsToTocLinks(sections)).toStrictEqual<TocLink[]>([
      {
        id: "concept",
        text: "The concept",
        depth: 2,
        children: [
          { id: "detail", text: "A detail", depth: 3 },
          { id: "other-detail", text: "Another detail", depth: 3 },
        ],
      },
      { id: "golden-rule", text: "The golden rule", depth: 2 },
    ]);
  });
});