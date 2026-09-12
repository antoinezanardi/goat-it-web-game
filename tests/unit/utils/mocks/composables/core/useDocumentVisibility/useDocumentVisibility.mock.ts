import { ref } from "vue";
import type { Ref } from "vue";

type UseDocumentVisibilityMock = {
  documentVisibilityRef: Ref<DocumentVisibilityState>;
};

function createUseDocumentVisibilityMock(): UseDocumentVisibilityMock {
  return {
    documentVisibilityRef: ref<DocumentVisibilityState>("visible"),
  };
}

export type { UseDocumentVisibilityMock };

export { createUseDocumentVisibilityMock };