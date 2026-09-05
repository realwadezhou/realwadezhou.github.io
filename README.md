# Forecast Index

A small research website for inspectable technology forecasts. Built with React, Vinext, and Sites.

## Development

Run `npm install`, then `npm run dev`. Validate the application with `npx oxlint app lib components/grading-rubric.tsx`, `npx tsc --noEmit`, `node --experimental-strip-types --test tests/rubric.test.mjs`, and `npm run build`.

The data in `lib/claims.ts` and `lib/product-claims.ts` is manually curated. It is a selective retrospective pilot, not a complete corpus or a ranking. Sources, missing evidence, and provisional assessments are displayed in each case panel. There is no automatic X or Grok connection.

Views cover product releases, model releases, people, and the complete grading rubric. The capabilities/adoption category has an explicit empty state for future work. The site is owner-private by default.

`lib/rubric.ts` defines every allowed grade, timing label, resolution clarity, evidence level, and review state. The UI renders the same definitions used by the data types. Date rules distinguish deadlines from bounded windows and use calendar-day arithmetic. Tests cover boundary dates, early/late/overdue outcomes, invalid input, source references, and the distinction between a specification forecast and a timing forecast.

Each checked claim records its retrospective resolution rule, source-linked findings, actual milestone dates, rubric version, and review history. The four Gurman cases use public attributed reports and authoritative Apple outcomes. They are provisional; no independent second human review or pre-event archived snapshot has been recorded. The Curran case remains an unassessed lead, with X collection deferred.

Validation note: `npm run lint` includes the generated component catalog, which has 19 known lint errors in unmodified starter components/hooks. The scoped application lint, TypeScript check, timing/evidence tests, and production build are the validation checks for this update. Browser interaction testing has not been performed.
