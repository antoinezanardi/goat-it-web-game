import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";
import { TRANSLATION_ID_LIMIT } from "@/composables/domain/useGameQuestionTranslation/use-game-question-translation.constants";
import type { UseGameQuestionTranslation } from "@/composables/domain/useGameQuestionTranslation/use-game-question-translation.types";

/**
 * Re-fetches the buffered questions in the new locale whenever the user switches language.
 *
 * At most the latest 100 ids are translated. The first row returned per id wins, and only those ids replace their
 * counterpart in the original snapshot, preserving order and untouched questions. The watcher skips the fetch while
 * `canTranslateQuestions` is false; failures surface through the API-error toast.
 */
function useGameQuestionTranslation(questions: Ref<Question[]>, canTranslateQuestions: MaybeRefOrGetter<boolean>): UseGameQuestionTranslation {
  const store = useGameStore();
  const { isFetchingQuestionsByIds } = storeToRefs(store);
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { locale, t } = useI18n();

  const isTranslating = computed<boolean>(() => isFetchingQuestionsByIds.value);

  async function translateQuestions(): Promise<void> {
    const snapshot = [...questions.value];
    const snapshotIds = snapshot.map(question => question.id);
    const selectedIds = snapshotIds.length <= TRANSLATION_ID_LIMIT ? snapshotIds : snapshotIds.slice(-TRANSLATION_ID_LIMIT);
    const result = await store.fetchQuestionsByIds(selectedIds);
    if (!result.ok) {
      if (result.superseded === true) {
        return;
      }
      handleGoatItApiError(result.error, { title: t("questions.cantFetch"), context: "questions-translation" });

      return;
    }

    const translationById: Map<string, Question> = new Map();
    for (const question of result.value) {
      if (!translationById.has(question.id)) {
        translationById.set(question.id, question);
      }
    }

    store.replaceQuestions(snapshot.map(question => translationById.get(question.id) ?? question));
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