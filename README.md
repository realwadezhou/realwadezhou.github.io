# Forecast Index

A small research website for inspectable technology forecasts. Built with React, Vinext, and Sites.

## Development

Run `npm install`, then `npm run dev`. Validate with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

The data in `lib/claims.ts` and `lib/product-claims.ts` is manually curated. It is a selective retrospective pilot, not a complete corpus or a ranking. Sources, missing evidence, and provisional assessments are displayed in each case panel. There is no automatic X or Grok connection.

Views cover product releases, model releases, people, and methodology. The capabilities/adoption category has an explicit empty state for future work. The site is owner-private by default.

Validation note: the generated component catalog currently emits 19 lint errors in unmodified starter components/hooks. The application and data pass `npx oxlint app lib`; the complete project passes TypeScript checking and the deployment build. Browser interaction testing has not been performed.
