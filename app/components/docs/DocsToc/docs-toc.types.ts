type DocsTocSection = {
  id: string;
  title: string;
  level: number;
};

type DocsTocProps = {
  sections: DocsTocSection[];
};

export type { DocsTocSection, DocsTocProps };