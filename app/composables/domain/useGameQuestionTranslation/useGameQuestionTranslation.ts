import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";

const TRANSLATION_ID_LIMIT = 100;

type UseGameQuestionTranslation = {
  isTranslating: ComputedRef<boolean>;
};

function useGameQuestionTranslation(questions: Ref<Question[]>, canTranslate: () => boolean): UseGameQuestionTranslation {
  const store = useGameStore();
  const { isFetchingByIds } = storeToRefs(store);
  const { locale } = useI18n();

  const isTranslating = computed<boolean>(() => isFetchingByIds.value);

  watch(locale, async() => {
    if (!canTranslate()) {
      return;
    }

    const snapshot = [...questions.value];
    const selectedIds = snapshot.length <= TRANSLATION_ID_LIMIT ? snapshot.map(question => question.id) : snapshot.slice(-TRANSLATION_ID_LIMIT).map(question => question.id);

    const translated = await store.fetchQuestionsByIds(selectedIds);
    if (!translated) {
      return;
    }

    const translationById: Map<string, Question> = new Map();
    for (const question of translated) {
      if (!translationById.has(question.id)) {
        translationById.set(question.id, question);
      }
    }

    // Acceptable as questions is a Vue Ref and updating .value is the standard reactive pattern
    // oxlint-disable-next-line eslint/no-param-reassign
    questions.value = snapshot.map(question => translationById.get(question.id) ?? question);
  });

  return {
    isTranslating,
  };
}

export type { UseGameQuestionTranslation };

export { useGameQuestionTranslation };