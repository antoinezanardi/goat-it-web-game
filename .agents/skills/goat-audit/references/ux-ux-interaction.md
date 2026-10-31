# UX — UX & interaction quality

Interaction quality of the Goat It web game (Nuxt 4 SSR, Nuxt UI 4, six locales, PWA): the heuristic gates that keep every async action observable, the loading/empty/error/partial/offline/terminal state matrix, feedback and response-time thresholds, error-message UX, user control across overlays and navigation, design-system consistency (semantic tokens, component variants, pointer cursor), responsive and touch comfort at 320 px, motion duration and easing, readability, onboarding and discoverability, microcopy, perceived performance, and the Laws of UX as concrete checks. Criteria state outcomes that survive product growth: they name no single component, screen or feature as the only acceptable implementation. Contrast, reduced-motion implementation and WCAG target-size conformance are audited under A11Y; this file audits the interaction decisions those mechanics serve.

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
- [11. Microcopy](#11-microcopy)
- [12. Perceived performance](#12-perceived-performance)
- [13. Laws of UX](#13-laws-of-ux)
- [Sources](#sources)

## 1. Heuristics

- **[UX-01] No silent async action** — Every fetch, mutation and restart renders a pending indication, then a success, empty/end or error outcome, within 1 s of the trigger; no wait state is unlabelled.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [2], [6]
- **[UX-02] Domain language only** — Rendered UI uses the game vocabulary defined in the rules and tutorial (question, theme, category, cognitive difficulty, game master); no API, HTTP or storage term appears as user copy.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/fr/**`, `app/components/domain/game/**` · Src: [1], [2]
- **[UX-03] Same action, same presentation** — The same intent keeps one label, variant and relative placement across home, game, sidebar, settings, filters, changelog and every locale; icon consistency is checked separately in UX-38.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/**`, `app/components/domain/**`, `app/utils/ui/**` · Src: [1], [2]
- **[UX-04] Error prevention before apply** — Filter combinations that cannot return a question are prevented or explained before Apply, and a settings or filter change that discards a draft asks before losing it.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [2], [7]
- **[UX-05] Minimalist question card** — The card leads with the statement and the answer; secondary context (trivia, sources, metadata) is progressively disclosed so it never competes with the primary content.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/domain/game/GameQuestionCard/**`, `app/components/domain/game/GamePlaying/**` · Src: [1], [2]

## 2. State coverage

- **[UX-06] Complete async state matrix** — Each async surface (question feed, theme catalog, question translation, changelog entries, rules content) renders mutually exclusive idle, loading, empty, error, partial and success/end states; no catch-all branch substitutes a terminal screen for an unhandled state.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [4], [5], [8]
- **[UX-07] No catch-all terminal fallback** — Every known game state is mapped explicitly by the game state renderer, and an unknown state renders a visible failure (or development warning) instead of falling through to the terminal screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/domain/game/GameStateRenderer/**`, `app/composables/domain/useGame/**` · Src: [4], [8]
- **[UX-08] Success only after success** — A success toast or success state appears only after the awaited operation resolves with `ok: true`; a forced 4xx, 5xx or malformed response never produces success feedback.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [8]
- **[UX-09] Empty state explains and acts** — Every empty state names its cause and offers one primary next action (reset filters, play, back home); no blank panel or read-only dead end is rendered.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [4]
- **[UX-10] Partial results preserved** — When a later page, translation or secondary fetch fails, already loaded questions stay visible and the failure is inline with retry; the screen is never wiped to a full error state.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [4], [5]
- **[UX-11] Offline is a distinct state** — Offline renders the global `role="status"` connectivity indicator plus offline-specific copy and retry, never the generic server-error or empty-results screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue`, `app/components/shared/ui/OfflineStatusIndicator/**`, `app/composables/ui/useConnectivityStatus/**`, `app/i18n/locales/*/errors.json`, `app/i18n/locales/fr/offline.json` · Src: [4], [8], project: docs/pwa.md §4

## 3. Feedback and response times

- **[UX-12] 100 ms press feedback** — Every interactive control visibly changes its pressed state within 100 ms of pointer-down or key-down, before any network response resolves.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [6], [9]
- **[UX-13] 1 s feedback threshold** — Operations under 0.1 s never show a spinner, 0.1–1 s operations do not flash one, operations over 1 s show an indicator, and over 2 s the indicator names the task; a spinner or skeleton appears only after a 200–300 ms delay and never for cached or already-prefetched content.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5], [6]
- **[UX-14] 10 s progress and exit** — When an operation can exceed 10 s (the upstream proxy timeout is reachable at 10 s), show step or percent progress and a signposted cancel or skip; never leave an indefinite spinner.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5], [6], project: docs/security.md
- **[UX-15] Toast duration by outcome** — Passive success and info toasts auto-dismiss after 3–5 s, the global toaster duration is between 3000 and 5000 ms, and action-required or blocking messages persist with `duration: 0` or move to an inline/error surface (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/app.constants.ts`, `app/composables/ui/useAppToast/**`, `app/composables/domain/useGameTutorialInvitation/**`, `app/composables/domain/useChangelog/**` · Src: [8], [23]
- **[UX-16] Toast stack bounded and deduplicated** — The toast stack is bounded (`toaster.max` explicitly configured) and repeat-prone toasts carry stable ids, so a repeated failure replaces or pulses the existing toast instead of growing an unbounded stack (id reuse pulses since 4.5; verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/App.vue`, `app/app.constants.ts`, `app/composables/domain/useGoatItApiErrorToast/**` · Src: [23]
- **[UX-17] Toast channel semantics** — Results of a user action use `type: foreground`, background work uses `type: background`; blocking failures use a full error state or modal (never a toast alone), while non-blocking failures use inline, banner or toast feedback (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/ui/useAppToast/**`, `app/composables/domain/useChangelog/**`, `app/composables/ui/useLocaleSuggestion/**` · Src: [8], [23]
- **[UX-18] Optimistic UI reconciled** — Every optimistic settings, filter or tutorial change rolls back and shows a localized error when the awaited operation fails, so the rendered UI always matches the persisted cookie or state.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [8], project: docs/architecture.md §4.2

## 4. Error UX

- **[UX-19] Plain, specific, constructive copy** — Error and empty copy states the failed action, the cause when known and a concrete remedy; it avoids blaming or joking wording (invalid, illegal, you failed), and an "An error occurred" placeholder, a raw status code or a bare "Unknown error" never stands as the primary message.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/errors.json`, `app/i18n/locales/fr/game.json`, `app/components/domain/game/**` · Src: [3]
- **[UX-20] Error near its source** — Field or card failures render inline next to the affected control, and global failures appear in a top-level status region or full state, not only in a distant toast.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3]
- **[UX-21] Preserve input and context** — A failure keeps filters, settings, draft values, scroll position and the current question index, and Retry continues from that context instead of restarting the flow.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3]
- **[UX-22] Error taxonomy copy** — Distinct copy branches exist for offline, invalid request (400), rate limit (429), upstream error or timeout (502/504) and unknown; an unrecognized code falls back to localized copy after one log.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [8], project: docs/security.md
- **[UX-23] Secondary surface errors recoverable** — When changelog entries, the theme catalog or rules content fail, the surface renders an inline localized error with a retry action, not a generic sentence or an empty panel.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [4]

## 5. User control and freedom

- **[UX-24] Escape closes only the top layer** — Stacked overlays close one layer per Escape or outside click, and non-destructive overlays close consistently through X, Cancel and outside click, while a destructive confirmation keeps its explicit decision buttons (verified: @nuxt/ui 4.12.0).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [24]
- **[UX-25] Browser Back is predictable** — Back from `/game` returns to `/` once, and Back from a deep-linked `/rules` or an open overlay returns to the prior route or closes the overlay without a history trap.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [13]
- **[UX-26] Scroll position restored** — Closing an overlay or returning from `/rules` restores the previous scroll position and keeps the control that opened it in view.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [1], [21]
- **[UX-27] Undo before confirm** — Reversible filter and settings changes apply immediately with an undo path; modal confirmation is reserved for irreversible loss such as discarding an unapplied filter draft or leaving a running game.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [7]
- **[UX-28] Confirmation names consequence** — A confirmation names the consequence, labels its buttons with the decision verbs instead of OK/Yes, offers Cancel or close, and binds no default affirmative action to Enter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/ui/modal/**`, `app/composables/domain/useGameLeaveConfirmation/**`, `app/i18n/locales/fr/game.json` · Src: [7]
- **[UX-29] No dead ends** — Every terminal state (game over, fetch error, offline) shows both a primary recovery action and a secondary help or home route, so the player can always leave without retrying blindly.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[UX-30] Long overlays scroll internally** — When modal, sidebar or tutorial content exceeds the viewport, the body scrolls internally while the close control and primary action stay reachable (Nuxt UI `scrollable` layout where a modal is used; verified: @nuxt/ui 4.12.0).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [24]

## 6. Design-system consistency

- **[UX-31] Tokens only** — Components and pages use semantic tokens (`text-fg-primary`, `bg-card`, `var(--game-theme-*)`) or configured Nuxt UI colours; no raw hex, `rgb()` or `hsl()` literal and no Tailwind palette utility such as `text-violet-300` or `bg-zinc-900` appears outside token and config definitions.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/pages/**/*.vue`, `app/assets/css/**`, `app/config/**`, `app/app.config.ts` · Src: [22]
- **[UX-32] Semantic colour roles** — Statuses use the primary, success, warning, error and info roles configured in `app/app.config.ts` consistently, and no view reassigns a role's conventional meaning.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/app.config.ts`, `app/config/**`, `app/components/domain/game/**` · Src: [22]
- **[UX-33] System components and variants** — Buttons, modals, toasts, selects and tabs use Nuxt UI components with the configured variants; no one-off native control with divergent styling duplicates an existing component.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/config/**` · Src: [1], [22]
- **[UX-34] Icon semantics stable** — The same action keeps one Lucide icon everywhere (settings, filters, next, previous, skip, retry, close); no action swaps icons between views or locales.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/**`, `app/utils/ui/**` · Src: [22]
- **[UX-35] Consistent component states** — Disabled, loading, selected and error states look and behave identically for the same component type across home, game, settings and filters; the single-primary-action rule is checked in UX-55.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1], [22]
- **[UX-36] Pointer cursor restored on enabled controls** — Enabled buttons and elements with `role="button"` show a pointer cursor (Tailwind CSS 4 defaults buttons to `cursor: default`), restored once in the base layer (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/main.css` · Src: [22]
- **[UX-37] Theme overrides centralized** — Nuxt UI component theme overrides live in `app/config/*.config.ts` and are composed once by `app/app.config.ts`; component files pass only documented per-instance props.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/app.config.ts`, `app/config/**` · Src: [22], project: docs/architecture.md §4.7

## 7. Responsive and touch

- **[UX-38] 320 px no overflow** — At 320×568, `document.documentElement.scrollWidth` does not exceed `clientWidth`, no label or control is clipped, and settings, filters, changelog, confirm dialogs and the tutorial fit without horizontal scroll.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17], [19]
- **[UX-39] Breakpoint sweep** — At 320, 375, 414, 768, 1024 and 1440 CSS px, home, game, rules and offline show no overlap and keep navigation, sidebar, question card, action bar and footer operable.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17], [19]
- **[UX-40] Touch comfort at 44 px** — Primary touch controls (Play, Next, Previous, sidebar toggle, filters trigger, footer help) reach at least 44×44 CSS px including padding where the layout allows; dense secondary controls are covered by A11Y target-size checks.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/home/**`, `app/components/domain/game/**`, `app/utils/ui/**` · Src: [21]
- **[UX-41] Short-viewport game layout** — On a 320×568 viewport the game card and both navigation controls stay reachable without vertical clipping, with heights derived from the dynamic viewport rather than `100vh` and an action bar that does not consume the card's visible area.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/(game)/game/**`, `app/components/domain/game/GamePlaying/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [17], [19]
- **[UX-42] Virtual keyboard** — Every text input, including the filter search field, declares an appropriate `type` and `inputmode` and keeps the focused field and its visible results reachable above the virtual keyboard in portrait and landscape.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [16], [17]

## 8. Motion

- **[UX-43] Enter/exit asymmetry and easing** — Motion timing follows bands: micro-feedback about 100 ms, overlays 200–300 ms, large moves 400–500 ms and never above 500 ms; enters last slightly longer than exits, entry uses ease-out and exit ease-in, and no full-screen movement is linear.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/transitions.css`, `app/components/shared/ui/OfflineStatusIndicator/**`, `app/components/domain/game/GameTutorial/**` · Src: [9]
- **[UX-44] Motion never blocks state** — Animation completion is never the only gate for navigation: a timeout fallback settles the transition, and input is never locked for more than 500 ms.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GamePlaying/**`, `app/composables/domain/useQuestionCardHighlight/**` · Src: [9]
- **[UX-45] No auto-forwarding or scroll-jacking** — No screen auto-advances the question, hijacks scroll or plays sudden full-screen movement; every large motion is triggered by a user action.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/domain/game/**`, `app/pages/**/*.vue`, `app/assets/css/**` · Src: [9], [21]

## 9. Readability

- **[UX-46] Body text at least 16 px** — Body and question-card text renders at least 1 rem at default zoom, supporting text at least 14 px, and no essential information exists only in supporting text.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [18], [21]
- **[UX-47] Scannable hierarchy** — Long content uses short paragraphs and labelled sections, 45–75 characters per line (about 66 ideal), unitless line-height of at least 1.5, left-aligned body copy, and no all-caps body text beyond a short label.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/docs.css`, `app/components/docs/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [18]

## 10. Onboarding and discoverability

- **[UX-48] One dominant start action** — The home page shows one dominant Play call to action above the fold at 320×568; starting a game never requires opening a menu or choosing a mode first.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [2], [16]

## 11. Microcopy

- **[UX-49] Action labels describe the action** — Action labels describe the action in every locale (Play, Retry, Reset filters, Keep playing) — verb-first where the locale grammar allows — and OK/Yes never label a consequential action.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/fr/**`, `app/components/domain/**`, `app/components/shared/**` · Src: [1], [3]
- **[UX-50] Toasts name the completed action** — A toast's title and description together name what happened (filters applied, locale switched, questions failed to load); a generic "Success" or "Error" title never stands alone.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/ui/useAppToast/**`, `app/composables/domain/useGameFiltersModal/**`, `app/composables/domain/useGoatItApiErrorToast/**` · Src: [3], [8]
- **[UX-51] Loading labels name the task** — Loading indicators name the operation ("Loading questions", "Translating questions", "Loading themes") or provide an equivalent text label; a bare spinner never stands alone.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/domain/game/GameLoading/**`, `app/components/shared/ui/LoadingSpinner/**`, `app/i18n/locales/fr/game.json` · Src: [5], [8]

## 12. Perceived performance

- **[UX-52] Instant route feedback** — Route changes render feedback before the network resolves and the previous screen stays visible until the next one is ready; press feedback is checked in UX-15.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6], [9]

## 13. Laws of UX

- **[UX-53] Hick's Law** — The start screen limits the initial decision set to starting play plus secondary help and settings, and the filters modal discloses option groups progressively instead of presenting every option at once.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/pages/index/**`, `app/components/domain/home/**`, `app/components/domain/game/GameQuestionsFiltersModalContent/**` · Src: [12]
- **[UX-54] Choice overload guard** — A long option list (for example themes) stays manageable through search or grouping, shows the current selection count and offers an explicit reset, so it never becomes an ungrouped wall of options.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [15]

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
[12] Hick's Law — https://lawsofux.com/hicks-law/ — fetched 2026-10-31 (accessed 2026-10-31)
[13] Jakob's Law — https://lawsofux.com/jakobs-law/ — fetched 2026-10-31 (accessed 2026-10-31)
[15] Choice Overload — https://lawsofux.com/choice-overload/ — fetched 2026-10-31 (accessed 2026-10-31)
[16] Game Accessibility Guidelines — Full list — https://gameaccessibilityguidelines.com/full-list/ — fetched 2026-10-31 (accessed 2026-10-31)
[17] web.dev Learn Responsive Design — Interaction — https://web.dev/learn/design/interaction — fetched 2026-10-31 (updated 2021-12-23)
[18] web.dev Learn Responsive Design — Typography — https://web.dev/learn/design/typography — fetched 2026-10-31 (updated 2021-12-09)
[19] web.dev Learn Responsive Design — Screen configurations — https://web.dev/learn/design/screen-configurations — fetched 2026-10-31 (updated 2021-12-23)
[21] Apple Human Interface Guidelines — Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility.md — fetched 2026-10-31 (2026, change log 2025-06-09)
[22] Nuxt UI Design System — https://ui.nuxt.com/docs/getting-started/theme — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[23] Nuxt UI Toast — https://ui.nuxt.com/docs/components/toast — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[24] Nuxt UI Modal — https://ui.nuxt.com/docs/components/modal — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
