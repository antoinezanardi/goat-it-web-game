import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";
import { TRANSLATION_ID_LIMIT } from "~/composables/domain/useGameQuestionTranslation/use-game-question-translation.constants";
import type { UseGameQuestionTranslation } from "~/composables/domain/useGameQuestionTranslation/use-game-question-translation.types";

function useGameQuestionTranslation(questions: Ref<Question[]>, canTranslateQuestions: MaybeRefOrGetter<boolean>): UseGameQuestionTranslation {
  const store = useGameStore();
  const { isFetchingQuestionsByIds } = storeToRefs(store);
  const { locale } = useI18n();

  const isTranslating = computed<boolean>(() => isFetchingQuestionsByIds.value);

  async function translateQuestions(): Promise<void> {
    const snapshot = [...questions.value];
    const snapshotIds = snapshot.map(question => question.id);
    const selectedIds = snapshotIds.length <= TRANSLATION_ID_LIMIT ? snapshotIds : snapshotIds.slice(-TRANSLATION_ID_LIMIT);
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
  }

  watch(locale, async() => {
    if (!toValue(canTranslateQuestions)) {
      return;
    }
    await translateQuestions();
  });

  return {
    isTranslating,
  };
}

export { useGameQuestionTranslation };