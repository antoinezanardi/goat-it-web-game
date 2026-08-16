import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";

type DocsPageShellProps = {
  sections: DocsTocSection[];
};

type DocsPageShellSlots = {
  default: () => unknown;
};

export type { DocsPageShellProps, DocsPageShellSlots };