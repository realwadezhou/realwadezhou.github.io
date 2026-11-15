import Link from 'next/link';
import { hindsightChecklist, hindsightModels, voxPilot } from '@/lib/hindsight';

function ChecklistText({ text }: { text: string }) {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        part
      ),
    );
}

export function ResearchStatus() {
  const sections = [
    ...new Set(hindsightChecklist.items.map((item) => item.section)),
  ];
  const resolved = voxPilot.items.filter(
    (item) => item.outcome !== null,
  ).length;
  const humans = voxPilot.items.filter((item) => item.human?.p != null).length;
  return (
    <section aria-label="Companion research status">
      <div className="research-summary">
        <p>
          <strong>hindsight_research</strong> studies prior grading: recovering
          what an author believed from prose without letting known outcomes leak
          into the reading. This private dashboard tracks the work and its first
          pilot, Vox Future Perfect’s 2019–2026 prediction lists.
        </p>
        <div className="research-actions">
          <Link className="text-link" href="/research/vox">
            Vox pilot →
          </Link>
          <Link className="text-link" href="/research/mushy">
            Pundits vs markets →
          </Link>
          <Link className="text-link" href="/research/ontology">
            How we grade →
          </Link>
        </div>
      </div>
      <div className="verdict-counts hindsight-tiles">
        <div>
          <strong>{voxPilot.items.length}</strong>
          <span>Vox items · {resolved} resolved</span>
        </div>
        <div>
          <strong>{humans}</strong>
          <span>Human labels</span>
        </div>
        <div>
          <strong>{hindsightModels.length}</strong>
          <span>Models run</span>
        </div>
        <div>
          <strong>
            <time>{voxPilot.generated}</time>
          </strong>
          <span>Pilot export date</span>
        </div>
      </div>
      <p className="fine-print">
        Checklist export: <time>{hindsightChecklist.generated}</time>
      </p>
      {sections.map((section) => {
        const items = hindsightChecklist.items.filter(
          (item) => item.section === section,
        );
        return (
          <section
            className="research-findings"
            key={section}
            aria-label={section}
          >
            <h2>
              {section}{' '}
              <span className="fine-print">
                {items.filter((item) => item.done).length}/{items.length} done
              </span>
            </h2>
            <ul className="hindsight-checklist">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={item.done ? 'hindsight-done' : undefined}
                >
                  <span aria-label={item.done ? 'Done' : 'Open'}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span>
                    <ChecklistText text={item.text} />{' '}
                    {!item.done && item.owner && (
                      <span className="status status-neutral hindsight-badge">
                        {item.owner}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
