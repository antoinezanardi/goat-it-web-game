# Complete i18n translations from French source

## Task

- For each JSON file under app/i18n/locales/fr/ (recursively), produce a completed translation into every other locale directory under app/i18n/locales/ (all subdirectories except `fr`).
- Do NOT modify any files in app/i18n/locales/fr/. Treat the `fr` files as the immutable source of truth.

## Behavior & rules

### Source of truth

- Read keys and values from each file in app/i18n/locales/fr/**. Use them as the canonical base for structure, keys, ordering, and message intent.

### Target files

- For each corresponding path in each target locale (e.g. app/i18n/locales/en/<same-file>.json):
  - If the file does not exist, create it.
  - If a key is missing, add it with a correct translation from French into the target locale.
  - If a key exists but is empty or exactly equal to the French string, replace it with a proper translation.
  - If a key already has a non-French translation, leave it unchanged.

### Preserve tokens and structure

- Never alter placeholders, variables, or ICU syntax. Examples: `{name}`, `{{name}}`, `%s`, `%{count}`, `{count, plural, one {..} other {..}}`.
- Keep punctuation, inline HTML tags, markdown snippets, and code-like tokens (e.g., `API`, `Goat-IT`) unchanged.
- For ICU plurals/choices: keep the same ICU structure and adapt the plural categories only if the locale requires different categories — ensure the resulting ICU message is valid for the target locale.

### Translation quality

- Translate into natural, idiomatic language for the target locale (do not produce literal word-for-word translations).
- Keep consistent register with the French source (formal vs. informal tone) unless the locale conventionally uses a different register — prefer neutral/formal if unsure.
- Do not translate brand names, product names, technical identifiers, or values that look like code.

### JSON and formatting

- Output must be valid JSON encoded as UTF-8.
- Preserve key order from the French file.
- Keep indentation consistent (2 spaces recommended) and ensure a trailing newline at end of file.

### Safety & scope

- Only modify files under app/i18n/locales/<locale>/ for locale != fr.
- Do not add or remove keys in the French files.
- Do not add extra files outside the locales tree.

### Validation

- After writing each file, ensure it parses as JSON.
- If any ICU/plural adaptation was required, ensure ICU syntax is valid for the target locale.
- If a translation is ambiguous (requires context), choose the most likely idiomatic option and add an inline comment in the file only if the format supports it; otherwise prefer the chosen translation. (Prefer not to add comments in JSON; instead pick the best translation.)

### Examples / edge cases

- French: "Bonjour {name}, vous avez {count, plural, one {# message} other {# messages}}."
  - English should preserve placeholders and produce: "Hello {name}, you have {count, plural, one {# message} other {# messages}}."
- French: "Cliquez sur <strong>Confirmer</strong>"
  - Translate only the visible text: e.g., English "Click <strong>Confirm</strong>" — keep tags.
- French: "API rate limit exceeded (code: ERR_RATE)"
  - Keep `ERR_RATE` and `API` unchanged.

### File paths & execution hint

- Source dir: `app/i18n/locales/fr/`
- Target dir base: `app/i18n/locales/` (process every subdirectory except `fr`)
- Ensure one-to-one filename mapping: for each `app/i18n/locales/fr/path/to/file.json` produce `app/i18n/locales/<locale>/path/to/file.json`.

### Finish

- Report a short summary listing which locale files were created and which were updated, plus any messages where ICU/plural structure needed manual attention.
- Do not commit changes to version control; just output the completed files in the filesystem.
