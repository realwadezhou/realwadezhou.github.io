'use client';

import Link from '@/components/page-link';
import { ChevronRight } from 'lucide-react';
import { mushyData } from '@/lib/mushy';
import { QuestionChart } from './mushy-questions';

/** The home page's 3x3 grid, one row per theme. Chosen by Wade for readable charts. */
const ROWS: { label: string; qids: string[] }[] = [
  {
    label: '2026 US midterms',
    qids: ['mt26_senate', 'mt26_house', 'mt26_stx'],
  },
  { label: 'Geopolitics and health', qids: ['ukr_q1', 'kab21_q1', 'h5n1_q1'] },
  { label: 'AI', qids: ['ai_ioi', 'ai_rev10b', 'ai_gpt5'] },
];

export function HomeOverview() {
  const reader = mushyData.readers[0];
  const byId = new Map(mushyData.questions.map((q) => [q.qid, q]));
  return (
    <section className="home" aria-label="Hindsight Research overview">
      <div className="home-intro">
        <p>We read three kinds of forecast:</p>
        <ul>
          <li>
            <strong>Quantifying vibes.</strong> Most commentary does not give numerical probabilities, but still contains information. 
            For these questions, we use LLMs to estimate the authors' implicit forecasts and convert them into probabilities. This allows us to create
            indices of "conventional wisdom". Whenever possible, we match these indices to data from prediction markets or Metaculus.
          </li>
          <li>
            <strong>Explicit forecasts.</strong> We evaluate cases where authors provide explicit forecasts. Currently, we have only evaluated predictions
            from some Apple analysts, who predict when the company will release a given product. These are not especially important questions, but they are easy to grade
            and useful for tuning our harness.
          </li>
          <li>
            <strong>Essay evaluations.</strong> This evaluates the forecasting accuracy of longer essays such as "AI 2027" or 
            "Situational Awareness". More calibration work is needed.
          </li>
        </ul>
        <p>
          Eventually, we hope to integrate all three kinds of forecast into a single dataset. For now, the most promising work
          has come from our efforts to quantify vibes.

          Below are nine forecasting questions showing how this approach works across a variety of policy-relevant topics.
        </p>
      </div>
      {ROWS.map((row) => (
        <div className="home-row" key={row.label}>
          <h2 className="home-row-label">{row.label}</h2>
          <div className="home-grid">
            {row.qids.map((qid) => {
              const q = byId.get(qid);
              if (!q) return null;
              const n = q.points.filter(
                (p) => p.reader === reader && p.p != null,
              ).length;
              return (
                <article className="home-card" key={qid}>
                  <h3>{q.text}</h3>
                  <QuestionChart q={q} reader={reader} compact />
                  <div className="home-card-foot">
                    <span>
                      {n} article{n === 1 ? '' : 's'} · resolved{' '}
                      {q.outcome ? 'yes' : 'no'}
                      {q.draft ? ' · draft' : ''}
                    </span>
                    <Link
                      className="text-link"
                      href={`/research/mushy?q=${qid}`}
                    >
                      Read more
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
      <Link className="home-all-link" href="/research/mushy">
        See all {mushyData.questions.length} questions, with markets and every
        article
        <ChevronRight size={16} />
      </Link>
    </section>
  );
}
