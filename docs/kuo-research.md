# Ming-Chi Kuo historical dossier

Reviewed September 7, 2026 under rubric 0.1. All assessments are provisional and have no independent human second review.

216 distinct dated claims from 50 source pages, spanning January 2015 through June 2025, with public product outcomes through the review date. There are 72 product/forecast families. Three original Medium posts were read directly; 47 source pages attribute client notes or public posts to Kuo. A dated public attribution is not proof that an entire client note was retrieved.

## Recorded outcomes

| Grade | Claims |
|---|---:|
| Supported | 141 |
| Contradicted | 32 |
| Mixed | 1 |
| Unresolvable | 19 |
| Not assessed | 19 |
| Pending | 4 |

These are counts of correlated statements, including possibilities and revisions. They are not independent trials, a complete population, a representative sample, a ranking against Gurman, or a career accuracy rate. The four pending records concern the first foldable iPhone. No future announcement or retail date is treated as observed.

## Scope and selection

Searches deliberately covered successful specifications, missed product/date expectations, conditional reports, and revisions across the principal hardware lines. Dense investor notes contribute multiple atomic product conditions; a new date or changed condition is retained as a separate row in the same family. Repeated identical claims without a useful revision were generally not added. The corpus is broad but selective; it does not claim every note, post, SKU, or major Apple launch is represented. Software/services and supplier financial forecasts receive much less coverage than hardware.

| Category | Claims |
|---|---:|
| Accessories | 14 |
| AirPods | 8 |
| Apple TV | 2 |
| Apple Watch | 16 |
| HomePod | 4 |
| Mac | 53 |
| Vision | 11 |
| iPad | 29 |
| iPhone | 78 |
| iPod | 1 |

## Evaluation rules applied

- Use the existing 156-record Apple launch catalog first. Reuse stable launch IDs and milestone source bindings; keep announcement, ordering and customer availability separate. Historical sources retain their original access dates.
- Use original Kuo wording when accessible. The original November 2023 iPad post uses mass-production dates, even where a public headline suggests launch dates. Those dates are unassessed because retail timing is not production evidence.
- Preserve speaker attribution. General article commentary, unnamed rumors, and other analysts’ predictions are not assigned to Kuo. Specific examples excluded include rainbow/white-bezel MacBook Air rumors and a 13-inch M3 MacBook Pro extrapolated by an article writer.
- Preserve uncertainty: may, could, if, likely, and rough size comparisons. The May 2017 WWDC calls record strict lower probability bounds (>70% for iPad, >50% for speaker); these are not exact point probabilities and receive no Brier score.
- Corrected forecast families retain earlier entries. Examples include mini-LED Air versus the later non-mini-LED revision, January 2023 solid-state buttons versus April physical buttons, and September 2023 no-M3-MacBooks versus October’s event call.
- A bounded quarter is distinct from a deadline. AirPods Pro 2 shipped in September 2022, earlier than the predicted fourth quarter. A later unrelated product cannot rescue a failed generation-specific feature.
- Internal production, component costs, unmeasured sensor configurations and SKU shipment estimates remain unassessed where the required evidence is absent. A product not shipping cannot disprove internal development.
- Non-launch conclusions combine dated product announcements with Apple’s model histories and, where available, explicit company statements. Supplementary sources cover AirPower cancellation, no 27-inch iMac replacement, reverse charging, radio support, buttons, adapters and lossless audio.
- Do not infer a precise millimetre or decimal-inch error when naming/rounding changes the verdict. The 6.6-inch thin iPhone call is unresolved because Apple’s advertised 6.5 inches measures 6.55 inches as a rectangle.

## Interpretation

The collected sample contains many supported hardware specifications, including Touch Bar, MagSafe’s return, USB-C iPhones and an A18 Pro budget MacBook. It also contains clear chip/camera errors (M1 in the 2022 Air, M3 in the OLED Pro, and a 24 MP iPhone 17 front camera), missed release windows and corrected calls. These observations support inspecting product detail, timing, wording and lead time separately; they do not establish the chance of a future prediction being right.

Overlap between Kuo and Gurman is not evidence that one supplied the other’s information. This project records documented attribution and makes no general sourcing-dependency claim.

## Files and maintenance

- `scripts/build-kuo-corpus.py` is the curated extraction ledger. Run it to regenerate `public/data/kuo-forecasts.json`.
- `public/data/kuo-outcome-sources.json` adds evidence not already in the shared launch catalog.
- `lib/kuo-claims.ts` joins claims, launches and supplementary sources for both the UI and `GET /api/kuo`.
- `GET /api/kuo` exports the complete evaluated corpus; the raw extraction ledger is also downloadable.

Append claims to preserve IDs. Keep revisions visible. If changing a published assessment, add a dated history entry and explain the evidence change. Keep each source’s actual read/retrieval state explicit. This collection does not contain independent pre-event archived snapshots.

Remaining research gaps: original client notes, more public posts from 2025–2026, component-level verification and model-level shipment outcomes, plus independent human review. Source-page dates follow their displayed timezone; URL-date differences and original Medium dates are explained in source notes.
