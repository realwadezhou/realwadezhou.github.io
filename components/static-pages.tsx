import Link from 'next/link';

/** How the quantifying-vibes charts and leaderboard are scored. */
export function VibesScoring() {
  return (
    <section className="scoring-page">
      <p>
        Most commentary never states a probability, but it still leans. These
        pages turn that lean into a number, plot it over time, and score it
        against what happened and against markets.
      </p>
      <h2>1. Questions come first</h2>
      <p>
        Each question is fixed before collection: wording, resolution rule and
        deadline or thresholds. We then collect articles that discuss it,
        published before it resolved, without regard to whether they turned out
        right. Pieces that take no stance are kept, so the denominator is
        honest.
      </p>
      <h2>2. A sealed reader</h2>
      <p>
        A model reads each article and records its stance and a probability band
        from a fixed phrase table (for example, “almost certain” is 90–99%). The
        reader has no web search, browsing or other tools, and is told not to
        look anything up, so it cannot see the outcome. Articles with no stance
        are not plotted.
      </p>
      <h2>3. Consensus and reference lines</h2>
      <ul>
        <li>
          The blue line is a Gaussian-weighted average of the readings over
          time: the conventional wisdom.
        </li>
        <li>
          Market and forecasting-platform lines (Polymarket, Kalshi, PredictIt,
          Manifold, Metaculus) are labelled direct, qualified or context-only,
          depending on how closely their rules match ours.
        </li>
      </ul>
      <h2>4. Scores</h2>
      <ul>
        <li>
          <strong>Brier score</strong> per article: (probability − outcome)².
          Lower is better.
        </li>
        <li>
          <strong>Δ vs consensus</strong>: the article’s Brier score minus that
          of the consensus built only from earlier articles. Negative means it
          beat the room.
        </li>
        <li>
          <strong>Bits vs consensus</strong> (Bayes points): log₂ of the
          probability the article gave the outcome, divided by the probability
          the earlier consensus gave it. Confident calls against the crowd that
          turn out right earn the most.
        </li>
      </ul>
      <p>
        The <Link href="/research/calibration">leaderboard</Link> aggregates
        these by author and outlet.
      </p>
      <h2>Limits</h2>
      <ul>
        <li>
          Model readings are not yet validated against careful human labels.
        </li>
        <li>
          Newer question sets (2026 midterms, AI) are drafts. Some thresholds
          were chosen with the outcome known, and are marked as such.
        </li>
        <li>
          Resolutions weigh several sources rather than treating any one as the
          oracle; judgement calls are recorded with each question.
        </li>
      </ul>
    </section>
  );
}

/** Rubric 0.2 for essay claims. */
export function EssayScoring() {
  return (
    <section className="scoring-page">
      <p>
        Long-run essays make dozens of claims at once. We grade each claim, so
        an essay gets a scorecard rather than a single grade. Rubric 0.2 is a
        draft; it is applied to Situational Awareness so far, and AI 2027 and AI
        2040 still show rubric 0.1.
      </p>
      <h2>Two steps, kept apart</h2>
      <ol>
        <li>
          <strong>Reading (sealed).</strong> From the essay text alone, with no
          web access, a model records what the author claimed: the thesis, the
          horizon, any condition, and indicators an outside observer could
          check. It adds no requirements the author did not state.
        </li>
        <li>
          <strong>Verdict (with search).</strong> A second call takes that
          reading as fixed, searches for what happened, and lists the sources it
          used.
        </li>
      </ol>
      <h2>Verdicts</h2>
      <ul>
        <li>
          <strong>Yes, Mostly, Partly, No</strong>: how far the thesis came true
          by its horizon.
        </li>
        <li>
          <strong>Too early</strong>: the window is still open, with a
          trajectory (ahead, on track, behind) and a credence.
        </li>
        <li>
          <strong>Condition not met</strong>: a conditional claim whose
          condition did not hold. <strong>Unresolvable</strong>: no defensible
          test.
        </li>
      </ul>
      <h2>Rules</h2>
      <ul>
        <li>
          Early success counts as Yes, recorded with the date it was met and
          marked early.
        </li>
        <li>
          Each claim is graded at the level of detail it was tracked at; the
          essay’s wider argument is not folded in.
        </li>
        <li>
          Quantities (for example, annual AI investment) are judged on all the
          evidence, combining estimates, not on any single data series. Related
          claims use one consistent definition.
        </li>
      </ul>
    </section>
  );
}

/** About the project. */
export function About() {
  return (
    <section className="scoring-page">
      <p>
        Hindsight Research is a scorekeeper for public forecasting, built by
        Wade Zhou and an army of LLMs. It collects what people said about the
        future and checks it against what happened, from explicit calls to vague
        commentary to long essays.
      </p>
      <h2>Three kinds of forecast</h2>
      <ul>
        <li>
          <Link href="/research/mushy">
            <strong>Quantifying vibes</strong>
          </Link>
          : what informed opinion believed about a question over time, and how
          it compared with the markets.
        </li>
        <li>
          <Link href="/?view=products">
            <strong>Explicit forecasts</strong>
          </Link>
          : dated calls, graded one by one, building a track record per person.
        </li>
        <li>
          <Link href="/essays">
            <strong>Essay evaluations</strong>
          </Link>
          : long-run essays broken into claims and graded on the evidence so
          far.
        </li>
      </ul>
      <h2>Principles</h2>
      <ul>
        <li>Questions are chosen before articles, to avoid cherry-picking.</li>
        <li>Readers cannot see outcomes; graders cite their evidence.</li>
        <li>
          Resolutions weigh several sources; judgement calls are written down.
        </li>
        <li>
          Markets are the baseline: pundits are compared with what a crowd with
          money at stake believed at the same time.
        </li>
      </ul>
      <p className="fine-print">
        Version 0.2, November 2026. Pilot research: numbers and grades are
        revisable.
      </p>
    </section>
  );
}

/** Public research status: findings so far, current work, limits. */
export function ResearchOverview({
  questions,
  readings,
  references,
}: {
  questions: number;
  readings: number;
  references: number;
}) {
  return (
    <section className="scoring-page">
      <p>
        Hindsight Research is in early testing. This page summarises what we
        have so far, what we are working on, and what is not yet reliable.
      </p>
      <div className="verdict-counts hindsight-tiles">
        <div>
          <strong>{questions}</strong>
          <span>Forecast questions</span>
        </div>
        <div>
          <strong>{readings.toLocaleString('en-GB')}</strong>
          <span>Article readings with a stance</span>
        </div>
        <div>
          <strong>{references}</strong>
          <span>Market and Metaculus lines</span>
        </div>
        <div>
          <strong>3</strong>
          <span>AI essays graded</span>
        </div>
      </div>
      <h2>Early findings</h2>
      <ul>
        <li>
          <Link href="/research/mushy?q=mt26_senate">2026 Senate</Link>:
          commentary leaned against Democratic control until the end, while
          prediction markets moved towards it.
        </li>
        <li>
          <Link href="/research/mushy?q=ai_imo">AI milestones</Link>: commentary
          was broadly right about headline capability milestones such as
          olympiad-level maths and programming, and too optimistic about
          extrapolated thresholds such as benchmark scores and user numbers.
        </li>
        <li>
          <Link href="/research/vox">Calibration</Link>: on Vox’s annual
          predictions, where authors state a probability, we test whether a
          model can recover that number from the prose alone.
        </li>
      </ul>
      <h2>What we are working on</h2>
      <ul>
        <li>
          Checking model readings against careful human labels, and running more
          reader models, including ones trained before the events.
        </li>
        <li>
          Freezing the newer question sets (2026 midterms, AI) and writing down
          a general rule for when a question counts as resolved.
        </li>
        <li>
          Scoring confidence as well as accuracy: separating reliable
          forecasters from those who were right about one big thing.
        </li>
        <li>Applying essay rubric 0.2 to AI 2027 and AI 2040.</li>
      </ul>
      <h2>Not yet reliable</h2>
      <ul>
        <li>Individual readings and leaderboard ranks: samples are small.</li>
        <li>
          Questions marked draft, and thresholds chosen with the outcome known.
        </li>
        <li>
          Essay grades, which are produced by a model and still being tuned.
        </li>
      </ul>
    </section>
  );
}
