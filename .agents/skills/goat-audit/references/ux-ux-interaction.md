# UX — UX & interaction quality

Interaction quality of the Goat It web game (Nuxt 4 SSR, Nuxt UI 4, six locales, PWA): the heuristic gates that keep every async action observable, the loading/empty/error/partial/offline/terminal state matrix, feedback and response-time thresholds, error-message UX, user control across overlays and navigation, design-system consistency (semantic tokens, component variants, pointer cursor), responsive and touch comfort at 320 px, motion duration and easing, readability, onboarding and tutorial replay, game-specific UX (progress, pause/leave, adult-content safety, replay), microcopy, perceived performance, and the Laws of UX as concrete checks. Contrast, reduced-motion implementation and WCAG target-size conformance are audited under A11Y; this file audits the interaction decisions those mechanics serve.

**Decision doc:** `docs/ux.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** contrast, reduced motion, WCAG 24 px target size and focus mechanics → A11Y · terminology across locales, register, plurals and raw translation keys → I18N · Core Web Vitals metrics and bundle weight → PERF · game state-machine correctness and terminal-state derivation → LOGIC · safe-area insets and hover-capability CSS gating → PWA · retry policy and error status mapping → REL · consent and stored personal data → PRIV

## Contents

- [1. Heuristics](#1-heuristics)
- [2. State coverage](#2-state-coverage)
- [3. Feedback and response times](#3-feedback-and-response-times)
- [4. Error UX](#4-error-ux)
- [5. User control and freedom](#5-user-control-and-freedom)
- [6. Design-system consistency](#6-design-system-consistency)
- [7. Responsive and touch](#7-responsive-and-touch)
- [8. Motion](#8-motion)
- [9. Readability](#9-readability)
- [10. Onboarding and discoverability](#10-onboarding-and-discoverability)
- [11. Game UX](#11-game-ux)
- [12. Microcopy](#12-microcopy)
- [13. Perceived performance](#13-perceived-performance)
- [14. Laws of UX](#14-laws-of-ux)
- [Sources](#sources)

## 1. Heuristics

- **[UX-01] No silent async action** — Every fetch, mutation and restart renders a pending indication, then a success, empty/end or error outcome, within 1 s of the trigger; no wait state is unlabelled.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [2], [6]
- **[UX-02] Domain language only** — Rendered UI uses the game vocabulary defined in the rules and tutorial (question, theme, category, cognitive difficulty, game master); no API, HTTP or storage term appears as user copy.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/fr/**`, `app/components/domain/game/**` · Src: [1], [2]
- **[UX-03] Same action, same presentation** — The same intent keeps one label, Lucide icon, variant and relative placement across home, game, sidebar, settings, filters, changelog and every locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/**`, `app/components/domain/**`, `app/utils/ui/**` · Src: [1], [2]
- **[UX-04] Error prevention before apply** — Filter combinations that cannot return a question are prevented or explained before Apply, and a settings or filter change that discards a draft asks before losing it.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [2], [7]
- **[UX-05] Recognition over recall** — Active filters and the current rule context are visible in place; no task requires remembering content from a closed modal or a previous question.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [1], [2]
- **[UX-06] Minimalist question card** — The card leads with the statement and answer, collapses context and trivia behind one accordion, and keeps sources secondary.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameQuestionCard/**`, `app/components/domain/game/GamePlaying/**` · Src: [1], [2]

## 2. State coverage

- **[UX-07] Complete async state matrix** — Each async surface (question feed, theme catalog, question translation, changelog entries, rules content) renders mutually exclusive idle, loading, empty, error, partial and success/end states; no catch-all branch substitutes a terminal screen for an unhandled state.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [4], [5], [8]
- **[UX-08] No catch-all terminal fallback** — `GameStateRenderer` maps each known state explicitly and renders a visible failure (or development warning) for an unknown state instead of falling through to the no-more-questions screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/domain/game/GameStateRenderer/**`, `app/composables/domain/useGame/**` · Src: [4], [8]
- **[UX-09] Terminal is not failure** — The no-more-questions state uses neutral or success styling with a party or completion icon, never an error icon, red treatment or a retry-only action.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/domain/game/GameNoMoreQuestions/**`, `app/components/shared/ui/StatusScreen/**` · Src: [4], [2]
- **[UX-10] Success only after success** — A success toast or success state appears only after the awaited operation resolves with `ok: true`; a forced 4xx, 5xx or malformed response never produces success feedback.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [8]
- **[UX-11] Empty state explains and acts** — Every empty state names its cause and offers one primary next action (reset filters, play, back home); no blank panel or read-only dead end is rendered.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [4]
- **[UX-12] Partial results preserved** — When a later page, translation or secondary fetch fails, already loaded questions stay visible and the failure is inline with retry; the screen is never wiped to a full error state.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [4], [5]
- **[UX-13] Offline is a distinct state** — Offline renders the global `role="status"` connectivity indicator plus offline-specific copy and retry, never the generic server-error or empty-results screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue`, `app/components/shared/ui/OfflineStatusIndicator/**`, `app/composables/ui/useConnectivityStatus/**`, `app/i18n/locales/*/errors.json`, `app/i18n/locales/fr/offline.json` · Src: [4], [8], project: docs/pwa.md §4
- **[UX-14] Placeholders reserve geometry** — Loading placeholders occupy the final card, action bar and dialog dimensions, so swapping between loading, content and error states causes no visible jump of the primary controls.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [20], [5]

## 3. Feedback and response times

- **[UX-15] 100 ms press feedback** — Every interactive control visibly changes its pressed state within 100 ms of pointer-down or key-down, before any network response resolves.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [6], [9]
- **[UX-16] 1 s feedback threshold** — Operations under 0.1 s never show a spinner, 0.1–1 s operations do not flash one, operations over 1 s show an indicator, and over 2 s the indicator names the task.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5], [6]
- **[UX-17] 10 s progress and exit** — When an operation can exceed 10 s (the upstream proxy timeout is reachable at 10 s), show step or percent progress and a signposted cancel or skip; never leave an indefinite spinner.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5], [6], project: docs/security.md
- **[UX-18] Toast duration by outcome** — Passive success and info toasts auto-dismiss after 3–5 s, the global toaster duration is between 3000 and 5000 ms, and action-required or blocking messages persist with `duration: 0` or move to an inline/error surface (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/app.constants.ts`, `app/composables/ui/useAppToast/**`, `app/composables/domain/useGameTutorialInvitation/**`, `app/composables/domain/useChangelog/**` · Src: [8], [23]
- **[UX-19] Toast stack bounded and deduplicated** — `toaster.max` is explicitly set to 3 or fewer and repeat-prone toasts carry stable ids, so a repeated failure replaces or pulses the existing toast instead of growing an unbounded stack (id reuse pulses since 4.5; verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/App.vue`, `app/app.constants.ts`, `app/composables/domain/useGoatItApiErrorToast/**` · Src: [23]
- **[UX-20] Toast channel semantics** — Results of a user action use `type: foreground`, background work uses `type: background`, and a blocking failure also renders a full state or modal rather than only a toast (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/ui/useAppToast/**`, `app/composables/domain/useChangelog/**`, `app/composables/ui/useLocaleSuggestion/**` · Src: [8], [23]
- **[UX-21] Optimistic UI reconciled** — Every optimistic settings, filter or tutorial change rolls back and shows a localized error when the awaited operation fails, so the rendered UI always matches the persisted cookie or state.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [8], project: docs/architecture.md §4.2

## 4. Error UX

- **[UX-22] Plain, specific, constructive copy** — Error copy states the failed action, the cause when known and a concrete remedy; "An error occurred", "Invalid", a raw status code or a bare "Unknown error" never stands as the primary message.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/errors.json`, `app/i18n/locales/fr/game.json`, `app/components/domain/game/**` · Src: [3]
- **[UX-23] Error near its source** — Field or card failures render inline next to the affected control, and global failures appear in a top-level status region or full state, not only in a distant toast.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3]
- **[UX-24] Preserve input and context** — A failure keeps filters, settings, draft values, scroll position and the current question index, and Retry continues from that context instead of restarting the flow.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3]
- **[UX-25] Severity-matched channel** — Blocking failures use a full error state or modal, non-blocking failures use inline, banner or toast feedback, and a toast is never the sole channel for a blocking failure.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [8]
- **[UX-26] Error taxonomy copy** — Distinct copy branches exist for offline, invalid request (400), rate limit (429), upstream error or timeout (502/504) and unknown; an unrecognized code falls back to localized copy after one log.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [8], project: docs/security.md
- **[UX-27] Secondary surface errors recoverable** — When changelog entries, the theme catalog or rules content fail, the surface renders an inline localized error with a retry action, not a generic sentence or an empty panel.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [4]

## 5. User control and freedom

- **[UX-28] Escape closes only the top layer** — Stacked overlays close one layer per Escape or outside click, and non-destructive overlays close consistently through X, Cancel and outside click, while a destructive confirmation keeps its explicit decision buttons (verified: @nuxt/ui 4.12.0).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [24]
- **[UX-29] Browser Back is predictable** — Back from `/game` returns to `/` once, and Back from a deep-linked `/rules` or an open overlay returns to the prior route or closes the overlay without a history trap.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [13]
- **[UX-30] Scroll position restored** — Closing an overlay or returning from `/rules` restores the previous scroll position and keeps the control that opened it in view.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [1], [21]
- **[UX-31] Undo before confirm** — Reversible filter and settings changes apply immediately with an undo path; modal confirmation is reserved for irreversible loss such as discarding an unapplied filter draft or leaving a running game.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [7]
- **[UX-32] Confirmation names consequence** — A confirmation names the consequence, labels its buttons with the decision verbs instead of OK/Yes, offers Cancel or close, and binds no default affirmative action to Enter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/ui/modal/**`, `app/composables/domain/useGameLeaveConfirmation/**`, `app/i18n/locales/fr/game.json` · Src: [7]
- **[UX-33] No dead ends** — Every terminal state (game over, fetch error, offline) shows both a primary recovery action and a secondary help or home route, so the player can always leave without retrying blindly.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[UX-34] Long overlays scroll internally** — When modal, sidebar or tutorial content exceeds the viewport, the body scrolls internally while the close control and primary action stay reachable (use the `scrollable` modal layout; verified: @nuxt/ui 4.12.0).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [24]

## 6. Design-system consistency

- **[UX-35] Tokens only** — Components and pages use semantic tokens (`text-fg-primary`, `bg-card`, `var(--game-theme-*)`) or configured Nuxt UI colours; no raw hex, `rgb()` or `hsl()` literal and no Tailwind palette utility such as `text-violet-300` or `bg-zinc-900` appears outside token and config definitions.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/pages/**/*.vue`, `app/assets/css/**`, `app/config/**`, `app/app.config.ts` · Src: [22]
- **[UX-36] Semantic colour roles** — Statuses use the primary, success, warning, error and info roles configured in `app/app.config.ts` consistently, and no view reassigns a role's conventional meaning.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/app.config.ts`, `app/config/**`, `app/components/domain/game/**` · Src: [22]
- **[UX-37] System components and variants** — Buttons, modals, toasts, selects and tabs use Nuxt UI components with the configured variants; no one-off native control with divergent styling duplicates an existing component.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/config/**` · Src: [1], [22]
- **[UX-38] Icon semantics stable** — The same action keeps one Lucide icon everywhere (settings, filters, next, previous, skip, retry, close); no action swaps icons between views or locales.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/**`, `app/utils/ui/**` · Src: [22]
- **[UX-39] One primary action and consistent states** — Each view exposes exactly one primary action, and disabled, loading, selected and error states look and behave identically for the same component type across home, game, settings and filters.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1], [22]
- **[UX-40] Pointer cursor restored on enabled controls** — A base-layer rule restores `cursor: pointer` for `button:not(:disabled)` and `[role="button"]:not(:disabled)`, because Tailwind CSS 4 defaults buttons to `cursor: default` (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/main.css` · Src: [22]
- **[UX-41] Theme overrides centralized** — Nuxt UI component theme overrides live in `app/config/*.config.ts` and are composed once by `app/app.config.ts`; component files pass only documented per-instance props.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/app.config.ts`, `app/config/**` · Src: [22], project: docs/architecture.md §4.7

## 7. Responsive and touch

- **[UX-42] 320 px no overflow** — At 320×568, `document.documentElement.scrollWidth` does not exceed `clientWidth`, no label or control is clipped, and settings, filters, changelog, confirm dialogs and the tutorial fit without horizontal scroll.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17], [19]
- **[UX-43] Breakpoint sweep** — At 320, 375, 414, 768, 1024 and 1440 CSS px, home, game, rules and offline show no overlap and keep navigation, sidebar, question card, action bar and footer operable.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17], [19]
- **[UX-44] Touch comfort at 44 px** — Primary touch controls (Play, Next, Previous, sidebar toggle, filters trigger, footer help) reach at least 44×44 CSS px including padding where the layout allows; dense secondary controls are covered by A11Y target-size checks.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/home/**`, `app/components/domain/game/**`, `app/utils/ui/**` · Src: [21]
- **[UX-45] Short-viewport game layout** — The game page sizes from `min-h-dvh` and `dvh`-based card heights, and the sticky action bar uses viewport-relative units, so a 320×568 viewport keeps the card and both navigation controls reachable without vertical clipping.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/(game)/game/**`, `app/components/domain/game/GamePlaying/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [17], [19]
- **[UX-46] Virtual keyboard** — Every text input, including the filter search field, declares an appropriate `type` and `inputmode` and keeps the focused field and its visible results reachable above the virtual keyboard in portrait and landscape.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [16], [17]

## 8. Motion

- **[UX-47] Duration bands** — Micro-feedback uses about 100 ms, overlays about 200–300 ms, and large moves at most 400–500 ms; no UI transition exceeds 500 ms.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/transitions.css`, `app/components/**/*.vue` · Src: [9]
- **[UX-48] Enter/exit asymmetry and easing** — Enter transitions last slightly longer than exits, entry uses ease-out and exit ease-in, and no full-screen movement is linear.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/transitions.css`, `app/components/shared/ui/OfflineStatusIndicator/**`, `app/components/domain/game/GameTutorial/**` · Src: [9]
- **[UX-49] Motion never blocks state** — Animation completion is never the only gate for navigation: a timeout fallback settles the transition, and input is never locked for more than 500 ms.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GamePlaying/**`, `app/composables/domain/useQuestionCardHighlight/**` · Src: [9]
- **[UX-50] No auto-forwarding or scroll-jacking** — No screen auto-advances the question, hijacks scroll or plays sudden full-screen movement; every large motion is triggered by a user action.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/domain/game/**`, `app/pages/**/*.vue`, `app/assets/css/**` · Src: [9], [21]

## 9. Readability

- **[UX-51] Body text at least 16 px** — Body and question-card text renders at least 1 rem at default zoom, supporting text at least 14 px, and no essential information exists only in supporting text.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [18], [21]
- **[UX-52] Line length, height and alignment** — Rules and long-form copy render 45–75 characters per line (about 66 ideal), body line-height is unitless and at least 1.5, card copy stays within 75ch, and body copy is left-aligned, not justified.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/docs.css`, `app/assets/css/tokens.css`, `app/components/docs/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [18]
- **[UX-53] Scannable hierarchy** — Long content uses short paragraphs and labelled sections, and no all-caps body text carries more than a short label.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/docs.css`, `app/components/docs/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [18]
- **[UX-54] Question card reading order and density** — The card presents the statement, then the answer, with context and trivia collapsed and sources secondary; on a short viewport the card scrolls internally so the answer stays reachable without scrolling the page.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [1], [2]

## 10. Onboarding and discoverability

- **[UX-55] One dominant start action** — The home page shows one dominant Play call to action above the fold at 320×568; starting a game never requires opening a menu or choosing a mode first.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [2], [16]
- **[UX-56] Tutorial exits at every step** — Every tutorial step exposes a visible Skip or Finish control, Escape ends the tour from any step, and the completion decision persists across reloads.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [2], [16]
- **[UX-57] Tutorial replayable** — A replay entry for the interactive tutorial is reachable from the game sidebar and the rules or help surface while a question is live, without restarting the game.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [2], [16]
- **[UX-58] First-run invitation non-blocking** — The first-run tutorial invitation is a single persistent info toast with Start and Not now actions, blocks no navigation, persists its decision, and never reappears after a decision.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [16], [8]

## 11. Game UX

- **[UX-59] No essential time pressure** — No countdown or timer is required to answer or advance; any displayed timer is informational or can be paused or disabled.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [2], [16]
- **[UX-60] Progress visible during play** — During play the current position (index/total or remaining count) is visible as text and exposed to assistive technology, not conveyed by colour or a thin bar alone.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [2], [16]
- **[UX-61] Pause or leave from the in-game menu** — The in-game menu offers leave or quit; choosing it while a question is live shows a confirmation that names the lost progress and offers staying in the game.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [2], [16]
- **[UX-62] Filters reachable during play** — Adult-content, category, cognitive-difficulty and theme filters are reachable and adjustable from the game (sidebar or filters trigger) without restarting the session.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [16]
- **[UX-63] Adult-content safety copy** — The adult-content toggle defaults off, and its description names the sensitive topics that can then appear; enabling it is an explicit choice in settings and in filters, never a hidden default.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [16]
- **[UX-64] Replay from the end screen** — The game-over screen offers a replay action that starts a new feed with the same filters, plus a home action; no player is stranded after the last question.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [2], [16]
- **[UX-65] Rules without losing progress** — The rules entry opens in a new tab or a non-blocking route, and returning to the game keeps the current question and filters.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameSidebar/**`, `app/components/domain/home/HomeFooter/**`, `app/pages/(docs)/rules/**` · Src: [1], [2]

## 12. Microcopy

- **[UX-66] Verb-first action labels** — Action buttons start with a verb in every locale (Play, Retry, Reset filters, Keep playing); OK and Yes are never used for a consequential action.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/fr/**`, `app/components/domain/**`, `app/components/shared/**` · Src: [1], [3]
- **[UX-67] No blame or stale humour** — Error and empty copy avoids "invalid", "illegal", "you failed" and jokes; it states the system constraint and the recovery step.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/fr/errors.json`, `app/i18n/locales/fr/game.json` · Src: [3]
- **[UX-68] Toasts name the completed action** — A toast's title and description together name what happened (filters applied, locale switched, questions failed to load); a generic "Success" or "Error" title never stands alone.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/ui/useAppToast/**`, `app/composables/domain/useGameFiltersModal/**`, `app/composables/domain/useGoatItApiErrorToast/**` · Src: [3], [8]
- **[UX-69] Loading labels name the task** — Loading indicators name the operation ("Loading questions", "Translating questions", "Loading themes") or provide an equivalent text label; a bare spinner never stands alone.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/domain/game/GameLoading/**`, `app/components/shared/ui/LoadingSpinner/**`, `app/i18n/locales/fr/game.json` · Src: [5], [8]

## 13. Perceived performance

- **[UX-70] Doherty 400 ms** — Primary interactions acknowledge input within 400 ms, either by a state change or a visible pending indication, so no action waits silently past the Doherty threshold.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [10], [6]
- **[UX-71] No spinner flicker** — A spinner or skeleton appears only after a 200–300 ms delay and never for cached or already-prefetched content, so fast responses do not flash.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [5]
- **[UX-72] Instant route and press feedback** — Press and route changes render feedback before the network resolves, and the previous screen stays visible until the next one is ready.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6], [9]
## 14. Laws of UX

- **[UX-73] Fitts's Law** — Frequent targets are large and close to the task area: Next sits adjacent to the question card, while leave, destructive and settings controls are separated from it enough to prevent mis-taps.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [11]
- **[UX-74] Hick's Law** — The start screen limits the decision set to starting play plus secondary help and settings, and the filters modal discloses groups progressively (category, cognitive difficulty, adult content, themes) instead of presenting every option at once.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/pages/index/**`, `app/components/domain/home/**`, `app/components/domain/game/GameQuestionsFiltersModalContent/**` · Src: [12]
- **[UX-75] Jakob's Law** — Modal, Back, toast, select and external-link behaviour follows common web conventions; no novel close gesture or non-standard placement is required to complete a task.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [13]
- **[UX-76] Choice overload guard** — Large theme lists provide search, a selected count and an explicit restore-all or reset control, so a long list never becomes an ungrouped wall of options.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [15]
- **[UX-77] Aesthetic-usability caveat** — Audit the interface with motion disabled and at low fidelity; polished visuals must never mask a missing state, an unreachable control or an unhandled error.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [14]

## Sources

[1] 10 Usability Heuristics for User Interface Design — https://www.nngroup.com/articles/ten-usability-heuristics/ — fetched 2026-10-31 (last reviewed 2024-01-30)
[2] 10 Usability Heuristics Applied to Video Games — https://www.nngroup.com/articles/usability-heuristics-applied-video-games/ — fetched 2026-10-31 (2019-05-19)
[3] Error-Message Guidelines — https://www.nngroup.com/articles/error-message-guidelines/ — fetched 2026-10-31 (2023-05-14)
[4] Designing Empty States in Complex Applications: 3 Guidelines — https://www.nngroup.com/articles/empty-state-interface-design/ — fetched 2026-10-31 (2021-09-19)
[5] Progress Indicators Make a Slow System Less Insufferable — https://www.nngroup.com/articles/progress-indicators/ — fetched 2026-10-31 (2014-10-26)
[6] Response Times: The 3 Important Limits — https://www.nngroup.com/articles/response-times-3-important-limits/ — fetched 2026-10-31 (updated 2014, orig. 1993)
[7] Confirmation Dialogs Can Prevent User Errors — If Not Overused — https://www.nngroup.com/articles/confirmation-dialog/ — fetched 2026-10-31 (last reviewed 2026-08-07)
[8] Indicators, Validations, and Notifications: Pick the Correct Communication Option — https://www.nngroup.com/articles/indicators-validations-notifications/ — fetched 2026-10-31 (2024-01-17)
[9] Executing UX Animations: Duration and Motion Characteristics — https://www.nngroup.com/articles/animation-duration/ — fetched 2026-10-31 (2020-02-09)
[10] Doherty Threshold — https://lawsofux.com/doherty-threshold/ — fetched 2026-10-31 (accessed 2026-10-31)
[11] Fitts's Law — https://lawsofux.com/fittss-law/ — fetched 2026-10-31 (accessed 2026-10-31)
[12] Hick's Law — https://lawsofux.com/hicks-law/ — fetched 2026-10-31 (accessed 2026-10-31)
[13] Jakob's Law — https://lawsofux.com/jakobs-law/ — fetched 2026-10-31 (accessed 2026-10-31)
[14] Aesthetic-Usability Effect — https://lawsofux.com/aesthetic-usability-effect/ — fetched 2026-10-31 (accessed 2026-10-31)
[15] Choice Overload — https://lawsofux.com/choice-overload/ — fetched 2026-10-31 (accessed 2026-10-31)
[16] Game Accessibility Guidelines — Full list — https://gameaccessibilityguidelines.com/full-list/ — fetched 2026-10-31 (accessed 2026-10-31)
[17] web.dev Learn Responsive Design — Interaction — https://web.dev/learn/design/interaction — fetched 2026-10-31 (updated 2021-12-23)
[18] web.dev Learn Responsive Design — Typography — https://web.dev/learn/design/typography — fetched 2026-10-31 (updated 2021-12-09)
[19] web.dev Learn Responsive Design — Screen configurations — https://web.dev/learn/design/screen-configurations — fetched 2026-10-31 (updated 2021-12-23)
[20] Cumulative Layout Shift (CLS) — https://web.dev/articles/cls — fetched 2026-10-31 (updated 2023-04-12)
[21] Apple Human Interface Guidelines — Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility.md — fetched 2026-10-31 (2026, change log 2025-06-09)
[22] Nuxt UI Design System — https://ui.nuxt.com/docs/getting-started/theme — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[23] Nuxt UI Toast — https://ui.nuxt.com/docs/components/toast — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[24] Nuxt UI Modal — https://ui.nuxt.com/docs/components/modal — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
