# PRIV — Privacy, compliance & legal

Personal-data and legal compliance of the Goat It web game under EU and French law: the inventory of every cookie, browser storage item, log, Sentry event and third-party recipient; ePrivacy and CNIL cookie rules (exemptions, consent, 13-month benchmark); the privacy policy; processors and international transfers (Sentry region, DPF/SCC); Sentry v11 `dataCollection` minimisation and IP handling; data-subject rights; the LCEN art. 1-1 legal notice; the legal applicability of RGAA and the European Accessibility Act; audience protection for adult content; terms, intellectual property and asset licences; records of processing, DPIA screening and dark patterns. Checks that depend on facts outside the repository (publisher status, contracts, Sentry organization settings) are `manual` and need legal or account-owner confirmation. This is not legal advice.

**Decision doc:** `docs/privacy.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** cookie `Secure`/`SameSite`/`HttpOnly`/scope flags, secrets in client storage, secrets and logged-field allowlist in server logs, outbound header allowlist → SEC · Sentry initialization, environment, release, sampling and noise filters → OPS · log rotation and runbooks → OPS · adult-content default in the domain logic (`GAME_SETTINGS_DEFAULTS`) → LOGIC · service-worker precache scope → PWA · accessibility statement content and WCAG conformance → A11Y · third-party npm licence inventory and notices, `package.json` licence field → SUP · TLS and reverse-proxy contract → PLAT

## Contents

- [1. Data and storage inventory](#1-data-and-storage-inventory)
- [2. ePrivacy and CNIL cookie rules](#2-eprivacy-and-cnil-cookie-rules)
- [3. Transparency (privacy policy)](#3-transparency-privacy-policy)
- [4. Processors and transfers](#4-processors-and-transfers)
- [5. Minimisation and Sentry data collection](#5-minimisation-and-sentry-data-collection)
- [6. Data-subject rights](#6-data-subject-rights)
- [7. Legal notice (LCEN art. 1-1)](#7-legal-notice-lcen-art-1-1)
- [8. Accessibility legal obligations](#8-accessibility-legal-obligations)
- [9. Audience and content](#9-audience-and-content)
- [10. Terms, intellectual property and licences](#10-terms-intellectual-property-and-licences)
- [11. Records of processing, DPIA and dark patterns](#11-records-of-processing-dpia-and-dark-patterns)
- [Sources](#sources)

## 1. Data and storage inventory

- **[PRIV-01] Processing inventory documented** — `docs/privacy.md` lists every processing activity (preference cookies, Nuxt Content client database, Workbox Cache Storage, Pino server logs, rate-limiter client IP, Sentry client and server events, UptimeRobot probes, Goat It API upstream calls, host and reverse-proxy access logs) with purpose, data categories, recipients, transfers and retention.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Src: [1], [26]
- **[PRIV-02] Cookie register matches `CookieNames`** — The cookie register has exactly one row per `CookieNames` value (`goat_it_locale`, `game_settings`, `game_tutorial_invitation_decided`, `changelog_state`) with name, purpose, exemption basis, lifetime and recipient, and a cookie added to or removed from the enum updates the register in the same change.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `shared/enums/cookie.enums.ts`, `shared/constants/cookie.constants.ts`, `app/composables/domain/use*Cookie/**` · Src: [2], [4]
- **[PRIV-03] Non-cookie terminal storage registered** — The register also lists the Nuxt Content client SQLite database (OPFS or IndexedDB, `sqlite3-opfs-async-proxy` worker) and the Workbox Cache Storage entries with purpose, contents, lifetime and clearing path, and describes the service worker and its caches as strictly necessary for the user-requested offline feature.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `content/**` · Src: [4], [5], [8], project: docs/pwa.md
- **[PRIV-04] No unregistered storage or tracker in source** — No `localStorage`, `sessionStorage`, `indexedDB`, `caches` or `document.cookie` access, analytics, advertising, pixel, fingerprinting, A/B-testing or social-embed SDK exists in `app/`, `shared/` or `package.json` beyond the registered items, and every `useCookie` name comes from `CookieNames`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**`, `shared/**`, `package.json` · Src: [4], [5]
- **[PRIV-05] Runtime storage matches the register** — On a cold load of `/`, `/game` and `/rules` with cleared site data, the browser Application view shows only registered cookies and storage, and the Network view shows only same-origin requests plus the DSN-derived Sentry ingest origin.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [4], [5], [8]
- **[PRIV-06] Rate-limiter IP processing inventoried** — The register states that the client IP is held only in the in-process rate-limiter `Map` for one window (`NUXT_RATE_LIMIT_WINDOW_IN_MS`, default `60000`), is never logged or persisted, and is processed for security and availability under a stated legal basis.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/rate-limit/**` · Src: [1], project: docs/security.md
- **[PRIV-07] Sentry event fields inventoried** — The register lists the fields every Sentry event still carries after `dataCollection` opt-outs: request URL scheme, host and path (never turned off), User-Agent-derived browser, OS and device data, the referrer URL, stack traces, environment and the `errorCode`/`httpStatus` tags (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/sentry/**`, `sentry.*.config.ts` · Src: [19], project: docs/security.md

## 2. ePrivacy and CNIL cookie rules

- **[PRIV-08] Written exemption analysis per tracker** — Each cookie and storage item is mapped to art. 82 of the loi Informatique et Libertés and the CNIL exemption list (including whether the `game_settings.isAdultContentEnabled` preference is an expected UI personalisation), and the conclusion is dated.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [2], [4]
- **[PRIV-09] No non-exempt tracker before consent** — A cold load with cleared storage and no recorded choice reads or writes no non-exempt tracker and sends no request to a non-exempt third party.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: critical · Src: [2], [4]
- **[PRIV-10] Client-side Sentry ePrivacy assessment** — A dated note concludes whether the browser Sentry SDK (which reads the User-Agent and referrer from the terminal) is strictly necessary for security and exempt, or must be consent-gated or disabled in the browser.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [4], [8], [19]
- **[PRIV-11] Cookie lifetime capped at 13 months** — Every cookie's `maxAge` is at most `COOKIE_MAX_AGE_IN_SECONDS` (`34_214_400` s, the 13-month CNIL tracker-lifetime benchmark) through `DEFAULT_COOKIE_OPTIONS` or a shorter value justified in the register.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/constants/cookie.constants.ts`, `app/composables/domain/use*Cookie/**` · Src: [3]
- **[PRIV-12] No silent lifetime extension** — Cookies are rewritten only when their value changes, never on every visit or read, so the expiry is not automatically extended.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/use*Cookie/**`, `app/composables/ui/useLocaleSuggestion/**` · Src: [3]
- **[PRIV-13] Consent mechanism compliant if introduced** — When a consent banner or any non-exempt tracker is introduced: accept-all and refuse-all sit at the same level and format, no box is pre-ticked, one click refuses, closing or ignoring counts as refusal, a refusal stops every non-exempt read and write, a persistent manage-cookies control withdraws consent as easily as it was given, each choice is archived with timestamp, UI/policy version and purposes, consent and refusal are stored for about 6 months (13 months is never used as a consent-validity rule), and analytics is either anonymous first-party measurement under the CNIL exemption or consent-gated with a 13-month identifier and 25-month retention cap.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [4], [5]
- **[PRIV-14] Exempt items described in a notice** — A cookie and storage notice names each exempt cookie and storage item with its purpose and lifetime, even though no consent is required.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [4]

## 3. Transparency (privacy policy)

- **[PRIV-15] Privacy policy page exists** — A privacy-policy route exists under `app/pages/**` (for example `/privacy`) and renders a complete policy, not a placeholder.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `app/pages/**` · Src: [1], [28]
- **[PRIV-16] Policy in the six UI languages** — The policy content exists for `fr`, `en`, `de`, `es`, `it` and `pt` and the versions carry the same sections and the same update date.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `content/**`, `app/i18n/locales/**` · Src: [1], [28]
- **[PRIV-17] Policy linked from every page** — A privacy-policy link is present in the home footer, the docs layout, the game page (menu or settings "About" tab) and the offline page.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/components/domain/home/HomeFooter/**`, `app/layouts/**`, `app/components/domain/game/GameSettingsModal/**`, `app/pages/**` · Src: [9]
- **[PRIV-18] Controller identity and contact stated** — The policy names the controller (legal name or denomination), a postal address and a privacy contact email; DPO details appear only if one is designated.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [9], [28]
- **[PRIV-19] Purposes and legal bases per processing** — The policy gives a purpose and an Art. 6 legal basis for preference cookies, server logs and rate limiting, Sentry error tracking, uptime monitoring and the Goat It API calls.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [28]
- **[PRIV-20] Retention per processing stated** — The policy states a retention period or criterion for cookies, the client content database, Cache Storage, server and host logs, rate-limiter IPs and Sentry events, consistent with `docs/privacy.md`.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [28], [7]
- **[PRIV-21] Recipients and transfers stated** — The policy names Sentry, UptimeRobot, the hosting provider and the Goat It API, identifies US recipients and the safeguard used (EU-US Data Privacy Framework, SCC fallback) and how to obtain a copy.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [28], [16], [21]
- **[PRIV-22] Rights and CNIL complaint stated** — The policy lists access, rectification, erasure, restriction and objection with the channel to use, and the right to lodge a complaint with the CNIL (name, address and website).
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [28], [9]

## 4. Processors and transfers

- **[PRIV-23] Sentry DPA accepted and archived** — The current Sentry Data Processing Addendum (5.1.0, 29 May 2024) is accepted for the organization and the acceptance evidence is stored.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [16]
- **[PRIV-24] Hosting provider DPA signed** — An Art. 28 contract covers the VPS or hosting provider, including sub-processors, breach notification and deletion or return of data at contract end.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [29]
- **[PRIV-25] UptimeRobot DPA requested** — The UptimeRobot DPA (offered only on request) is signed and on file, and its monitoring locations and US sub-processors are reviewed.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [24]
- **[PRIV-26] Goat It API role clarified** — The register states whether the upstream Goat It API operator is a separate controller, joint controller or processor; if processor, an Art. 28 agreement exists.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [29]
- **[PRIV-27] Sentry region matches the documented transfer** — The production Sentry ingest origin (visible in the rendered CSP `connect-src` and the DSN host) matches the region recorded in `docs/privacy.md`; a `*.ingest.us.sentry.io` host means the US region (Iowa) and requires the DPF/SCC transfer to be documented, since the region cannot be changed after organization creation.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [17], [16], [21]
- **[PRIV-28] Example DSN reflects the chosen region** — The placeholder `NUXT_PUBLIC_SENTRY_DSN` in `envs/.env.example` uses the ingest host of the region recorded in `docs/privacy.md`, so new environments do not default to another region.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `envs/.env.example` · Src: [17]
- **[PRIV-29] Transfer impact assessment documented** — A short TIA covers each US recipient (Sentry, UptimeRobot): legal route (DPF first, SCC fallback), public-authority access risk and supplementary measures.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [16], [21]

## 5. Minimisation and Sentry data collection

- **[PRIV-30] Restrictive `dataCollection` set explicitly** — The shared Sentry init builder sets `dataCollection` with `userInfo: false`, `cookies: false`, `httpHeaders: false`, `urlQueryParams: false`, `httpBodies: []` and `stackFrameVariables: false` — never left unset, because unset `dataCollection` collects inferred IP, cookies, headers, bodies and query strings by default in v11; both runtimes spread that builder into `init`, override no `dataCollection` key, and no `sendDefaultPii` option remains (replaced by `dataCollection` in v11) (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `shared/utils/helpers/sentry/**` · Src: [32], [18], [19]
- **[PRIV-31] IP-bearing names denied when collection is re-enabled** — When `httpHeaders`, `cookies` or `urlQueryParams` is set to `true` or an allow/deny object, the deny list includes `forwarded`, `-ip`, `remote-`, `via` and `-user`, because `userInfo: false` does not stop an IP arriving through `X-Forwarded-For` (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/utils/helpers/sentry/**`, `sentry.*.config.ts` · Src: [19], [32]
- **[PRIV-32] No integration or API re-enables personal data** — No `Sentry.setUser` call (always sent), no `requestDataIntegration({ include: { ip: true } })` or other `include` override, and no `httpClientIntegration` (captures cookies and headers of failed browser requests) exists in app, server or shared code (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**`, `app/**` · Src: [19], [32]
- **[PRIV-33] Session Replay and Feedback absent** — No `replayIntegration`, `replaysSessionSampleRate`, `replaysOnErrorSampleRate` or `feedbackIntegration` is configured, because `dataCollection` does not govern Replay masking or network capture (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `sentry.*.config.ts`, `nuxt.config.ts` · Src: [19], project: docs/security.md
- **[PRIV-34] Breadcrumbs carry no console output or query strings** — The `Console` integration is removed or `beforeBreadcrumb` drops breadcrumbs with category `console`, and `beforeBreadcrumb` removes the query string from fetch and XHR breadcrumb `data.url` values on both runtimes (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/sentry/**` · Src: [19], project: docs/security.md
- **[PRIV-35] `beforeSend` is an allow-list** — `beforeSend` rebuilds a minimal event from an explicit allow-list of fields (exception, stack trace, query-free URL and transaction, environment, safe tags) instead of deleting selected fields (`user`, `extra`) from the SDK event, so a field added by a future SDK version cannot leave unreviewed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/sentry/**` · Src: [18], [15], project: docs/security.md
- **[PRIV-36] Sentry project stops storing IPs and geo** — The Sentry project has "Prevent storing of IP addresses" enabled and an Advanced Data Scrubbing rule `[Remove] [Anything] from [$user.geo.**]`, since geo data is derived from the IP even when IP storage is off.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [15]
- **[PRIV-37] Captured events carry no personal data** — A test error triggered on staging produces a Sentry event with no `user.ip_address`, cookies, headers, query string, request body or stack-frame variables.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [19]
- **[PRIV-38] Sentry retention matches the policy** — The error retention of the Sentry plan (30 days Developer, 90 days Team/Business) is the value stated in the privacy policy and the register.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [20]

## 6. Data-subject rights

- **[PRIV-39] Privacy contact channel exists** — A monitored privacy email or form is published in the privacy policy and the legal notice.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [28]
- **[PRIV-40] Rights procedure documented** — A procedure names the owner, intake, proportionate identity verification, search locations (Sentry, server and host logs), response templates, a request log and the one-month response deadline; with no accounts, access answers explain what is and is not retained.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1], [28]
- **[PRIV-41] Erasure is operable in Sentry and logs** — The procedure covers deleting Sentry issues and tag values, and states the log rotation window after which server and host log entries disappear.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [15], [7]

## 7. Legal notice (LCEN art. 1-1)

- **[PRIV-42] Legal notice page exists and is server-rendered** — A `mentions légales` route exists under `app/pages/**`, its content is available at least in French, and it answers 200 with its full text in the server-rendered HTML, readable without JavaScript.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `app/pages/**` · Src: [11], [9], [31]
- **[PRIV-43] Publisher, publication director and host identified** — The notice identifies the publisher (individual: name, first name, domicile, phone; company: denomination, legal form, capital, seat, RCS/RNE number, VAT where applicable) or a legal review confirms the LCEN art. 1-1 II non-professional option with the identity actually transmitted, names the publication director (or co-director), and gives the host name or denomination, address and phone number.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [11]
- **[PRIV-44] Legal notice linked from every page** — A legal-notice link is present in the home footer, the docs layout, the game page (menu or settings "About" tab) and the offline page, not only inside the privacy policy.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/domain/home/HomeFooter/**`, `app/layouts/**`, `app/components/domain/game/GameSettingsModal/**`, `app/pages/**` · Src: [9]

## 8. Accessibility legal obligations

- **[PRIV-45] RGAA scope assessed** — A dated legal memo in `docs/privacy.md` concludes whether the publisher falls under the French RGAA obligation (public body, private delegate of a public service, public-interest body, or company above the turnover threshold) and records the result.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [12]
- **[PRIV-46] European Accessibility Act applicability assessed** — A dated legal memo records whether the game is a service listed by the EAA (applicable since 28 June 2025: e-commerce, banking, transport, e-books, telephony…) and whether the microenterprise exemption (fewer than 10 staff and at most €2 M turnover or balance sheet) applies, with a revisit trigger such as adding paid features.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [13], [14]

## 9. Audience and content

- **[PRIV-47] No adult question before opt-in** — With cleared cookies, a game session served on `/game` shows no question flagged as adult content and every random-questions request carries `isAdultContent: false` until the player turns the adult-content switch on.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [27], [30]
- **[PRIV-48] Adult opt-in explained** — The adult-content switch in the game settings states, in all six locales, that enabling it shows mature questions, before the player enables it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/domain/game/GameSettingsModal/**`, `app/i18n/locales/**` · Src: [27], [30]
- **[PRIV-49] Audience notice and Art. 8 position documented** — The terms or footer state that the game may contain mature content and is not directed at young children (no age gate is claimed if none exists), and `docs/privacy.md` records that no consent-based processing of under-15s exists, to revisit when analytics or accounts are added.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [27], [30]

## 10. Terms, intellectual property and licences

- **[PRIV-50] Terms of use published** — Terms of use state acceptable use, IP ownership, warranty disclaimer, liability limitation, governing law and contact.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [9]
- **[PRIV-51] Font and icon licences shipped** — The self-hosted Geist font files under `public/fonts/` are distributed with the SIL Open Font License 1.1 text and copyright notice (reserved font names respected if modified), and the ISC copyright and permission notice for the Lucide icons inlined into the client bundle is published with the app (licences page or notices file).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `public/fonts/**` · Src: [23]
- **[PRIV-52] Image rights documented** — `public/img/**` (including `home-bg.avif` and the logo), `public/og-image.png` and the PWA icons and screenshots have a recorded author and licence, or are recorded as original work.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Look: `public/img/**`, `public/pwa/**` · Src: [10]
- **[PRIV-53] Question content licence documented** — The licence and attribution terms of the upstream question bank are recorded, and question source links stay displayed wherever those terms require attribution.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [10]

## 11. Records of processing, DPIA and dark patterns

- **[PRIV-54] Art. 30 record and DPIA screening maintained** — A dated record of processing activities exists and is updated on change (the Art. 30(5) small-organisation exemption is not assumed for a continuously operated public site), and a screening note explains why no full DPIA is required (no systematic monitoring, no large-scale special-category data, no innovative high-risk processing), to revisit when tracking or accounts are added.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [26]
- **[PRIV-55] Personal-data breach procedure** — A breach procedure names owners and covers detection, containment, risk assessment, CNIL notification within 72 hours and user communication when the risk is high.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1]
- **[PRIV-56] No dark patterns** — A review of the whole product against CNIL guidance finds no misleading consent or settings UI, no nagging, no obstructed refusal and no confusing toggle defaults.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [4], [5]

## Sources

[1] GDPR.eu — GDPR checklist for data controllers — https://gdpr.eu/checklist/ — fetched 2026-10-31 (no date shown)
[2] CNIL — Cookies et traceurs : que dit la loi ? — https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi — fetched 2026-10-31 (29 Sept 2020)
[3] CNIL — Cookies : solutions pour les outils de mesure d'audience — https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience — fetched 2026-10-31 (4 July 2025)
[4] CNIL — Questions-réponses lignes directrices et recommandation cookies — https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ — fetched 2026-10-31 (29 April 2026)
[5] CNIL — Cookies et traceurs : comment mettre mon site web en conformité ? — https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite — fetched 2026-10-31 (1 Oct 2020)
[7] CNIL — Les durées de conservation des données — https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees — fetched 2026-10-31 (2 April 2026)
[8] EDPB — Guidelines 2/2023 on Technical Scope of Art. 5(3) ePrivacy Directive — https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2023/guidelines-22023-technical-scope-art-53-eprivacy_en — fetched 2026-10-31 (v2.0, Oct 2024)
[9] Service-Public Entreprendre — Mentions obligatoires sur le site internet d'une entreprise — https://entreprendre.service-public.fr/vosdroits/F37351 — fetched 2026-10-31 (verified 13 Oct 2026)
[10] economie.gouv.fr — Mentions sur votre site internet : les obligations à respecter — https://www.economie.gouv.fr/entreprises/site-internet-mentions-obligatoires — fetched 2026-10-31 (11 Dec 2025)
[11] Légifrance — LCEN art. 1-1 — https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000049568614 — fetched 2026-10-31 (in force 23 May 2024)
[12] RGAA — Rappel du champ d'application — https://accessibilite.numerique.gouv.fr/obligations/champ-application/ — fetched 2026-10-31 (RGAA 4.1.2)
[13] European Commission — European Accessibility Act — https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en — fetched 2026-10-31 (accessed 2026-10-31)
[14] CCPC — EAA guidelines for microenterprises — https://www.ccpc.ie/enforcement-and-regulation/market-surveillance/accessibility/accessibility-for-businesses/european-accessibility-act-guidelines-for-microenterprises — fetched 2026-10-31 (2025/2026)
[15] Sentry — Server-Side Data Scrubbing — https://docs.sentry.io/security-legal-pii/scrubbing/server-side-scrubbing/ — fetched 2026-10-31 (accessed 2026-10-31)
[16] Sentry — Data Processing Addendum — https://sentry.io/legal/dpa/ — fetched 2026-10-31 (5.1.0, 29 May 2024)
[17] Sentry — Data Storage Location (US or EU) — https://docs.sentry.io/organization/data-storage-location/ — fetched 2026-10-31 (accessed 2026-10-31)
[18] Sentry — Options for Browser JavaScript — https://docs.sentry.io/platforms/javascript/configuration/options/ — fetched 2026-10-31 (@sentry/nuxt 11.x docs)
[19] Sentry — Data Collected for Browser JavaScript — https://docs.sentry.io/platforms/javascript/data-management/data-collected/ — fetched 2026-10-31 (@sentry/nuxt 11.x docs)
[20] Sentry — Data Retention Periods — https://docs.sentry.io/security-legal-pii/security/data-retention-periods/ — fetched 2026-10-31 (accessed 2026-10-31)
[21] European Commission — EU-US data transfers — https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en — fetched 2026-10-31 (DPF adequacy 10 July 2023)
[23] SIL — SIL Open Font License — https://openfontlicense.org/ — fetched 2026-10-31 (OFL 1.1; FAQ update 7 Nov 2023)
[24] UptimeRobot — Privacy Policy — https://uptimerobot.com/privacy/ — fetched 2026-10-31 (updated 13 Oct 2026)
[26] GDPR.eu — Art. 30 records of processing activities — https://gdpr.eu/article-30-records-of-processing-activities/ — fetched 2026-10-31 (accessed 2026-10-31)
[27] GDPR.eu — Art. 8 conditions applicable to child's consent — https://gdpr.eu/article-8-childs-consent/ — fetched 2026-10-31 (accessed 2026-10-31)
[28] GDPR.eu — Art. 13 information to be provided — https://gdpr.eu/article-13-personal-data-collected/ — fetched 2026-10-31 (accessed 2026-10-31)
[29] GDPR.eu — Art. 28 processor — https://gdpr.eu/article-28-processor/ — fetched 2026-10-31 (accessed 2026-10-31)
[30] CNIL — Les droits numériques des mineurs — https://www.cnil.fr/fr/enjeux-numeriques/les-droits-numeriques-des-mineurs — fetched 2026-10-31 (undated)
[31] CNIL — Les mentions légales sur un site web, est-ce obligatoire ? — https://www.cnil.fr/fr/cnil-direct/question/les-mentions-legales-sur-un-site-web-est-ce-obligatoire — fetched 2026-10-31 (undated)
[32] Sentry JavaScript SDK — v11 migration guide (`sendDefaultPii` replaced by `dataCollection`) — https://github.com/getsentry/sentry-javascript/blob/11.6.0/MIGRATION.md — fetched 2026-10-31 (SDK 11.6.0; installed @sentry/nuxt 11.9.0)
