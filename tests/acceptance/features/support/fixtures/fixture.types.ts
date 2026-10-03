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
  isAdultContent: boolean;
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

type CookieFixture = {
  name: string;
  value: string;
};

type CookieFixtureRegistry = Record<string, readonly CookieFixture[]>;

type FixtureRegistry = {
  "question-theme": {
    "single-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
    "two-english-only-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
    "five-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
    "sixty-question-themes": FixtureDefinition<QuestionThemeFixtureDocument>;
  };
  "question": {
    "single-question": FixtureDefinition<QuestionFixtureDocument>;
    "single-translatable-question": FixtureDefinition<QuestionFixtureDocument>;
    "single-no-context-question": FixtureDefinition<QuestionFixtureDocument>;
    "two-english-only-questions": FixtureDefinition<QuestionFixtureDocument>;
    "five-active-questions": FixtureDefinition<QuestionFixtureDocument>;
    "sixty-questions": FixtureDefinition<QuestionFixtureDocument>;
    "single-multi-themes-question": FixtureDefinition<QuestionFixtureDocument>;
    "single-adult-content-question": FixtureDefinition<QuestionFixtureDocument>;
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
  CookieFixture,
  CookieFixtureRegistry,
  FixtureDefinition,
  FixtureDomain,
  FixtureKey,
  FixtureReference,
  FixtureRegistry,
  QuestionFixtureDocument,
  QuestionThemeFixtureDocument,
};