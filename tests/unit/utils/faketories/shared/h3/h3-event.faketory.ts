import type { H3Event } from "h3";

type FakeH3EventOptions = {
  params?: Record<string, string>;
};

function createFakeH3Event(options: FakeH3EventOptions = {}): H3Event {
  // Acceptable as H3Event is complex and only the context/params subset is needed for handler tests
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return { context: { params: options.params ?? {} } } as unknown as H3Event;
}

export type {
  FakeH3EventOptions,
};

export {
  createFakeH3Event,
};