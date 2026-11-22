# Initial Vercel install failure — 22 November 2026

The user's Vercel log confirms cloning `main` commit `b79fcd2` from the supplied GitHub repository. Installation stopped before the application build: `npm ci` reported missing `@emnapi/runtime@1.11.3` and `@emnapi/core@2.0.0-beta.2` lockfile entries. The `cache-dir` warning was not the fatal error. Removing `.git`/`.env.example` via `.vercelignore` was unrelated.

Local npm 11.6.2 accepted the original lockfile, including a no-node_modules dry run. npm 12.2.3 on compatible Node 24.15.0 reproduced the exact two missing entries against the original lockfile. The provider log did not print its npm version, so this reproduction does not assert the provider's exact toolchain.

Repair: run npm 12's package-lock-only resolution in an isolated directory containing the original manifest and lockfile. Apply the inspected result: the two missing optional/peer records are added and npm normalizes peer metadata. No existing locked dependency version changed, no record was removed, and `package.json` is unchanged. Do not hand-add these packages as application dependencies or switch Vercel to an unlocked install to bypass validation.

Verification actually run:

- Real npm 12 clean install in isolation: passed, 512 packages installed.
- Fresh exported copy of committed source plus repaired lockfile: npm 12 clean install, lint, strict TypeScript, 148 tests in 20 files, content validation and production Webpack build all passed. This used a temporary compatible Node 24.15.0/npm 12.2.3 toolchain, leaving working dependencies untouched.
- Normal working-copy `npm run check`: passed lint/types/148 tests/content/build.
- npm 12 Linux x64/glibc dependency-selection dry run: passed. This is not a real Linux build; no running Docker daemon was available.
- `npm audit --audit-level=low`: zero reported vulnerabilities.
- `git diff --check`: passed. Browser suites were not repeated for lock metadata only; no existing application dependency versions or UI code changed.

CI now explicitly installs npm 12.2.3 before `npm ci` on the current Node 24 runner, which must satisfy that npm release's Node requirement (24.15.0 or newer within Node 24). This makes the stricter clean-install check part of normal hosted validation; the updated workflow has not yet run remotely. npm 12 may report blocked unapproved lifecycle scripts; the fresh build above passed under its default policy, without globally allowing scripts.

Next: review/commit/push the corrected lockfile and CI update through the repository's review workflow, then deploy the latest resulting `main` revision. Keep install `npm ci`, build `npm run build`, the three disabled environment switches and null publication origin. Redeploying the failed `b79fcd2` artifact without new source will reproduce the issue. Hosted build success, URL and production/provider smoke remain unverified until the retry completes.

Reference: [npm clean-install behavior](https://docs.npmjs.com/cli/v11/commands/npm-ci/). Local reports are ignored under `test-results/`; they contain no provider keys or contact messages.
