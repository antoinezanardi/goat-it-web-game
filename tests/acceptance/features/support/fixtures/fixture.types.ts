import type { ObjectId } from "mongodb";

type QuestionThemeFixtureDocument = {
  _id: ObjectId;
  slug: string;
  color?: string;
  label: Record<string, string>;
  aliases: Record<string, readonly string[]>;
  description: Record<string, string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type QuestionFixtureDocument = {
  _id: ObjectId;
  category: string;
  themes: readonly {
    themeId: ObjectId;
    isHint: boolean;
    isPrimary: boolean;
  }[];
  content: {
    statement: Record<string, string>;
    answer: Record<string, string>;
    context?: Record<string, string>;
    trivia?: Record<string, readonly string[]>;
  };
  cognitiveDifficulty: string;
  author: {
    role: string;
    name?: string;
    gameId?: ObjectId;
  };
  rejection?: {
    type: string;
    comment: string;
  };
  sourceUrls: readonly string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type FixtureRegistry = {
  "question-theme": {
    "two-english-only-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
    "five-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
    "sixty-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
  };
  "question": {
    "two-english-only-questions": FixtureDefinition<QuestionFixtureDocument>;
    "five-questions": FixtureDefinition<QuestionFixtureDocument>;
    "sixty-questions": FixtureDefinition<QuestionFixtureDocument>;
  };
};

type FixtureDomain = keyof FixtureRegistry;

type FixtureKey<Domain extends FixtureDomain> = keyof FixtureRegistry[Domain];

type FixtureReference<Domain extends FixtureDomain> = readonly [
  domain: Domain,
  name: FixtureKey<Domain>,
];

type AnyFixtureReference = {
  [Domain in FixtureDomain]: FixtureReference<Domain>
}[FixtureDomain];

type FixtureDefinition<TData> = {
  data: readonly TData[];
  dependencies?: readonly AnyFixtureReference[];
};

export type {
  AnyFixtureReference,
  FixtureDefinition,
  FixtureDomain,
  FixtureKey,
  FixtureReference,
  FixtureRegistry,
  QuestionFixtureDocument,
  QuestionThemeFixtureDocument,
};