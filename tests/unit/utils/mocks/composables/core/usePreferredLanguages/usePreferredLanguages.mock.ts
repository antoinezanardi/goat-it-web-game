import { ref } from "vue";
import type { Ref } from "vue";

type UsePreferredLanguagesMock = {
  preferredLanguagesRef: Ref<string[]>;
};

function createUsePreferredLanguagesMock(): UsePreferredLanguagesMock {
  return {
    preferredLanguagesRef: ref<string[]>(["en"]),
  };
}

export type { UsePreferredLanguagesMock };

export { createUsePreferredLanguagesMock };