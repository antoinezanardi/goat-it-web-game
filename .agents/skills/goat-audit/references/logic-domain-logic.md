# LOGIC — Domain logic & data correctness

Correctness of the Goat It game domain: the question feed (random batches, prefetch, exclusion list, restart on filter change), the derived game page state machine (`loading`, `playing`, `game-over`, `error`, `no-matching-filters-questions`), game settings and filters, the theme catalog, locale switches during play, the persisted preference cookies (`game_settings`, `changelog_state`, `game_tutorial_invitation_decided`, `goat_it_locale`), and the agreement between client constants, shared schemas, server mappers and the `@goat-it/schemas` upstream contract. Checks also verify that the rules (`content/*/rules.md`) and the release notes (`content/*/changelog/*.md`, `CHANGELOG.md`) describe what the code actually does.

**Decision doc:** `docs/game-logic.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** timeouts, retries, cancellation primitive, proxy limit clamping, upstream DTO strictness and generic resilience → REL · error copy, toasts, empty/terminal screen presentation → UX · store layering, mutation boundary, file placement → ARCH · translation completeness and locale routing → I18N · cookie flags, consent and stored personal data → PRIV · cookie security attributes → SEC · test coverage of flows → TEST

## Contents

- [1. Conformance to rules, specs and changelog claims](#1-conformance-to-rules-specs-and-changelog-claims)
- [2. State-machine completeness](#2-state-machine-completeness)
- [3. Async ordering and races](#3-async-ordering-and-races)
- [4. Dedup and invariants](#4-dedup-and-invariants)
- [5. Persisted-state evolution](#5-persisted-state-evolution)
- [6. Client/server agreement](#6-clientserver-agreement)
- [7. Locale and settings changes mid-flow](#7-locale-and-settings-changes-mid-flow)
- [Sources](#sources)

## 1. Conformance to rules, specs and changelog claims

- **[LOGIC-01] Card delivers what the rules promise** — For every playable question, the game card exposes each element `content/*/rules.md` tells the game master the app provides: statement, answer, context, trivia, sources, primary theme, category and cognitive difficulty. No rules section describes a card element that the domain `Question` type or the card does not provide.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/rules.md`, `shared/types/question.types.ts`, `app/components/domain/game/GameQuestionCard/**` · Src: [6], project: content/fr/rules.md
- **[LOGIC-02] Rules mechanics identical in every locale** — The six `content/<locale>/rules.md` files (de, en, es, fr, it, pt) state the same game mechanics as `content/fr/rules.md`: yes/no or two-option answers only, minimum of 1 game master + 1 player, one device used by the game master, no external search, no penalty for wrong guesses. No locale adds, drops or changes a rule.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `content/*/rules.md` · Src: [9], project: content/fr/rules.md
- **[LOGIC-03] Release-note claims are implemented** — Each behavior promised in the latest `content/*/changelog/<version>.md` "Improvements" and "Fixes" entries maps to a concrete domain code path, for example: filters persist across reloads, applying filters replaces only upcoming questions, closing filters with unapplied changes asks for confirmation, and a language switch updates questions in order. A claim with no implementing code path is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/changelog/*.md`, `CHANGELOG.md`, `app/composables/domain/**` · Src: project: content/fr/changelog/1.10.0.md, project: CHANGELOG.md
- **[LOGIC-04] Documented domain contract matches the code** — The documented game-state contract matches the implementation: the state precedence, the prefetch threshold, the exclusion cap and restart truncation. A changed constant or branch order updates its documentation in the same change.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/domain/useGame/**`, `app/composables/domain/useGameQuestionFeed/**` · Src: project: docs/jsdoc.md, project: docs/architecture.md §4.2
- **[LOGIC-05] Filter persistence holds end to end** — After filters are applied on `/game` and the page reloads, the filters modal shows the same selections and the first random-questions request sends the same filter keys. The game state never resets to defaults unless the stored value was invalid.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [10], project: content/fr/changelog/1.10.0.md

## 2. State-machine completeness

- **[LOGIC-06] Single derived game state** — `GamePageState` is a closed union (`loading`, `playing`, `game-over`, `error`, `no-matching-filters-questions`) computed in exactly one place through mutually exclusive branches; components and composables consume it and never re-derive a terminal state from raw feed flags.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGame/**`, `app/components/domain/game/GameStateRenderer/**` · Src: [7], project: docs/architecture.md §4.2
- **[LOGIC-07] Failure, exhaustion and empty filters stay distinct** — A failed batch sets only the fetch-error flag. A successful empty batch without narrowing filters sets only `isExhausted`. A successful empty batch with a narrowing filter (categories, cognitive difficulties or theme ids) sets only `hasNoMatchingFiltersQuestions`. No code path turns a failed fetch into `game-over` or `no-matching-filters-questions`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameQuestionFeed/**`, `app/composables/domain/useGame/**` · Src: [3], [7], project: docs/architecture.md §4.3
- **[LOGIC-08] Upstream failure renders the error state** — With the random-questions route forced to fail (5xx, timeout or malformed payload), `/game` shows the `error` state and never the game-over or empty-filters screens. A forced `200 []` with default settings renders game over.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [3], [7], [8]
- **[LOGIC-09] Superseded results leave game state untouched** — Each game consumer of a store `AsyncResult` (feed, translation, settings sync, filters apply, theme catalog fetch) returns before any flag write, state write or toast when `result.superseded === true`. A superseded batch never sets the fetch-error, `isExhausted` or `hasNoMatchingFiltersQuestions` flags.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/**`, `app/App.vue`, `shared/types/async-result.types.ts` · Src: [1], project: docs/architecture.md §4.3
- **[LOGIC-10] No stuck or hollow state** — No flag combination yields `loading` while nothing is pending and no terminal flag is set after the first fetch has settled. No combination yields `playing` while `currentQuestion` is `undefined`. When the index is past the buffer and no fetch is pending, the state resolves to `game-over`, `error` or `no-matching-filters-questions`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGame/**`, `app/composables/domain/useGameQuestionFeed/**` · Src: [6], [7]
- **[LOGIC-11] Terminal states have exit transitions** — `error` leads to a retry (`retryQuestionFetch`). `no-matching-filters-questions` leads to a filter reset (`resetFilters`). `game-over` leads to replay or home. Each recovery clears the terminal flags before it refetches, and a successful non-empty batch returns the state to `playing`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGame/**`, `app/composables/domain/useGameQuestionFeed/**` · Src: [7], [9]
- **[LOGIC-12] One terminal-state definition** — A single terminal-state definition lists exactly `game-over`, `error` and `no-matching-filters-questions`; play-time features gate on that definition or on an explicit `playing` test, never on a private list of states.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/utils/domain/game/helpers/game-state/**`, `app/composables/domain/useGameTutorialInvitation/**`, `app/composables/domain/useGameTutorial/**`, `app/composables/domain/useGameLeaveConfirmation/**` · Src: project: docs/architecture.md §4.5
- **[LOGIC-13] Navigation stays within the buffer** — Advancing does nothing in `game-over`, going back does nothing at index 0, and `currentIndex` never leaves `[0, questions.length]`. The route-leave confirmation applies only while the state is `playing` and reads the state at navigation time.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGame/**`, `app/composables/domain/useGameLeaveConfirmation/**` · Src: [6]

## 3. Async ordering and races

- **[LOGIC-14] Stale batch dropped after a filter change** — A restart with new filters supersedes any in-flight random-questions request on the same `useAsyncAction` lane. A batch requested with the previous filters is never appended after the restart has truncated the buffer.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/domain/game/**`, `app/composables/domain/useGameQuestionFeed/**`, `app/composables/domain/useGameSettingsSync/**` · Src: [1], [4]
- **[LOGIC-15] Restart only on a real filter change** — `useGameSettingsSync` deep-compares the current fetch filters with the last applied ones and skips the restart when they are equal. It records the new filters as applied before awaiting the restart, so concurrent triggers (filters apply plus a theme catalog refresh) cause at most one restart per distinct filter set.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameSettingsSync/**`, `app/composables/domain/useGameFetchFilters/**` · Src: [1]
- **[LOGIC-16] Prefetch fires once per threshold crossing** — The prefetch watcher sends at most one batch each time `currentIndex` crosses `GAME_PREFETCH_THRESHOLD` (0.8) of the buffer length. It is skipped while a batch is pending, after exhaustion and while `hasNoMatchingFiltersQuestions` is set, and its guard resets only when the pending batch settles.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/**` · Src: [1]
- **[LOGIC-17] No double submit on game actions** — Filters apply, fetch retry and filter reset each expose a pending flag (`isApplyFiltersPending`, `isFetchingQuestions`) that disables the triggering control. Two rapid activations produce one effective restart or refetch.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameFiltersModal/**`, `app/composables/domain/useGame/**`, `app/components/domain/game/GameQuestionsFiltersModal/**` · Src: [1], [4]
- **[LOGIC-18] Translation never drops appended questions** — Re-translating on a locale switch snapshots the buffer and replaces only ids that match the translation result, keeping the snapshot order. Questions appended to the buffer after the snapshot are kept: either `canTranslateQuestions` prevents the append, or the translated result is merged into the current buffer instead of overwriting it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameQuestionTranslation/**`, `app/stores/domain/game/**` · Src: [1], project: content/fr/changelog/1.10.0.md
- **[LOGIC-19] Translation never restores truncated questions** — A translation result that settles after a restart has truncated the buffer cannot bring back the dropped upcoming questions (fetched with the old filters). Either the restart supersedes or invalidates the translation, or the replacement applies only to ids still in the buffer.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameQuestionTranslation/**`, `app/composables/domain/useGameQuestionFeed/**` · Src: [1]
- **[LOGIC-20] A failed batch reaches error state even when the toast is skipped** — When a batch fails while the browser is confirmed offline (`isConfirmedOfflineFetchError`), the toast is skipped but the fetch-error flag is still set, so the state machine reaches `error` and a retry is available.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/**` · Src: [3], [8]

## 4. Dedup and invariants

- **[LOGIC-21] Buffer ids are unique and appends are idempotent** — `fetchAndAppendRandomQuestions` appends only questions whose id is not already buffered and returns only those newly appended questions. Replaying the random-questions search after an ambiguous failure can therefore never add a duplicate buffer entry.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/domain/game/**` · Src: [2]
- **[LOGIC-22] Exhaustion only on true exhaustion** — Game over is declared only when the upstream returns no question for the current filters and exclusion list. A batch whose questions are all already buffered (possible once the buffer exceeds the exclusion cap) is not reported as exhaustion, unless `docs/game-logic.md` documents that choice.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/**`, `app/stores/domain/game/**` · Src: [7], project: docs/architecture.md §4.3
- **[LOGIC-23] Exclusion list is newest-first, deduplicated and capped** — `buildExcludedQuestionIds` walks the buffer from newest to oldest, drops duplicate ids and stops at `GAME_EXCLUDED_IDS_MAXIMUM`. The first request of a game omits `excludedIds`, and later requests never send an empty array.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameQuestionFeed/helpers/**`, `app/composables/domain/useGameQuestionFeed/**` · Src: [1], [5]
- **[LOGIC-24] Adult content off by default** — `GAME_SETTINGS_DEFAULTS.isAdultContentEnabled` is `false`, and a missing or invalid stored value falls back to `false`. Every random-questions request sends `isAdultContent: false` unless the player explicitly enabled adult content.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/domain/game-settings/**`, `app/utils/domain/game/helpers/game-questions-filters/**` · Src: [10]
- **[LOGIC-25] Filter selections are never empty** — Persisted category and cognitive-difficulty selections always hold at least one known value. Empty or unknown arrays fall back to every value, and kept values follow the `@goat-it/schemas` enum order. A group with every value selected sends no filter key.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/domain/game-settings/**`, `app/utils/domain/game/helpers/game-questions-filters/**` · Src: [5], [6]
- **[LOGIC-26] Stale theme ids are reconciled with the catalog** — Saved theme ids are intersected with the active catalog. A selection with no surviving active id falls back to every active theme, archived themes are never sent, and an empty or unavailable catalog sends no `themeIds` filter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/question-theme/selection/**`, `app/utils/domain/game/helpers/game-questions-filters/**`, `app/stores/domain/question-theme/**` · Src: [6]
- **[LOGIC-27] Narrowing filters have one definition** — The keys `hasNarrowingQuestionFilters` treats as narrowing (`categories`, `cognitiveDifficulties`, `themeIds`) are exactly the narrowing keys `buildGameSettingsFetchFilters` can emit, with `isAdultContent` excluded on purpose. A new filter group updates both definitions in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/helpers/**`, `app/utils/domain/game/helpers/game-questions-filters/**` · Src: [7]

## 5. Persisted-state evolution

- **[LOGIC-28] Cookie reads never throw** — Every preference cookie in `CookieNames` is read as `unknown` and validated with `safeParse` or a type guard before use. Malformed, truncated or wrongly typed values produce defaults and never throw during SSR, hydration or a store setup.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/enums/cookie.enums.ts`, `app/composables/domain/useGameSettingsCookie/**`, `app/composables/domain/useChangelogCookie/**`, `app/composables/domain/useGameTutorialInvitation/**`, `shared/utils/helpers/locale/**` · Src: [5]
- **[LOGIC-29] Invalid fields are repaired one by one** — The settings schema repairs each field independently (a per-field fallback such as `.catch()`), so one invalid field resets only that field. The repair is reported once through a reset flag, and acknowledging it rewrites the normalized value to the cookie (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/domain/game-settings/**`, `app/composables/domain/useGameSettingsCookie/**` · Src: [5]
- **[LOGIC-30] Corrupted settings cookie survives a request** — A request to `/game` with a corrupted `game_settings` cookie (invalid JSON, wrong types, unknown enum values) returns 200 and renders the game with default settings, and the settings-reset notice appears exactly once. After a reload the notice is gone.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5], [10]
- **[LOGIC-31] Persisted-shape versioning policy** — Persisted cookie objects carry an explicit version field, or `docs/game-logic.md` documents the unversioned forward-compatible policy and the migration path for a breaking shape change. The unversioned policy is: unknown keys are stripped, which is the `z.object()` default, and missing keys get defaults (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/domain/game-settings/**`, `app/composables/domain/useChangelogCookie/**` · Src: [5]
- **[LOGIC-32] Persisted payloads stay bounded** — Preference cookies store only preferences, never question ids, history or answers. The largest possible serialized `game_settings` value, with every active theme id selected, stays under 4 KB.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/domain/game-settings/**`, `app/composables/domain/useGameSettingsCookie/**` · Src: [5]
- **[LOGIC-33] Changelog state is announced once and stays monotonic** — On a first visit, `changelog_state` is set to the latest version with no toast. Each new version is announced once (`lastNotifiedVersion`), the unread badge stays until the changelog is opened (`lastSeenVersion`), and an invalid stored state is treated as a first visit.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/domain/useChangelog/**`, `app/composables/domain/useChangelogCookie/**` · Src: project: content/fr/changelog/1.10.0.md

## 6. Client/server agreement

- **[LOGIC-34] Request sizes fit the upstream contract** — Every client-sent limit stays within the matching `@goat-it/schemas` DTO bound: the random batch limit, the exclusion-id count (at most the DTO maximum, at least one id when sent) and the translation-id count. The check reads the installed schema package version (verified: @goat-it/schemas 0.0.26).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/**`, `app/composables/domain/useGameQuestionTranslation/**`, `shared/constants/goat-it-api.constants.ts` · Src: [5]
- **[LOGIC-35] One question shape on both sides** — The server mapper output (`createQuestionFromQuestionDto`) satisfies the shared `QUESTION_SCHEMA` that client repositories parse. Dates become `Date` objects, and unsafe source URLs are filtered by the same `shared/utils/helpers/question/source/**` rule on both sides. A field added to the mapper is added to the shared schema in the same change.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/mappers/**`, `shared/schemas/question/**`, `shared/utils/helpers/question/source/**`, `app/repositories/goat-it-api/**` · Src: project: docs/architecture.md §5
- **[LOGIC-36] Domain value lists come from one source** — Question categories, cognitive difficulties, the theme status and the supported locales come from `@goat-it/schemas` exports in app, shared and server code. No hand-written copy of these value lists exists in the repository.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/domain/game-settings/**`, `app/utils/domain/game/helpers/game-questions-filters/**`, `app/stores/domain/question-theme/**`, `shared/utils/helpers/locale/**` · Src: [5], project: docs/architecture.md §5

## 7. Locale and settings changes mid-flow

- **[LOGIC-37] Question language follows the UI locale** — The proxy resolves the upstream locale from the `goat_it_locale` cookie that the client locale switch writes, falling back to the configured default. After a locale switch settles, every buffered question and the theme catalog are in the new UI locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/goat-it-api-locale/**`, `shared/utils/helpers/locale/**`, `app/composables/domain/useGameQuestionTranslation/**`, `app/App.vue` · Src: [4]
- **[LOGIC-38] No old-locale batch after a switch** — A locale switch cannot leave questions from a random batch in the previous locale. Either the locale control is disabled while questions are being fetched (`isFetchingQuestions`), or a batch that settles after the switch is re-translated or discarded.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameSettingsModal/**`, `app/composables/domain/useGameQuestionTranslation/**`, `app/composables/domain/useGame/**` · Src: [1], [4]
- **[LOGIC-39] Catalog refresh keeps the selection** — A theme catalog refetch (triggered by a locale change in `App.vue`) re-syncs the feed only when the derived fetch filters change. A failed or superseded refresh keeps the previous catalog and never rewrites the saved theme selection.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/stores/domain/question-theme/**`, `app/composables/domain/useGameSettingsSync/**` · Src: [3], [4]
- **[LOGIC-40] Applying filters keeps the current question** — Applying new settings or filters, including a reset from the empty-filters screen, truncates the buffer to `currentIndex + 1` and fetches the next batch with the new filters. The displayed question stays, and only upcoming questions change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/useGameQuestionFeed/**`, `app/composables/domain/useGame/**`, `app/composables/domain/useGameFiltersModal/**` · Src: project: content/fr/changelog/1.10.0.md

## Sources

[1] Ch.22 — Addressing Cascading Failures (Google SRE Book) — https://sre.google/sre-book/addressing-cascading-failures/ — fetched 2026-10-31 (Google SRE Book, 2017)
[2] Making retries safe with idempotent APIs (AWS Builders' Library) — https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ — fetched 2026-10-31 (AWS Builders' Library)
[3] Mercari PRR concept — Graceful degradation — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/graceful-degradation.md — fetched 2026-10-31 (repo master)
[4] Nuxt 4.x — Data Fetching — https://nuxt.com/docs/4.x/getting-started/data-fetching — fetched 2026-10-31 (Nuxt 4.x docs)
[5] Zod — Defining schemas — https://zod.dev/api — fetched 2026-10-31 (zod v4.6 docs)
[6] 10 Usability Heuristics for User Interface Design (NN/g) — https://www.nngroup.com/articles/ten-usability-heuristics/ — fetched 2026-10-31 (last reviewed 2024-01-30)
[7] Designing Empty States in Complex Applications: 3 Guidelines (NN/g) — https://www.nngroup.com/articles/empty-state-interface-design/ — fetched 2026-10-31 (2021-09-19)
[8] Indicators, Validations, and Notifications: Pick the Correct Communication Option (NN/g) — https://www.nngroup.com/articles/indicators-validations-notifications/ — fetched 2026-10-31 (2024-01-17)
[9] 10 Usability Heuristics Applied to Video Games (NN/g) — https://www.nngroup.com/articles/usability-heuristics-applied-video-games/ — fetched 2026-10-31 (2019-05-19)
[10] Game Accessibility Guidelines — Full list — https://gameaccessibilityguidelines.com/full-list/ — fetched 2026-10-31 (accessed 2026-10-31)
