import { vi } from "vitest";
import type { Mock } from "vitest";

type QueryCollectionMockEntry = {
  all: Mock<() => Promise<unknown>>;
  first: Mock<() => Promise<unknown>>;
  select: Mock<(...fields: string[]) => QueryCollectionMockEntry>;
  order: Mock<(field: string, direction: "ASC" | "DESC") => QueryCollectionMockEntry>;
  limit: Mock<(limit: number) => QueryCollectionMockEntry>;
};

type QueryCollectionMockSignature = (collection: string) => QueryCollectionMockEntry;

type QueryCollectionMock = Mock<QueryCollectionMockSignature>;

function createQueryCollectionMockEntry(): QueryCollectionMockEntry {
  const entry: QueryCollectionMockEntry = {
    all: vi.fn<() => Promise<unknown>>().mockResolvedValue([]),
    first: vi.fn<() => Promise<unknown>>().mockResolvedValue(),
    select: vi.fn<(...fields: string[]) => QueryCollectionMockEntry>(),
    order: vi.fn<(field: string, direction: "ASC" | "DESC") => QueryCollectionMockEntry>(),
    limit: vi.fn<(limit: number) => QueryCollectionMockEntry>(),
  };

  entry.select.mockReturnValue(entry);
  entry.order.mockReturnValue(entry);
  entry.limit.mockReturnValue(entry);

  return entry;
}

function createQueryCollectionMock(): QueryCollectionMock {
  return vi.fn<QueryCollectionMockSignature>().mockReturnValue(createQueryCollectionMockEntry());
}

export type {
  QueryCollectionMock,
  QueryCollectionMockEntry,
  QueryCollectionMockSignature,
};

export { createQueryCollectionMock, createQueryCollectionMockEntry };