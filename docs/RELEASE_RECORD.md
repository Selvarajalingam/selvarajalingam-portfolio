# Initial release record

Status: **live deployment under review; confirmed-origin SEO prepared locally for redeployment**. Do not fill a field below with an inferred account or deployment ID. Never record credentials or visitor data.

| Evidence | Actual state |
| --- | --- |
| Local branch | `main`; initial commit `b79fcd2` now exists |
| GitHub remote / repository | `https://github.com/Selvarajalingam/selvarajalingam-portfolio.git`; user pushed and Vercel log confirms cloning it |
| Reviewed release commit | Local HEAD `479b82f` contains the install repair; exact live commit and final content review remain unverified |
| Hosted quality run | Workflow prepared; hosted result not verified by the agent |
| Vercel account/team/project | User initiated import as `selvarajalingam-portfolio` in their existing account; no authenticated agent linkage/project ID recorded |
| Preview URL / deployment ID | User successfully deployed main as production; no separate reviewed feature preview or immutable deployment ID recorded |
| Preview protection/access review | Pending actual account settings |
| Preview smoke / owner review | Pending actual preview |
| Approved production origin | User confirmed `https://selvarajalingam.vercel.app`; configured locally for SEO, pending push/redeploy |
| Indexing / analytics | Noindex remains active; source explicitly sets `webAnalytics: false` to preserve disabled collection after origin configuration |
| Live contact | Disabled without verified deployment/provider configuration; no real messages sent |
| Content/asset approval | Outstanding items in `CONTENT_VERIFICATION.md` remain omitted |
| Production release authorization | User performed initial deployment and requested SEO setup; final content/indexing approval remains pending |
| Production URL / deployment ID | `https://selvarajalingam.vercel.app` loads; immutable deployment ID not recorded |
| Production smoke / provider inbox verification | GET-only smoke passed all 23 routes before origin change, including noindex/contact unavailable; no real provider inbox test |
| Previous known-good deployment / rollback target | None recorded; required before relying on rollback |

Local commands and actual Phase 12 results are recorded in `docs/PHASE_CHECKPOINTS.md`. Phase 11 technical evidence remains in `docs/PHASE_11_AUDIT.md`. Follow `docs/OWNER_HANDOVER.md` and `DEPLOYMENT_GUIDE.md` to finish the access → preview → review → approved production sequence.

Phase 12 local verification: lint/types, 148 unit tests, production build, 128 E2E checks, 10 audit checks (two intentional skips), SEO/assets/bundle checks and dependency audit passed. GET-only smoke passed all 23 routes locally. Hosted CI/preview/production fields above remain pending; local verification does not fill them.

After account access is available, replace pending fields with real links/IDs, the exact tested revision, approval evidence and dated results. Record actual smoke failures and recovery; never mark production complete based on a local test or mocked email result.

Initial install failure and verified local repair: `docs/DEPLOYMENT_INSTALL_FIX.md`. The exact missing-package error was reproduced with npm 12; a fresh npm 12 install plus lint/types/148 tests/build passed after repair. No successful hosted retry is claimed.

Subsequent update: the user pushed the repair, reported successful deployment and selected the shorter domain above. The agent verified the homepage returns 200 and all 23 route smoke checks pass in the deployed noindex state. The old `selvarajalingam-portfolio-rust.vercel.app` returned 404 in a read-only check; its intended redirect was not verified. The confirmed-origin SEO changes are local until a new deployment is tested. No tracking/indexing/contact activation is included in this change.
