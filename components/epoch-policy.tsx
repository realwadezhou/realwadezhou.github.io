export function EpochPolicy() {
  return (
    <div className="epoch-policy">
      <strong>Hardware evidence · Epoch AI</strong>
      <p>
        We use{' '}
        <a
          href="https://epoch.ai/data/ai-data-centers"
          target="_blank"
          rel="noreferrer"
        >
          Epoch AI
        </a>{' '}
        as the canonical source for GPU quantities and compute capacity. Its
        estimates can resolve a claim; an audited inventory is not required.
        Each comparison states the metric, observation date and interpretation.
      </p>
      <details>
        <summary>Units, coverage and resolution rules</summary>
        <p>
          H100-equivalents measure compute capacity, not physical chip counts.
          Epoch currently normalizes dense 8-bit throughput, with 16-bit
          fallback for chips without 8-bit support. Training FLOP also depends
          on utilization and duration. Chip deliveries, deployed stock and
          compute rented by a lab are separate measures.
        </p>
        <p>
          Use dated operational capacity, not projected expansion. Distinguish
          chip power, IT power and total facility power. Epoch’s site list
          covers part of the world; its sum is not a global total. Missing
          estimates are not zero. Approximate milestones can be graded once the
          explicit interpretation is satisfied, even before their window closes.
        </p>
        <p>
          For Situational Awareness’s buildout table, one operational AI site is
          our declared proxy for a training cluster. The stricter claim that all
          capacity is interconnected for a single training job remains
          unassessed. The GPU, power and cost rows describe the same buildout
          and are correlated.
        </p>
        <a
          href="/evidence/epoch-2026-09-05.json"
          target="_blank"
          rel="noreferrer"
        >
          Evidence snapshot · 5 September 2026
        </a>
      </details>
    </div>
  );
}
