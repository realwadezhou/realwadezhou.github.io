# Forecast Index

A small research website for inspectable technology forecasts. Built with React, Vinext, and Sites.

## Development

Run `npm install`, then `npm run dev`. Validate the application with `npx oxlint app lib components/grading-rubric.tsx`, `npx tsc --noEmit`, `node --experimental-strip-types --test tests/rubric.test.mjs`, and `npm run build`.

The claim data is manually curated. `lib/claims.ts` combines the original cases in `lib/product-claims.ts` with the historical Gurman and Kuo corpora through `lib/gurman-claims.ts` and `lib/kuo-claims.ts`. It is a selective retrospective collection, not a complete corpus or a ranking. Sources, missing evidence, and provisional assessments are displayed in each case panel. There is no automatic X or Grok connection.

Views cover product releases, model releases, people, essay evaluations, the grading rubric, and reusable Apple launch dates. The Gurman and Kuo dossiers and forecast index support product, year, verdict, statement-type, and text filters. The site is owner-private by default.

`lib/rubric.ts` defines every allowed grade, timing label, resolution clarity, evidence level, and review state. The UI renders the same definitions used by the data types. Date rules distinguish deadlines from bounded windows and use calendar-day arithmetic. Tests cover boundary dates, early/late/overdue outcomes, invalid input, source references, and the distinction between a specification forecast and a timing forecast.

Each checked claim records its retrospective resolution rule, source-linked findings, actual milestone dates, rubric version, and review history. The Gurman dossier now has 205 claims across 80 forecast families, including the original four cases with their histories preserved. Assessments remain provisional; no independent second human review or pre-event archived snapshot is recorded. The Curran case remains an unassessed lead, with X collection deferred.

## Historical research and reusable launch catalog

- `public/data/apple-launches.json`: the reusable Apple product table, with stable IDs, separate announcement/order/customer-availability dates, market, precision, source binding for each milestone, and verification date. Read this before fetching Apple dates again. Future dates are scheduled, and null dates remain unknown.
- `scripts/build-apple-launches.py`: curated launch ledger and reproducible catalog builder. Requires Python and `beautifulsoup4`. It uses a local `/tmp/gurman-apple-evidence` cache; delete the relevant cached entry when deliberately rechecking a source. The pinned review date must be updated deliberately during a new research pass.
- `scripts/collect-apple-newsroom.py`: optional discovery pass over Apple's yearly archives; not a grading engine. `docs/apple-newsroom-index.json` and `docs/apple-launch-candidates.json` retain article metadata only. Discovery candidates are not automatically launch records.
- `scripts/build-gurman-corpus.py`: 201-claim expansion ledger, with concise paraphrases, qualifiers, source dates, outcomes, families, and launch IDs. Run it after editing to regenerate `public/data/gurman-forecasts.json`. Preserve existing IDs: append new rows, retain revisions, and record changes to already-published assessments.
- `public/data/gurman-outcome-sources.json`: supplementary evidence for cancellations and specifications. These references supplement the shared launch catalog.
- `GET /api/gurman`: complete 205-claim dossier, including original cases, all evidence, assessments, and review histories, generated from the same canonical data used by the UI.

See `docs/gurman-research.md` for collection boundaries and the evaluation method. Reuse a launch ID across reporters and revisions; a shipped product can resolve several claims without duplicating its dates. A source-response hash identifies the retrieved response, not a pre-event archive. The source corpus is not a complete inventory of Gurman's reporting, and claim counts must not be presented as career accuracy.

Validation note: `npm run lint` includes the generated component catalog, which has 19 known lint errors in unmodified starter components/hooks. The scoped application lint, TypeScript check, timing/evidence tests, and production build are the validation checks for this update. Browser interaction testing has not been performed.

## Kuo expansion and table controls

The Kuo dossier adds 216 claims from 50 source pages across 72 families and 10 hardware categories (2015–2025 reports; outcomes reviewed September 7, 2026). See `docs/kuo-research.md` for scope, counts, limitations, revisions and attribution rules. Three original Medium posts are distinguished from public attributions. The raw ledger is `public/data/kuo-forecasts.json`; `GET /api/kuo` exports all evaluated records and evidence.

Forecast and Apple-launch tables offer 10, 25, 50, 100 or All rows. All applies to the current filtered results. Changing the row count returns to the first page; filtering clamps pagination to prevent an empty stale page. Probability lower bounds in Kuo’s WWDC calls are displayed without converting them into exact probabilities.

## Research dashboard

`/research` tracks the companion `hindsight_research` project; `/research/vox` shows its Vox Future Perfect probability-recovery pilot, leakage diagnostics, and item details. `/research/ontology` explains how prior grading relates to this site's categorical claim grading. This is a private research dashboard, not a person-level leaderboard. Existing claim verdicts remain governed by rubric 0.1.

To refresh, run `python3 pipeline/export_site.py` in the sibling `hindsight_research` repo, then run `node scripts/sync-hindsight.mjs` from this `site/` directory. The sync reads `../../hindsight_research/exports/site/hindsight-*.json` and copies the exports into `public/data/hindsight/`. Data is statically imported; rebuild or restart the site after refreshing it. Validate exports with `node --experimental-strip-types --test tests/hindsight.test.mjs`.
