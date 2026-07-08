import type { Store, StoreDefinition } from "pinia";
import type { Mock } from "vitest";

type ToMock<Stub> = {
  [Key in keyof Stub]: Stub[Key] extends (...arguments_: unknown[]) => unknown ? Mock<Stub[Key]> : Stub[Key];
};

type MockedPiniaStore<TStoreDefinition extends () => unknown> =
  TStoreDefinition extends StoreDefinition<
    infer Id,
    infer State,
    infer Getters,
    infer Actions
  > ?
  Store<
    Id,
    State,
    Record<string, never>,
    {
      [Key in keyof Actions]: Actions[Key] extends (
        ...arguments_: infer Arguments
      ) => infer ReturnT ?
        Mock<(...arguments_: Arguments) => ReturnT> :
        Actions[Key];
    }
  > & {
    [Key in keyof Getters]: Getters[Key] extends ComputedRef<infer Value> ? Value : never;
  } : ReturnType<TStoreDefinition>;

export type {
  ToMock,
  MockedPiniaStore,
};