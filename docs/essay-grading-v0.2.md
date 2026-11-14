# Essay grading rubric 0.2 (draft)

2026-11-15. Replaces the essay part of rubric 0.1 (`lib/rubric.ts`) for
long-run essays (Situational Awareness, AI 2027, AI 2040). Flat-call
dossiers (Gurman, Kuo) keep rubric 0.1.

## Why change

Rubric 0.1 was built for flat calls like "the iPhone ships with X in
September". For essays it failed in three ways:

1. **It graded our paraphrase, not the author's claim.** Each row got a
   narrow operational test written by us. For example, SA-007 asked for
   "evidence about sample efficiency or new learning signals". The grader
   then looked for that test, not for what Aschenbrenner argued: the data
   wall won't stop progress because labs will find new ways to learn. That
   happened (RL-trained reasoning models from late 2024), but the test made
   it look Pending.
2. **It searched for resolution terms.** Keyword searches surface whatever
   articles happen to use the words, often weak ones. Absence of a matching
   article became "Pending" or "Not assessed".
3. **It was all-or-nothing.** "Supported only if every material condition
   matches" means a right thesis reached by a different mechanism, or a
   right direction with a slightly wrong number, scores the same as a miss.

## The procedure

Each claim is graded in three steps, in this order. Steps 1 and 2 are written
before any outcome evidence is consulted, and are kept.

### 1. Reading: what was claimed

- **Passage:** the original text the claim comes from (quote or locate it).
- **Thesis:** one sentence: what a careful reader at publication would have
  taken the author to be claiming. Use the author's words and argument, not
  a later reinterpretation.
- **Details:** the specific mechanisms, numbers and dates attached to the
  thesis, listed separately.
- **Weight:** how central the claim is to the essay's argument.
  - *Core:* the essay's argument depends on it.
  - *Supporting:* it backs up a core claim.
  - *Minor:* colour or a side remark.

### 2. Indicators: how we'd know

From the author's vantage point at publication: 2–5 observable things that
should be true by the deadline if the thesis is right, and 1–3 that would
show it wrong. These are the test. They're about the substance, not the
wording, so a thesis achieved by a different route still counts.

### 3. Verdict: what happened

Evidence comes from **evidence briefs**: short, dated summaries of the
state of the world in a domain (e.g. "AI capabilities and training methods,
as of 2026-11"), built from primary and canonical sources (lab system
cards and papers, Epoch AI, METR, official statistics), cited by many
claims, and refreshed on a schedule. Press coverage is secondary. A single
article never decides a grade by itself.

| Field | Values | Notes |
|---|---|---|
| Thesis verdict | Yes · Mostly · Partly · No · Too early · Unresolvable | The headline grade |
| Detail verdict | Yes · Mostly · Partly · No · Too early · n/a | Mechanisms, numbers, dates |
| Timing | Early · On time · Late · Open · n/a | Relative to the author's horizon |
| Trajectory | Ahead · On track · Behind · Unclear | Only for *Too early* |
| Credence | 0–1 | Grader's probability the thesis has come true (or will, for Too early, by the deadline) |
| Strict reading | same scale as the thesis verdict | Only if a strict, literal reading changes the verdict |
| Evidence | dated items with sources | Each with what it shows |

Definitions:
- **Yes:** the thesis came true in substance by the deadline.
- **Mostly:** it came true with a minor shortfall in scope or size.
- **Partly:** real but substantially smaller, narrower or slower than claimed.
- **No:** the deadline passed and the thesis clearly failed, or reliable
  evidence shows it won't happen in the window.
- **Too early:** the window is open. Give the trajectory, instead of a
  silent "Pending".
- **Unresolvable:** no defensible test remains even after step 2.

Rules:
- **Resolve on substance.** If the outcome is reached by a different
  mechanism, the thesis can be Yes while the detail verdict is lower.
- **Absence of evidence is not No,** unless the indicator is something that
  would certainly be public. Then it is evidence.
- **Conditional claims** are graded only if the condition held. Otherwise
  record "Condition not met", which carries no accuracy implication.
- **Report the charitable and strict readings** when they differ, and never
  pick the friendlier one silently.
- **Policy proposals and already-observable statements** stay out of
  accuracy, as in 0.1.

## Summaries

- Count thesis verdicts by weight (Core, Supporting, Minor). Core claims
  lead any summary.
- For a single number, use the mean credence over resolved Core and
  Supporting claims. Always show the counts as well.

## Process and review

- A model (pilot: GPT-6.1 Terra) drafts steps 1–3 for every claim, with
  the essay text and the evidence briefs in its input. Its knowledge horizon
  is recorded, and anything after it is marked Too early or Unresolvable,
  not guessed.
- Wade adjudicates Core claims and any claim where the model's charitable
  and strict readings differ. Disagreements are recorded as Disputed, and
  excluded from summaries until resolved.
- Rubric version, prompt and model are recorded with every grade.
