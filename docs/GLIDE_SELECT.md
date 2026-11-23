# Glide Select — 22 November 2026

## Scope and source

The user requested React Bits Glide Select for every dropdown and supplied its JS/CSS source and registry command. Integrated a local strict TypeScript adaptation of that source at `src/components/ui/glide-select.tsx`, with styles in `src/styles/glide-select.css`. Reference: https://reactbits.dev/components/glide-select. No registry installer was needed because the source was supplied. Inline SVG chevron/check icons avoid adding two icon packages.

All seven controls now use the shared component:

- Shared header: Color theme, preserving stored/system preferences and cross-tab synchronization.
- `/work`: Category, Technology, Sort projects, preserving URL state, reload/history and result announcements.
- `/lab`: Lab category and Progress status, preserving empty states and reset behavior.
- `/connect`: Subject, preserving submission values, required validation, described errors, focus and retry IDs.

## Adaptation

Preserves Glide Select's animated highlight, chevron, selection swap, opening/closing treatment, option tags, controlled/uncontrolled values and mouse scrubbing. Adds the portfolio's dark/light tokens, visible focus, minimum 44px option targets, wrapped labels, measured highlight positions, multi-character typeahead and scrollable menus. Menus render in a viewport-positioned portal to avoid clipping and flip above/below the trigger as space permits. Touch scrolling remains native; decorative motion is removed under reduced motion.

The scrolling container is itself the combobox's controlled listbox; arrow keys scroll its active descendant into view. Tab and Escape dismiss without committing. Touch/assistive clicks select normally. Outside presses close. Disabling an open control dismisses it. Contact subject is carried by a hidden input, with explicit required validation and error focus on the visible combobox.

The existing tests now interact with the visible controls through `tests/helpers/select.ts` instead of the native `selectOption` API. Added component and browser regression coverage for keyboard/typeahead, controlled values, form serialization, disabling, touch selection, long menus, open-menu accessibility and contact errors.

## Verification

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm test`: 153 tests passed across 22 files.
- `npm run build`: passed; content validation and static page generation passed.
- `npm run test:e2e -- --workers=2`: final run passed all 136 desktop/mobile checks, including the new menu and contact regressions. The first run exposed the scrolling-container semantic issue and two obsolete native-option assertions; both were fixed and verified in the full rerun.
- `npm run seo:validate`: passed for all 23 actual routes.
- `npm run perf:bundles`: passed existing budgets; initial gzip estimates are 184.8 KiB for Home and 189.6 KiB for Work, with Three excluded from initial scripts. No new packages were added.
- Live development smoke at `http://localhost:3000/work`: zero failed HTTP responses, no native select elements, correct pointer selection and settled light/dark menu screenshots. No real contact message was sent.

- `npm run test:audit`: 13 passed, 2 intentional skips (CDP performance measurement is Chromium-only). All 23 routes passed dark/light accessibility, control contrast and narrow/text-spacing reflow in Chromium, Firefox and WebKit. New open-menu tests passed keyboard access, contrast and narrow reflow in all three engines. Chromium lab performance samples passed existing LCP/layout-shift budgets.
- `git diff --check`: passed.

No content facts, dependencies, credentials or deployment configuration changed. Real assistive-technology testing remains a release follow-up. No blocking user input is needed. The app remains local at `http://localhost:3000`; next is visual review before any release. No push, merge or deployment performed.
