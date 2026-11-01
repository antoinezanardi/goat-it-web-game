# A11Y — Accessibility

Conformance of the Goat It web game (Nuxt 4 SSR, Nuxt UI 4 on Reka primitives, six locales, PWA) with WCAG 2.2 level AA: the axe-core acceptance coverage, document structure and semantics, keyboard operation and shortcuts, focus management across overlays, the tutorial and client-side navigation, ARIA widget patterns, status messages, form labelling, contrast, motion, reflow and zoom, pointer targets, content alternatives, and the accessibility statement and manual assistive-technology protocol. Nuxt UI provides focus trapping, ARIA wiring and keyboard support for its primitives, but every app-level composition (names, focus restoration, live regions, motion) is audited here.

**Decision doc:** `docs/accessibility.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** `lang` attributes and language of parts → I18N · hardcoded `aria-label`/`alt`/`title` strings → I18N · EAA and RGAA legal applicability → PRIV · 44 px touch-target recommendation, toast duration and timing hygiene, animation durations and easing → UX · page title uniqueness for search → SEO · cross-browser test matrix → TEST · CI required-check governance → CICD · manifest correctness → PWA

## Contents

- [1. Automated coverage](#1-automated-coverage)
- [2. Structure and semantics](#2-structure-and-semantics)
- [3. Keyboard](#3-keyboard)
- [4. Focus management](#4-focus-management)
- [5. ARIA patterns](#5-aria-patterns)
- [6. Status messages](#6-status-messages)
- [7. Forms](#7-forms)
- [8. Contrast and colour](#8-contrast-and-colour)
- [9. Motion](#9-motion)
- [10. Layout and zoom](#10-layout-and-zoom)
- [11. Pointer and touch](#11-pointer-and-touch)
- [12. Content](#12-content)
- [13. Statement and manual test protocol](#13-statement-and-manual-test-protocol)
- [Sources](#sources)

## 1. Automated coverage

- **[A11Y-01] Axe scan on every route** — Every routed page, including the offline and error pages, has an `@accessibility`-tagged scenario ending with `the page should not contain accessibility issues in <view> mode`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/acceptance/features/**/*accessibility*.feature`, `app/pages/**` · Src: [4], [8]
- **[A11Y-02] Axe scan on every interactive state** — Every overlay is scanned while open (each modal and its tabs, the sidebar, every tutorial step, confirm dialogs, a visible toast, the offline indicator) and every non-idle game state is scanned while visible (loading, fetch-error, empty-filters and terminal).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/acceptance/features/**/*accessibility*.feature` · Src: [4], [8]
- **[A11Y-03] Desktop and mobile viewports** — Every accessibility scenario runs at a desktop viewport and at a mobile viewport (width ≤ 390 CSS px).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**/*accessibility*.feature`, `tests/acceptance/features/step-definitions/accessibility/**` · Src: [4], [8]
- **[A11Y-04] WCAG 2.2 AA tag set** — `AXE_TAGS` passed to `AxeBuilder.withTags()` contains `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`, so `region`, `landmark-one-main`, `page-has-heading-one`, `heading-order` and `aria-dialog-name` (best-practice rules) also run.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [8]
- **[A11Y-05] `target-size` rule explicitly enabled** — The axe call enables `target-size` explicitly (for example `.options({ rules: { "target-size": { enabled: true } } })`), because axe-core ships WCAG 2.2 rules disabled by default and a tag filter alone is not proof they run.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [8], [2]
- **[A11Y-06] `incomplete` results surfaced** — The axe helper logs or writes `results.incomplete` (needs-review items such as `color-contrast` on gradients, `aria-hidden-focus`) instead of asserting `violations` only, so needs-review nodes reach a human verdict.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [8]
- **[A11Y-07] Exclusions are explicit and justified** — Every `.exclude()`, `.disableRules()` or rule override in the axe helper targets a narrow selector and is recorded in `docs/accessibility.md` with rule id, WCAG success criterion, reason and revisit condition; no per-scenario silencing exists.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [8]
- **[A11Y-08] Scan after hydration and animations settle** — `checkAccessibility` waits for load completion, `document.fonts.ready` and the end of all finite running animations before `analyze()`, so GSAP entrances from `opacity: 0` do not produce false contrast or hidden-content results; the step first opens and awaits the target state (dialog visible, question revealed, toast shown) so axe scans it while visible.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [16], [8]
- **[A11Y-09] Portalled content in scope** — The `AxeBuilder` context is the whole document (no `.include()` limited to a subtree), so teleported dialogs, slideovers, popovers, tooltips and toasts are analysed.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/accessibility/**` · Src: [8], [9]
- **[A11Y-10] Accessibility scenarios run in CI** — No workflow or Cucumber profile filters out `@accessibility` (`not @accessibility`) from the acceptance run executed on pull requests.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/**`, `configs/cucumber/**` · Src: [4], [8]

## 2. Structure and semantics

- **[A11Y-11] Landmarks complete and unique** — Every page has exactly one `main`, at most one `banner` and one `contentinfo`, and all content sits inside a landmark (`landmark-one-main`, `landmark-no-duplicate-banner`, `landmark-no-duplicate-contentinfo`, `region` pass).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [8], [1]
- **[A11Y-12] Single `main` element** — Exactly one `main` landmark exists: no layout, page or component renders another `<main>` or `role="main"` (`UMain` renders `<main>` by default; verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/layouts/**`, `app/pages/**`, `app/components/**/*.vue` · Src: [27], [8]
- **[A11Y-13] One descriptive `h1` per page** — Each page and each game state renders exactly one `h1` that names the page or state (not the brand alone), and heading levels never skip (`page-has-heading-one`, `heading-order`, 2.4.6).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**/*.vue` · Src: [8], [1]
- **[A11Y-14] Semantic lists for grouped items** — Groups of like items (question source lists, theme stacks, filter options, sidebar entries, changelog entries, rules table of contents) are `ul`/`ol` + `li` or a documented ARIA pattern, not sibling `div`s (1.3.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [8], [1]
- **[A11Y-15] Buttons are buttons, links are links** — Navigation uses `NuxtLink`, `ULink` or `UButton` with `to` (real `<a href>`); actions use `<button>` or `UButton`; no `@click` on `div`, `span`, `li`, `img` or `svg`, and no `<a>` without `href`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [5], [6], [1]
- **[A11Y-16] Current location exposed** — The active item of every navigation set (docs table of contents, settings tabs, tutorial progress) exposes `aria-current` (`page`, `location` or `step`) on exactly one item.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/docs/**`, `app/components/domain/game/GameTutorial/**` · Src: [6], [1]
- **[A11Y-17] DOM order matches visual order** — Interactive content is not visually reordered with CSS `order`, `flex-row-reverse`, `flex-col-reverse` or absolute positioning in a way that changes reading or tab sequence (1.3.2, 2.4.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/assets/css/**` · Src: [1]

## 3. Keyboard

- **[A11Y-18] Every core task keyboard-only** — A keyboard-only Playwright run completes every core task — start a game, read a question, navigate next/previous, open the sidebar, apply filters, change settings and language, run and skip the tutorial, open the changelog, dismiss a toast — with the Tab sequence following the painted reading order (2.1.1, 2.4.3).
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [1], [4]
- **[A11Y-19] No keyboard trap** — Tab and Shift+Tab leave every non-modal region, and Escape closes every dismissible overlay, sidebar and tutorial popover, returning to the page (2.1.2).
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [1], [9]
- **[A11Y-20] Shortcuts never fire while typing** — Every `defineShortcuts` binding keeps the default `usingInput: false` (the shortcut triggers only when no input is focused; verified: @nuxt/ui 4.12.0); a binding that sets `usingInput: true` or an input name returns early when the received `KeyboardEvent` has `isComposing === true`, so typing and IME composition never submit, confirm or close anything.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/components/**/*.vue`, `app/composables/**` · Src: [24], [12], [1]
- **[A11Y-21] Custom key handlers ignore editable targets** — Every raw `keydown`/`keyup` listener (`useEventListener`, `onKeyStroke`, `@keydown`) used for game navigation or the tutorial returns early for `input`, `textarea`, `select`, `[contenteditable]` and `role="combobox"` targets and for `event.isComposing`, through the shared editable-target helper.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/**/*.vue`, `app/composables/**`, `app/utils/core/element/**` · Src: [12], [1]
- **[A11Y-22] Arrow keys keep text-editing behaviour** — With focus in a text field, select menu or multi-select, arrow keys move the caret or the option highlight and never change the question or tutorial step.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [12], [1]
- **[A11Y-23] Character-key shortcuts conform to 2.1.4** — Any shortcut made of a single letter, digit or punctuation key without modifier can be turned off, remapped, or is active only while its component has focus; arrow keys and modifier combinations are out of scope (technique G217, failure F99).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/**/*.vue`, `app/composables/**` · Src: [1], [3], [19]
- **[A11Y-24] Modifier shortcut fires once** — A modifier shortcut that triggers a primary action ignores `event.repeat` or is blocked while that action is pending, so a held key triggers one submission (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/ui/modal/**` · Src: [24], [19]
- **[A11Y-25] Shortcuts are discoverable** — Every keyboard shortcut is shown next to its control (`UKbd` hint) or exposed with `aria-keyshortcuts` using a modifier-first value that matches the handler, and the hint is hidden when the shortcut is disabled.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/shared/ui/modal/**` · Src: [19]
- **[A11Y-26] No positive `tabindex`** — No element uses `tabindex` greater than `0` (axe `tabindex`); focusability changes use `0` or `-1` only.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [8], [1]
- **[A11Y-27] Focus indicator never removed** — No component class, `app.config.ts` slot override or stylesheet applies `outline-none`, `focus:outline-none`, `focus-visible:outline-none`, `ring-0` on focus or `outline: none` without a visible `focus-visible` replacement (2.4.7).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.vue`, `app/config/**`, `app/assets/css/**`, `app/app.config.ts` · Src: [1], [4]
- **[A11Y-28] Focus indicator visible on every control type** — A computed-style or screenshot check shows a non-transparent focus indicator on buttons, links, cards, chips, tabs, switches, select triggers and the tutorial popover controls.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[A11Y-29] Focus never fully obscured** — For every focus stop, the focused element is not entirely hidden behind the sidebar toggle, sticky headers, the toast stack, the offline indicator or the tutorial spotlight overlay (2.4.11).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [2]
- **[A11Y-30] Skip link to main content** — Each layout renders a skip link as the first focusable element, visible on focus, that moves focus to the `main` target (with `tabindex="-1"`) (2.4.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/layouts/**` · Src: [1], [4], [5], [6]

## 4. Focus management

- **[A11Y-31] Dialog initial focus is deliberate** — On opening settings, filters, changelog, confirm dialog or the sidebar, `document.activeElement` is inside the overlay (first control, or the title with `tabindex="-1"` for long content), never `body`.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [9]
- **[A11Y-32] Focus returns to the invoker** — Closing any overlay with Escape, the close button, the primary action or an outside click returns focus to its trigger; when the trigger no longer exists, focus lands on a logical successor (for example the sidebar toggle), never `body`.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [9]
- **[A11Y-33] Background inert while modal** — While a modal overlay is open, Tab never leaves it, the dialog has `aria-modal="true"` and outside content is inert or hidden without any `aria-hidden="true"` ancestor of the dialog (`aria-hidden-focus` passes); non-modal popovers and tooltips never carry `aria-modal`.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [9], [8]
- **[A11Y-34] Escape and outside click keep working** — `UModal`, `USlideover` and `UPopover` keep the default `dismissible: true` (Escape and outside click close; verified: @nuxt/ui 4.12.0); any `:dismissible="false"` overlay provides a visible keyboard-reachable close or cancel action and handles `close:prevent`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [25], [26], [30]
- **[A11Y-35] Route announcer mounted** — A route announcer is mounted once at the application root, so client-side navigations announce the new page title (Nuxt's `<NuxtRouteAnnouncer>`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/App.vue`, `app/layouts/**` · Src: [7], [6]
- **[A11Y-36] Navigation is announced and moves focus** — After each client-side navigation (home → game, game → rules, rules → home), the announcer text equals the new title and the next Tab starts inside `main` because focus was moved to `main` or the `h1` (Nuxt does not move focus itself).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6], [7]
- **[A11Y-37] Focus survives reactive re-render** — Going to the next or previous question, applying filters, toggling settings and switching locale never leave `document.activeElement === body`; focus stays on the same logical control or moves deliberately.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [5], [6]
- **[A11Y-38] Game state swaps place focus** — When the game switches between loading, playing, fetch-error, empty-filters and no-more-questions states, focus moves to the new state's heading or primary action whenever the previously focused element was removed.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6]
- **[A11Y-39] Tutorial manages focus per step** — Each tutorial popover has an accessible name equal to the step title, moves focus into the popover, exposes the step position, closes on Escape, and on finish or skip restores focus to the origin element or the sidebar toggle.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [9], [1]

## 5. ARIA patterns

- **[A11Y-40] Icon-only buttons have an accessible name** — Every `UButton`, `ULink`, `<button>` or `<a>` rendered without visible text (only `icon`, `leading-icon`, `trailing-icon`, avatar or an icon slot) sets a translated `aria-label` or `aria-labelledby` naming the action, not the icon; `UButton` `label` is optional and the component adds no name by itself (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [23], [8], [1]
- **[A11Y-41] Label in name** — When a control has both visible text and an `aria-label`, the accessible name contains the visible text, ideally at the start (`label-content-name-mismatch`, 2.5.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [8], [1]
- **[A11Y-42] Dialogs have an accessible name** — Every `UModal` and `USlideover` sets the `title` prop or `#title` slot (also when the `#content` slot is used), because without one Nuxt UI renders an empty visually hidden `DialogTitle` and the dialog is nameless (verified: @nuxt/ui 4.12.0); `aria-dialog-name` passes.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/components/**/*.vue` · Src: [25], [26], [9], [8]
- **[A11Y-43] Interactive popovers are named** — Every `UPopover` whose content contains controls (tutorial steps, theme stack details) passes an `aria-label` or `aria-labelledby` through its `content` props.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameTutorial/**`, `app/components/domain/game/GameQuestionCard/**` · Src: [9], [8]
- **[A11Y-44] Select and menu widgets are operable** — Every `USelect`, `USelectMenu` and `UDropdownMenu` (locale select, filter multi-selects) has an accessible name, opens with Enter/Space/ArrowDown, moves with arrows, and Escape closes it and restores focus to the trigger with `aria-expanded` in sync.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [10], [12]
- **[A11Y-45] Multi-select filters use a supported pattern** — Theme, category and cognitive-difficulty filters use either a listbox with `aria-multiselectable="true"` and `aria-selected` options containing no interactive children, or native checkboxes in a group.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/domain/game/GameQuestionsFiltersModalContent/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [11], [1]
- **[A11Y-46] Combobox search is valid** — When a filter search input uses `role="combobox"`, it sets `aria-expanded`, `aria-controls` (not legacy `aria-owns`), `aria-autocomplete` and `aria-activedescendant`, and Escape collapses the popup keeping focus in the input.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [12]
- **[A11Y-47] Tabs follow the tabs pattern** — The settings modal tabs use roving `tabindex`, `aria-selected`, `aria-controls`/`aria-labelledby` pairing, Left/Right/Home/End, and a focusable panel when it has no focusable child.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [13]
- **[A11Y-48] Tooltip is never the only name** — A trigger wrapped in `UTooltip` gets its accessible name from its own label or `aria-label`, and no essential information exists only in tooltip text (unavailable to touch users).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [14], [1]
- **[A11Y-49] Switch label is stable** — Every `USwitch` (adult content setting) exposes `role="switch"` with `aria-checked`, and its visible label does not change between on and off states.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameSettingsModal/**` · Src: [15]
- **[A11Y-50] No nested interactive elements** — No button, link or form control is nested inside another interactive element (for example a `UButton` inside a `NuxtLink` or a clickable card), and `nested-interactive` passes.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [8]
- **[A11Y-51] Instance-unique, hydration-stable ids** — Ids referenced by `for`, `aria-labelledby`, `aria-describedby` or `aria-controls` in reusable components are generated per instance (Vue `useId()`), stable across server and client renders, never counters or `Math.random()`, never hard-coded literals, and `useId()` is never called inside `computed()`; `duplicate-id-aria` passes (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [5], [29], [8]

## 6. Status messages

- **[A11Y-52] Toasts are announced** — With NVDA and VoiceOver, every toast (API error, locale suggestion, offline, changelog) is announced once while `document.activeElement` stays unchanged (4.1.3, 2.4.3).
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [3]
- **[A11Y-53] Severity maps to politeness** — Error messages use `role="alert"` or assertive announcements; success and info messages use `role="status"` or polite announcements; routine updates never use an assertive region.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/composables/**` · Src: [3], [1]
- **[A11Y-54] Live regions exist before their message** — Every custom `aria-live` or `role="status"` element (for example `OfflineStatusIndicator`) stays mounted and only its text changes; the region is never created by the same `v-if` that inserts the message.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/shared/ui/OfflineStatusIndicator/**`, `app/components/**/*.vue` · Src: [1], [3]
- **[A11Y-55] Loading states are announced** — `GameLoading`, `LoadingSpinner` and skeletons pair the visual indicator with `role="status"` text or `aria-busy="true"` on the updating region, not animation alone.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameLoading/**`, `app/components/shared/ui/LoadingSpinner/**` · Src: [1], [6]
- **[A11Y-56] Offline and reconnect announced once each** — Losing connectivity produces one polite announcement and recovering produces one, with no repeated announcement on retries or re-renders.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [6]
- **[A11Y-57] Question changes are announced** — Moving to another question announces the new question position and content through a polite live region or the focused element's name, without moving focus away from the navigation control.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GamePlaying/**` · Src: [6], [7], [1]
- **[A11Y-58] Fetch errors are perceivable** — The `GameFetchError` state either renders inside a `role="alert"` region or receives focus on its heading when it replaces the game, so screen-reader users learn the request failed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameFetchError/**`, `app/components/domain/game/GameStateRenderer/**` · Src: [1], [3]

## 7. Forms

- **[A11Y-59] Every control has a programmatic label** — Every `UInput`, `USelect`, `USelectMenu`, `UInputMenu`, `UCheckbox`, `USwitch` and native control has a label via `UFormField` `label`, `label[for]`, `aria-labelledby` or `aria-label`, and removing the `placeholder` of any search or select field still leaves a non-empty accessible name (3.3.2, 4.1.2).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/**/*.vue` · Src: [8], [5]
- **[A11Y-60] Related controls are grouped** — Each filter group (categories, themes, cognitive difficulties) is wrapped in `fieldset`/`legend` or `role="group"` with `aria-labelledby` pointing at its visible heading (1.3.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameQuestionsFiltersModalContent/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [1], [3]
- **[A11Y-61] Errors are text and associated** — When a control can be invalid, the error is text, the control gets `aria-invalid="true"` and `aria-describedby` pointing at the message, and multi-field errors are summarised (3.3.1, 3.3.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [1], [4]
- **[A11Y-62] No change of context on input** — Selecting a filter, locale or switch value never navigates, reloads or moves focus unexpectedly; changes apply in place or through an explicit apply action (3.2.2).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1]

## 8. Contrast and colour

- **[A11Y-63] Text contrast** — All text, including muted and dimmed text, placeholders, badges, chips, docs pages and disabled-adjacent labels, reaches 4.5:1 (3:1 for large text) against its background in every scanned state (`color-contrast`, 1.4.3); text on gradients, images or transformed layers that axe reports as `incomplete` has a dated manual measurement.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [1], [4], [8]
- **[A11Y-64] Token pairs meet contrast** — Every foreground/background token pair defined for text in `app/assets/css/**` and the `ui.colors` mapping in `app/app.config.ts` computes to at least 4.5:1, and colour opacity modifiers on text (for example `/60`) are included in the computation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/app.config.ts`, `app/config/**` · Src: [1], [4]
- **[A11Y-65] Non-text contrast** — Input borders, switch track and thumb, progress indicators, selected-state outlines and focus indicators reach 3:1 against adjacent colours (1.4.11).
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1], [4]
- **[A11Y-66] Colour is never the only cue** — Difficulty, adult-content and hint badges, selected filters, offline status and validation states convey meaning with text, icon or shape in addition to colour (1.4.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/**/*.vue`, `app/config/**` · Src: [1], [4]
- **[A11Y-67] Inline links distinguishable** — Links inside body text (rules page, docs, changelog, question sources) are underlined or otherwise distinguishable without colour (`link-in-text-block`, 1.4.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/components/docs/**`, `app/components/**/*.vue` · Src: [8], [1]
- **[A11Y-68] Forced-colors focus fallback** — Focus indicators and control boundaries drawn only with `box-shadow` or `background-image` (both forced to `none` under `forced-colors: active`) also have an `outline` or border fallback; no separate forced-colors theme is shipped, only targeted fixes.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/config/**`, `app/**/*.vue` · Src: [17]
- **[A11Y-69] Forced-colors mode usable** — With `forced-colors: active` emulated, focus rings, button and input boundaries, selected states and the tutorial spotlight remain visible on every page.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17]

## 9. Motion

- **[A11Y-70] GSAP honours reduced motion** — Every GSAP timeline or tween branches on the `prefers-reduced-motion` preference (`usePreferredReducedMotion()` or `gsap.matchMedia()`; verified: @vueuse/core 15.0.0) and skips transform, rotation, scale and filter animation when it is `reduce`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GamePlaying/**`, `app/composables/domain/useQuestionCardHighlight/**` · Src: [28], [16], [4]
- **[A11Y-71] CSS motion has reduced-motion overrides** — Every `@keyframes`, `transition`, Vue `<Transition>` class and `animate-*` utility in stylesheets and components has a `prefers-reduced-motion: reduce` override or a `motion-safe:` variant; `scroll-behavior: smooth` and `scrollTo({ behavior: smooth })` apply only under `prefers-reduced-motion: no-preference`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/components/**/*.vue` · Src: [16], [6]
- **[A11Y-72] Reduced motion keeps essential feedback** — The reduced-motion branch still applies the final visual state (active card visible, highlight shown) and completes pending callbacks; only decorative motion is dropped.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GamePlaying/**`, `app/composables/domain/useQuestionCardHighlight/**` · Src: [16]
- **[A11Y-73] Looping motion can be stopped** — Any animation that starts automatically, lasts more than 5 s and is shown alongside other content (pulses, infinite iterations) is stoppable, or stops under reduced motion, unless it is an essential loading indicator (2.2.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/components/**/*.vue` · Src: [1], [4]
- **[A11Y-74] No flashing above threshold** — No state transition flashes more than three times in any one second (2.3.1).
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [4]

## 10. Layout and zoom

- **[A11Y-75] Viewport allows zoom** — The `app.head.viewport` meta starts with `width=device-width, initial-scale=1` and contains no `user-scalable=no` and no `maximum-scale` below 5 (`meta-viewport`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [8], [4]
- **[A11Y-76] Reflow at 320 CSS px** — At 320 CSS px width (400 % zoom of 1280 px), every page and overlay (modals, tutorial popover, sidebar) needs no horizontal scrolling and loses no content or function (1.4.10).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[A11Y-77] Text resizes to 200 %** — At 200 % text size, no label, button text, badge or question text is clipped, overlapped or truncated without a way to read it (1.4.4).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [4]
- **[A11Y-78] Text-spacing overrides do not clip** — With line-height 1.5, letter-spacing 0.12 em, word-spacing 0.16 em and paragraph spacing 2 em applied, no text is cut off or overlaps (1.4.12).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [4]
- **[A11Y-79] No fixed-height text containers** — Containers holding translatable text do not combine fixed heights (`h-*`, `max-h-*`) with `overflow-hidden`, `truncate` or `line-clamp-*` unless the full text stays available (scroll, expand or accessible name).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [1]
- **[A11Y-80] Orientation not locked** — Neither CSS nor the web app manifest locks the display to portrait or landscape, and both orientations are usable (1.3.4, `css-orientation-lock`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/assets/css/**` · Src: [8], [1]
- **[A11Y-81] Hover and focus content meets 1.4.13** — Tooltips and popovers (theme stack, icon-button tooltips) dismiss with Escape without moving focus, stay open while the pointer moves onto them, and persist until dismissed or the trigger loses hover/focus.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [14]

## 11. Pointer and touch

- **[A11Y-82] Targets meet 24×24 CSS px** — Every pointer target is at least 24×24 CSS px or spaced so a 24 px circle centred on it does not intersect another target, and icon-only controls never use sizing that yields less than 24×24 CSS px unless the 24 px spacing exception applies; inline links in sentences are exempt (`target-size`, 2.5.8).
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [1], [2], [8]
- **[A11Y-83] Activation on the up event** — No action fires on `@pointerdown`, `@mousedown` or `@touchstart`; activation uses `click` or the up event so sliding off a target cancels it (2.5.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/composables/**` · Src: [1]
- **[A11Y-84] No hover-only functionality** — Everything revealed on hover (theme stack details, tooltips, card affordances) is also reachable by tap and keyboard focus.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue` · Src: [1]

## 12. Content

- **[A11Y-85] Images have appropriate alternatives** — Informative `<img>` and `NuxtImg` elements have an `alt` describing purpose, decorative ones have `alt=""`, and the logo `alt` is the brand name; decorative `UIcon` and inline `svg` next to text are `aria-hidden="true"`, while standalone informative icons have a text alternative (`image-alt`, `svg-img-alt`, 1.1.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [8], [4]
- **[A11Y-86] Link purpose clear** — Link text identifies its destination without surrounding context (no bare "click here" or "learn more"), and links opening a new tab say so in their name or an announced icon (2.4.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/i18n/locales/**` · Src: [1], [4]
- **[A11Y-87] Consistent navigation and identification** — Repeated navigation (sidebar, docs back link, footer links) keeps the same relative order on every route, the same icon and label always denote the same function across components, and the help entry points keep the same relative position on every page that offers them (3.2.3, 3.2.4, 3.2.6).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/layouts/**` · Src: [1]
- **[A11Y-88] Offline and error pages are real pages** — `app/pages/offline/**` and the error page render an `h1`, explanatory text and a keyboard-reachable route back to the game or home.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/offline/**`, `app/pages/**` · Src: [1], [6]

## 13. Statement and manual test protocol

- **[A11Y-89] Target standard declared** — `docs/accessibility.md` declares the conformance target (WCAG 2.2 AA) and how it relates to RGAA 4.1.2 and EN 301 549 (WCAG 2.1 AA), consistent with the `AXE_TAGS` set.
  Evidence: `static` · Diff: ✓ · Severity: medium · Src: [22], [8]
- **[A11Y-90] Accessibility statement linked and complete** — When an accessibility statement is published, it is an accessible page reachable from the home page and every other page, states the conformance level, lists non-accessible content (non-conformities, disproportionate-burden exemptions, out-of-scope content), provides a contact and recourse path, and is dated and re-validated (at least every 3 years and within 18 months of a new RGAA version).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/home/HomeFooter/**`, `app/pages/**` · Src: [21]
- **[A11Y-91] Manual screen-reader protocol defined** — `docs/accessibility.md` defines named assistive-technology pairs (NVDA + Firefox, VoiceOver + Safari on macOS and iOS, TalkBack + Chrome), per-page task scripts, the success criteria axe cannot prove (2.1.1, 2.1.2, 2.1.4, 2.4.3, 2.4.11, 1.3.2, 2.2.2, 2.5.2, 3.2.6, 4.1.3 timing) each mapped to a manual or scripted check, and compensating manual checks for known third-party gaps (Reka primitives, the work-in-progress APG tooltip pattern).
  Evidence: `static` · Diff: ✓ · Severity: medium · Src: [21], [4], [14], [1]
- **[A11Y-92] Manual protocol executed per release** — Each release has dated screen-reader, keyboard-only and zoom results tied to a commit SHA and covering every task script, retained with the axe output and axe-core version so a result can be reproduced.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [21], [4], [8]

## Sources

[1] Web Content Accessibility Guidelines (WCAG) 2.2 — https://www.w3.org/TR/WCAG22/ — fetched 2026-10-31 (W3C Recommendation, 12 December 2024)
[2] What's New in WCAG 2.2 — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ — fetched 2026-10-31 (WAI, updated 5 October 2023)
[3] How to Meet WCAG 2.2 (Quick Reference) — https://www.w3.org/WAI/WCAG22/quickref/ — fetched 2026-10-31 (WCAG 2.2)
[4] The A11Y Project Checklist — https://www.a11yproject.com/checklist/ — fetched 2026-10-31 (2013–2024 edition)
[5] Vue.js Accessibility — https://vuejs.org/guide/best-practices/accessibility.html — fetched 2026-10-31 (Vue 3 docs)
[6] Nuxt accessibility best practices — https://nuxt.com/docs/4.x/guide/best-practices/accessibility — fetched 2026-10-31 (Nuxt 4.x docs)
[7] NuxtRouteAnnouncer component — https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer — fetched 2026-10-31 (Nuxt 4.x, available since 3.12)
[8] axe-core rule descriptions — https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md — fetched 2026-10-31 (axe-core 4.14 ruleset)
[9] APG Dialog (Modal) Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — fetched 2026-10-31 (WAI-ARIA APG)
[10] APG Menu Button Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ — fetched 2026-10-31 (WAI-ARIA APG)
[11] APG Listbox Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ — fetched 2026-10-31 (WAI-ARIA APG)
[12] APG Combobox Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ — fetched 2026-10-31 (WAI-ARIA APG)
[13] APG Tabs Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ — fetched 2026-10-31 (WAI-ARIA APG)
[14] APG Tooltip Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ — fetched 2026-10-31 (work in progress, no task force consensus)
[15] APG Switch Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/switch/ — fetched 2026-10-31 (WAI-ARIA APG)
[16] MDN prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — fetched 2026-10-31 (last modified 2026-06-10)
[17] MDN forced-colors — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors — fetched 2026-10-31 (last modified 2026-04-20)
[19] MDN aria-keyshortcuts — https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts — fetched 2026-10-31 (last modified 2025-05-12)
[21] RGAA — Déclaration d'accessibilité — https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/ — fetched 2026-10-31 (RGAA 4.1.2)
[22] RGAA — Rappel du champ d'application — https://accessibilite.numerique.gouv.fr/obligations/champ-application/ — fetched 2026-10-31 (RGAA 4.1.2)
[23] Nuxt UI Button — https://ui.nuxt.com/docs/components/button — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[24] Nuxt UI defineShortcuts — https://ui.nuxt.com/docs/composables/define-shortcuts — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[25] Nuxt UI Modal — https://ui.nuxt.com/docs/components/modal — fetched 2026-10-31 (library @nuxt/ui 4.12.0, docs and dist/runtime/components/Modal.vue)
[26] Nuxt UI Slideover — https://ui.nuxt.com/docs/components/slideover — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[27] Nuxt UI Main — https://ui.nuxt.com/docs/components/main — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
[28] VueUse usePreferredReducedMotion — https://vueuse.org/core/usePreferredReducedMotion — fetched 2026-10-31 (library @vueuse/core 15.0.0)
[29] Vue Composition API helpers (useId) — https://vuejs.org/api/composition-api-helpers — fetched 2026-10-31 (library vue 3.5.44)
[30] Nuxt UI Popover — https://ui.nuxt.com/docs/components/popover — fetched 2026-10-31 (library @nuxt/ui 4.12.0)
