# Essay rubric 0.2 — pilot on Situational Awareness

2026-11-15. Rubric: `docs/essay-grading-v0.2.md`. Reader: GPT-6.1 Terra
(Codex, medium effort). Prompt and runner: `hindsight_research/prompts/essays/grade_v1.md`,
`pipeline/essay_grade.py`. Input: each chapter's full text, the claim, the
Epoch snapshot (2026-09-05) and the tracker's linked sources. Output with
short quotes: `hindsight_research/data/text/runs/essays/` (local only).
All 62 claims graded, none failed to parse. Terra reported a knowledge
horizon of 2026-11 for 60 claims and 2026-09 for 2.

**Status: draft grades, not adopted.** The site still shows rubric 0.1.

## What changed

| Rubric 0.1 | → 0.2 thesis verdict | Claims |
|---|---|---:|
| Pending | Too early (with trajectory and credence) | 30 |
| Pending | Condition not met | 14 |
| Pending | Yes / Mostly / Partly | 2 / 2 / 2 |
| Supported | Yes | 5 |
| Supported | Mostly | 3 |
| Unresolvable | Too early | 2 |
| Not assessed | Yes / Unresolvable | 1 / 1 |

By weight, Core claims: 17 Too early, 6 Condition not met, 2 Yes,
1 Mostly, 1 Unresolvable.

What 0.2 adds over "Pending":
- **For open claims:** a trajectory (Ahead / On track / Behind / Unclear)
  and a credence. For example:
  - SA-039 ($2T annual investment) is *ahead*;
  - SA-032 (10 GW clusters) and SA-035 (100 GW) are *behind*;
  - SA-031 (10M-GPU clusters) is *on track*.
- **New positive grades:**
  - SA-037: annual AI investment of about $500B. IDC put Q2 2026 AI
    infrastructure spending at $121.4B, and forecasts $521B for 2026.
  - SA-017: AI outperforms many college graduates. Graded Mostly, with the
    strict reading Partly, on the strength of GDPval-type evidence.
  - SA-043: power becomes a tighter constraint than chips. Graded Mostly.
- **Supported claims that are now nuanced:** the cluster claims SA-028–030
  move from Supported to *Mostly*. The strict reading is Unresolvable,
  because site capacity isn't the same as one training cluster.

Spot-checks of Terra's cited evidence (2 of 2 correct, with minor
mislabelling):
- [IDC Q2 2026 AI infrastructure, $121.4B](https://www.idc.com/?p=122953)
  is real. It's total AI infrastructure, which Terra called "servers and
  storage".
- [GPT-5.4's 83.0% on GDPval](https://openai.com/index/introducing-gpt-5-4/)
  is real. It counts wins plus ties.

## SA-007 (the data wall)

Terra's grade: **Core · Too early · On track · credence 0.70**.
- **Evidence:** o1's RL training (Sept 2024), DeepSeek R1 (Jan 2025), and
  synthetic-data pretraining studies from 2025–26.
- **Why not Yes:** it reads the thesis as "progress doesn't plateau through
  2027". A sustained state can't be fully confirmed before the deadline.

That's defensible, but it isn't the reading Wade gives ("resolves Yes
because of the shift to RL"). It's a rubric question, not a model error.
See decision 1.

## Problems the pilot found

1. **Claims that come true before the deadline.** The rubric doesn't say
   when an early success counts. Terra waits whenever the claim describes a
   state that has to hold until the deadline.
2. **"Condition not met" credences are inconsistent.** For SA-026 (credence
   0.01), Terra gave the chance the condition has already happened. For
   SA-053 (0.85), it gave the chance the thesis holds if the condition
   happens. Credence needs one definition for conditional claims.
3. **"Condition not met" is also used when the condition's own window is
   still open,** for example "if AGI by 2027". That should be "Condition
   pending", so it isn't read as a failure.
4. **Charitable and strict readings diverge sharply on a few claims.**
   These are exactly the ones for adjudication:
   - SA-044, SA-045, SA-048: Yes, but No on a strict reading. For SA-045,
     OpenAI's $10B run rate came by June 2025, later than the strict
     "doubling" path.
   - SA-028–030: Mostly, but Unresolvable on a strict reading.
   - SA-037: Yes, but Too early on a strict reading.
   - SA-017: Mostly, but Partly on a strict reading.
5. **The evidence is model memory.** Both spot-checks held, but the rubric's
   evidence briefs don't exist yet, and every cited item needs a working
   link before grades are adopted.

## Decisions for Wade

1. **Early success.** The proposal: if the indicators are met before the
   deadline, grade **Yes (early)**. Keep *Too early · On track* only when
   the thesis explicitly needs the state to persist to the deadline, e.g.
   "remains ahead through 2027". Under this, SA-007 becomes Yes (early).
2. **Credence for conditional claims:** P(thesis | condition), with the
   condition's status recorded separately: met, not met, or pending.
3. **Adjudicate the strict/charitable splits listed above,** about 9 claims.
4. **Evidence briefs before adopting grades.** One brief per domain
   (capabilities and training methods; compute and investment; revenue;
   security and policy), built from primary sources with links. Then
   re-run the graders on the briefs, and check every Core claim's evidence.

After those decisions: prompt `grade_v2`, re-run on all three essays, show
0.2 alongside 0.1 on the essay pages.
