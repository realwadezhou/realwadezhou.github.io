# Essay evaluations — initial extraction, 5 September 2026

Three dedicated routes extend the existing retrospective tracker:

- `/essays/ai-2027`: AI 2027 (April 3, 2025), all five coauthors credited.
- `/essays/ai-2040-plan-a`: AI 2040: Plan A (July 9, 2026), all six coauthors credited.
- `/essays/situational-awareness`: Situational Awareness (June 2024), Leopold Aschenbrenner.

The corpus comprises 196 statements: 181 forecast or conditional-forecast rows, 14 policy proposals, and one already-observable statement. It is a broad initial decomposition, not an exhaustive census of every sentence or supplement parameter. After the Epoch follow-up, 13 predictions are provisionally supported, 147 remain pending, 16 need more evidence/interpretation, and five are unresolvable under the recovered wording. No claim has a defensible Contradicted verdict in this evidence pass. These counts are not independent trials, calibration statistics, or an overall essay score.

## Epoch follow-up — 5 September 2026

At the user's direction, Epoch AI is the canonical source for GPU quantities and compute capacity. Its estimates are sufficient evidence; audited inventories or invoices are not required. Current dense 8-bit H100-equivalent throughput, physical units, training FLOP, power and cost remain distinct. Operational site estimates must be distinguished from projected expansions, and partial site coverage must not be treated as global totals. Chip Owners tracks ownership/deliveries, not physical location or the compute rented by a lab.

Twenty-seven hardware-related claims now name Epoch, with observations or specific prospective resolution sources. SA-028/029/030 change from Pending to Supported under an explicit site-buildout reading: Epoch's June 15, 2026 Colossus 2 state is 1.112M H100-equivalents (440,000 physical GPUs), 946 MW IT / 1,276 MW facility power and $35.84B modeled capital cost. A site is our declared proxy for the rough cluster table; the stricter requirement that all capacity train one model together remains unassessed. The approximate power tolerance is recorded retrospectively. These three rows describe correlated aspects of one buildout.

A27-012 also changes to Supported using METR's June 2025 documentation of evaluator tampering. A27-008 changes from Not assessed to Pending: the initial extraction imposed a 2025 commissioning deadline absent from the original conditional passage. Previous wording, criteria, grades, timing, source additions and reasons are retained in each changed claim's review history.

A27-007 now reports Epoch's largest 2025 model point estimate (Grok 4, 5×10²⁶ FLOP), half the 10²⁷ target. Its final grade stays Not assessed because unestimated frontier models and a recorded uncertainty bound crossing the threshold prevent a firm miss. A27-018 identifies incomplete 2026 ownership data and the geographic/deployment denominator gap. Global and US power rows show covered-site subtotals, not invented complete totals.

The dated [evidence snapshot](../public/evidence/epoch-2026-09-05.json) contains selected CC BY Epoch records, source URLs and hashes of the six input CSVs. [The snapshot script](../scripts/snapshot-epoch.py) reproduces the extraction from downloaded CSVs or fresh upstream files; it refuses to overwrite an existing review snapshot. New upstream revisions require an explicit new review, not silently changing old grades.

## Source and interpretation policy

All claim titles are paraphrases. Sources are linked, publication/access dates are visible, and the detail panel identifies the relevant chapter or PDF pages. Only reviewed original passages or outcome material support assessments. The 90-page AI 2040 PDF supplies material not exposed by the opening HTML page. The live sources were consulted in September 2026; no pre-event archival snapshot is represented as available. AI 2027's November and December 2025 annotations are disclosed.

Operational tests are tracker interpretations written on September 5, 2026, not registered author resolution rules. Qualitative dates and approximate numbers stay explicitly ambiguous. Internal `deadline` fields are review boundaries for the displayed interpretation, not additional author precision or grace periods. The legacy product cases keep their existing September 4 as-of date.

Policies and observations known before publication are excluded from accuracy counts even if their occurrence can be verified. No verbal confidence is converted into a numerical probability. Alternative endings remain conditional and related claims share a family. The review is provisional and has no independent human adjudication.

## Decisions that matter

- OpenBrain/DeepCent are composite fictional roles, not automatic aliases for OpenAI/DeepSeek.
- AI 2027's Agent-4 milestone table says August while its narrative says September. A27-052 preserves this inconsistency.
- OpenAI's February 2025 deep-research release predates AI 2027. A27-004 is context, not credited foresight.
- Agent launch announcements establish functions and reported evaluations, not measured end-to-end job replacement or lab research multipliers.
- METR's early-2025 19% developer slowdown is accompanied by its February 2026 update and is not used as the current productivity estimate or to refute a different total-lab claim.
- Biological safeguards are precautionary evidence, not proof of the stronger capability forecast.
- Compute stock value, annual spending, training FLOP, power capacity and annual electricity generation remain distinct metrics.
- Plan A adoption and its treaty rules are proposals. A40-057 is also a proposal: PDF footnote 82 explicitly calls the non-American $1M income floor unrealistically high as a prediction.
- Plan A depicts voluntarily relinquishing universal human shutdown control in 2040, rather than permanently retaining direct control.
- Microsoft's $13B annualized AI revenue supports only the Microsoft reading of the broader $10B scale claim. It neither resolves OpenAI's separate doubling extrapolation nor the $100B milestone.
- Passed windows without sufficient evidence are Not assessed, never automatically Pending or Contradicted. The suspected AGI-secret leak deadline in SA-049 is a prominent example.

## Validation

Data integrity checks require unique IDs, valid source references, valid rubric labels, preserved conditions, actual evidence for resolved predictions, and exclusion of policy/context rows from totals. They also reject Pending rows with passed explicit review boundaries. Existing timing/rubric tests remain in place.

Full-project lint has pre-existing findings in vendored UI components, the mobile hook and the legacy rubric test harness. Lint for the changed application/data files and the new tests passes. No browser interaction testing was requested; route rendering is checked through HTTP, with a production build before hosting.
