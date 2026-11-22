# Initial release record

Status: **local preparation only; deployment pending account/project access and preview review**. Do not fill a field below with a proposed URL or an inferred account. Never record credentials or visitor data.

| Evidence | Actual state |
| --- | --- |
| Local branch | `main`; initial commit `b79fcd2` now exists |
| GitHub remote / repository | `https://github.com/Selvarajalingam/selvarajalingam-portfolio.git`; user pushed and Vercel log confirms cloning it |
| Reviewed release commit | Initial source `b79fcd2`; final content/release review remains pending |
| Hosted quality run | Not run; `.github/workflows/quality.yml` prepared |
| Vercel account/team/project | User initiated import as `selvarajalingam-portfolio` in their existing account; no authenticated agent linkage/project ID recorded |
| Preview URL / deployment ID | First main-branch deployment attempt failed during dependency installation; no successful URL/ID recorded |
| Preview protection/access review | Pending actual account settings |
| Preview smoke / owner review | Pending actual preview |
| Approved production origin | Intentionally unconfigured by user; `origin: null` |
| Indexing / analytics | Noindex active; effective analytics inactive |
| Live contact | Disabled without verified deployment/provider configuration; no real messages sent |
| Content/asset approval | Outstanding items in `CONTENT_VERIFICATION.md` remain omitted |
| Production release authorization | Not established by local preparation |
| Production URL / deployment ID | Main-branch attempt for `b79fcd2` failed at `npm ci`; lockfile repair verified locally, awaiting push/redeploy |
| Production smoke / provider inbox verification | Not run |
| Previous known-good deployment / rollback target | None recorded; required before relying on rollback |

Local commands and actual Phase 12 results are recorded in `docs/PHASE_CHECKPOINTS.md`. Phase 11 technical evidence remains in `docs/PHASE_11_AUDIT.md`. Follow `docs/OWNER_HANDOVER.md` and `DEPLOYMENT_GUIDE.md` to finish the access → preview → review → approved production sequence.

Phase 12 local verification: lint/types, 148 unit tests, production build, 128 E2E checks, 10 audit checks (two intentional skips), SEO/assets/bundle checks and dependency audit passed. GET-only smoke passed all 23 routes locally. Hosted CI/preview/production fields above remain pending; local verification does not fill them.

After account access is available, replace pending fields with real links/IDs, the exact tested revision, approval evidence and dated results. Record actual smoke failures and recovery; never mark production complete based on a local test or mocked email result.

Initial install failure and verified local repair: `docs/DEPLOYMENT_INSTALL_FIX.md`. The exact missing-package error was reproduced with npm 12; a fresh npm 12 install plus lint/types/148 tests/build passed after repair. No successful hosted retry is claimed.
