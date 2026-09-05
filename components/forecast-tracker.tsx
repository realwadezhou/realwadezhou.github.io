'use client';
import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Cpu,
  FileText,
  Layers,
  Radio,
  Smartphone,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { claims, people, type Claim } from '@/lib/claims';
import { verdicts, evaluateTiming, AS_OF, RUBRIC_VERSION } from '@/lib/rubric';
import {
  EssayEvaluation,
  EssayCollection,
} from '@/components/essay-evaluation';
import { essays, type EssaySlug } from '@/lib/essays';
import { AppleLaunchTable } from '@/components/apple-launch-table';
import { GurmanOverview } from '@/components/gurman-overview';
import { GradingRubric } from '@/components/grading-rubric';

type View =
  | EssaySlug
  | 'all'
  | 'models'
  | 'products'
  | 'capabilities'
  | 'people'
  | 'method'
  | 'andrew-curran'
  | 'mark-gurman'
  | 'apple-launches';
const titles: Record<View, string> = {
  'ai-2027': 'AI 2027',
  'ai-2040-plan-a': 'AI 2040: Plan A',
  'situational-awareness': 'Situational Awareness',
  all: 'Forecast index',
  models: 'Model releases',
  products: 'Product releases',
  capabilities: 'Capabilities & adoption',
  people: 'People',
  method: 'Grading rubric',
  'andrew-curran': 'Andrew Curran',
  'mark-gurman': 'Mark Gurman',
  'apple-launches': 'Apple launch dates',
};
const descriptions: Record<View, string> = {
  'ai-2027': 'A scenario of AI research automation and two possible endings.',
  'ai-2040-plan-a':
    'A proposed path to a slower, internationally governed transition.',
  'situational-awareness':
    'The case for AGI, an intelligence explosion, and a national mobilization.',
  all: 'Dated predictions about technology. Original claims, release milestones, and the evidence to evaluate them.',
  models:
    'Who anticipates the next model? Track names, announcement dates, limited access, and general availability separately.',
  products:
    'Concrete claims about hardware, features, and launch windows. Our first cases follow Apple reporting.',
  capabilities:
    'Predictions about what technology can do, and when people will use it.',
  people:
    'A starting set of sources to investigate. These case studies do not yet establish anyone’s forecasting accuracy.',
  method:
    'Make each claim inspectable. Preserve uncertainty in the evidence and in the interpretation.',
  'andrew-curran': 'AI reporting and commentary · @AndrewCurran_',
  'mark-gurman': 'Technology reporting · 2015–2026 historical dossier',
  'apple-launches':
    'A reusable reference for announcement dates, orders, and availability—linked to forecast evaluations.',
};
function Status({ value }: { value: Claim['status'] }) {
  return (
    <span
      className={`status status-${verdicts.find((grade) => grade.label === value)?.tone ?? 'neutral'}`}
    >
      <span aria-hidden="true" />
      {value}
    </span>
  );
}
function Navigation({
  view,
  change,
}: {
  view: View;
  change: (view: View) => void;
}) {
  const { setOpenMobile } = useSidebar();
  const go = (next: View) => {
    if (essays.some((essay) => essay.slug === view)) {
      window.location.assign(`/?view=${next}`);
      return;
    }
    change(next);
    setOpenMobile(false);
  };
  const nav = (key: View, Icon: typeof Layers) => (
    <SidebarMenuItem key={key}>
      <SidebarMenuButton
        className="nav-item"
        isActive={view === key}
        onClick={() => go(key)}
        aria-current={view === key ? 'page' : undefined}
      >
        <Icon />
        <span>{titles[key]}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
  return (
    <Sidebar className="site-sidebar">
      <SidebarHeader className="brand">
        <Radio size={21} strokeWidth={1.8} />
        <span>Forecast Index</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>EXPLORE</SidebarGroupLabel>
          <SidebarMenu>
            {nav('all', Layers)}
            {nav('people', Users)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>FORECAST TYPES</SidebarGroupLabel>
          <SidebarMenu>
            {nav('models', Cpu)}
            {nav('products', Smartphone)}
            {nav('capabilities', BookOpen)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>ESSAY EVALUATIONS</SidebarGroupLabel>
          <SidebarMenu>
            {essays.map((essay) => (
              <SidebarMenuItem key={essay.slug}>
                <SidebarMenuButton
                  className="nav-item"
                  isActive={view === essay.slug}
                  render={
                    <Link
                      href={`/essays/${essay.slug}`}
                      aria-label={essay.title}
                      aria-current={view === essay.slug ? 'page' : undefined}
                    />
                  }
                >
                  <BookOpen />
                  <span>{essay.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>PEOPLE</SidebarGroupLabel>
          <SidebarMenu>
            {nav('andrew-curran', FileText)}
            {nav('mark-gurman', FileText)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>THE PROJECT</SidebarGroupLabel>
          <SidebarMenu>
            {nav('apple-launches', Smartphone)}
            {nav('method', BookOpen)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="sidebar-note">
        <span className="pilot-label">Pilot research</span>
        <p>
          A growing corpus.
          <br />
          An auditable record.
        </p>
        <span>Started September 2026</span>
      </SidebarFooter>
    </Sidebar>
  );
}
function SourceRefs({ claim, ids }: { claim: Claim; ids: string[] }) {
  return (
    <span className="source-refs">
      {ids.map((id) => (
        <a
          key={id}
          href={`#${claim.id}-${id}`}
          aria-label={`${id}: ${claim.sources.find((source) => source.id === id)?.label ?? 'Source'}`}
        >
          [{id}]
        </a>
      ))}
    </span>
  );
}
function ClaimDetail({
  claim,
  openRubric,
  select,
}: {
  claim: Claim;
  openRubric: () => void;
  select: (claim: Claim) => void;
}) {
  return (
    <>
      <SheetHeader>
        <div className="eyebrow">
          {claim.id} ·{' '}
          {claim.type === 'models' ? 'MODEL RELEASE' : 'PRODUCT RELEASE'}
        </div>
        <SheetTitle className="detail-title">{claim.title}</SheetTitle>
        <SheetDescription>{claim.person} · Retrospective case</SheetDescription>
      </SheetHeader>
      <div className="detail-body">
        <div className="grade-line">
          <Status value={claim.status} />
          <span>{claim.reviewState}</span>
          <button className="text-link" onClick={openRubric}>
            Rubric {claim.rubricVersion}
          </button>
        </div>
        <p>{claim.summary}</p>
        <dl className="claim-facts">
          <div>
            <dt>Published</dt>
            <dd>
              {claim.published}
              <span className="cell-note">{claim.dateNote}</span>
            </dd>
          </div>
          <div>
            <dt>Forecast window</dt>
            <dd>{claim.target}</dd>
          </div>
          <div>
            <dt>Milestone</dt>
            <dd>{claim.milestone}</dd>
          </div>
          <div>
            <dt>Timing</dt>
            <dd>{claim.timing.label}</dd>
          </div>
          <div>
            <dt>Resolution</dt>
            <dd>{claim.clarity}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{claim.evidence}</dd>
          </div>
          <div>
            <dt>Probability</dt>
            <dd>Not recorded · no probability score</dd>
          </div>
          <div>
            <dt>Forecast family</dt>
            <dd>{claim.familyId}</dd>
          </div>
        </dl>
        <h3>Claim & context</h3>
        <p>{claim.context}</p>
        {claim.quote && (
          <>
            <blockquote>{claim.quote}</blockquote>
            <p className="fine-print">
              Short excerpt reproduced by the cited source.{' '}
              <SourceRefs
                claim={claim}
                ids={claim.quoteSourceId ? [claim.quoteSourceId] : []}
              />
            </p>
          </>
        )}
        <h3>Resolution rule · retrospective</h3>
        <p>{claim.criteria}</p>
        <p className="clarity-note">
          <strong>{claim.clarity}.</strong> {claim.clarityNote}
        </p>
        <h3>Timing assessment</h3>
        <p>{claim.timing.note}</p>
        {claim.timing.observations.length > 0 && (
          <ul className="observations">
            {claim.timing.observations.map((observation) => {
              const timing = claim.timing.rule
                ? evaluateTiming(claim.timing.rule, observation.date, AS_OF)
                : null;
              return (
                <li key={observation.label}>
                  <span>{observation.label}</span>
                  <strong>{observation.date}</strong>
                  {timing && (
                    <span className="timing-result">
                      {timing.label}
                      {timing.days !== null
                        ? ` · ${timing.days > 0 ? '+' : ''}${timing.days} days`
                        : ''}
                    </span>
                  )}
                  <SourceRefs claim={claim} ids={[observation.sourceId]} />
                </li>
              );
            })}
          </ul>
        )}
        <h3>Checks & evidence</h3>
        {claim.checks.map((check) => (
          <div className="evidence-check" key={check.condition}>
            <h4>{check.condition}</h4>
            <p>
              {check.finding} <SourceRefs claim={claim} ids={check.sourceIds} />
            </p>
          </div>
        ))}
        <h3>Assessment</h3>
        <p>{claim.assessment}</p>
        {claims.some(
          (other) => other.id !== claim.id && other.familyId === claim.familyId,
        ) && (
          <>
            <h3>Related claims & revisions</h3>
            <ul className="related-claims">
              {claims
                .filter(
                  (other) =>
                    other.id !== claim.id && other.familyId === claim.familyId,
                )
                .map((other) => (
                  <li key={other.id}>
                    <button className="text-link" onClick={() => select(other)}>
                      {other.published} · {other.title}
                    </button>
                    <span className="cell-note">
                      {other.id} · {other.status}
                    </span>
                  </li>
                ))}
            </ul>
          </>
        )}
        <h3>Sources</h3>
        <p className="fine-print">
          Forecast evidence: {claim.evidence}. {claim.sourceState}. No pre-event
          archived snapshot is recorded for this pilot case.
        </p>
        <ol className="sources">
          {claim.sources.map((source) => (
            <li id={`${claim.id}-${source.id}`} key={source.id}>
              <div className="source-meta">
                {source.id} · {source.role} · {source.access}
              </div>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <p>{source.note}</p>
              <div className="source-date">
                Published: {source.published} · Access checked:{' '}
                {source.accessed}
              </div>
            </li>
          ))}
        </ol>
        <h3>Review record</h3>
        <p>{claim.review}</p>
        <ol className="review-history">
          {claim.history.map((entry, i) => (
            <li key={`${entry.date}-${i}`}>
              <time>{entry.date}</time>
              <p>{entry.change}</p>
            </li>
          ))}
        </ol>
        <p className="fine-print">
          Related revisions share a forecast family and are not independent
          evidence of skill. This selective pilot does not support a
          person-level ranking.
        </p>
      </div>
    </>
  );
}
export default function ForecastTracker({
  initialView = 'all',
}: {
  initialView?: View;
}) {
  const [view, updateView] = useState<View>(initialView);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('newest');
  const setView = (next: View) => {
    updateView(next);
    setQuery('');
    setCategory('');
    setYear('');
    setGrade('');
    setKind('');
    setPage(0);
    window.history.replaceState(null, '', `/?view=${next}`);
  };
  const essay = essays.find((item) => item.slug === view);
  const [selected, setSelected] = useState<Claim | null>(null);
  const collection = claims.filter(
    (c) => view === 'all' || c.type === view || c.personId === view,
  );
  const filtered = collection
    .filter(
      (claim) =>
        (!category || claim.category === category) &&
        (!year || claim.published.startsWith(year)) &&
        (!grade || claim.status === grade) &&
        (!kind || (claim.kind || 'expectation') === kind) &&
        `${claim.title} ${claim.id} ${claim.summary} ${claim.familyId}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'newest'
        ? b.published.localeCompare(a.published)
        : a.published.localeCompare(b.published),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 25));
  const currentPage = Math.min(page, pageCount - 1);
  const person = people.find((p) => p.id === view);
  return (
    <SidebarProvider style={{ '--sidebar-width': '15rem' } as CSSProperties}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation view={view} change={setView} />
      <SidebarInset>
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="sidebar-toggle" />
            <span>Research</span>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{titles[view]}</span>
          </div>
          <span className="edition">5 September 2026</span>
        </header>
        <div id="main-content" className="page-content" tabIndex={-1}>
          <div className="page-heading">
            <div className="eyebrow">AI & TECHNOLOGY</div>
            <h1>{titles[view]}</h1>
            <p className="intro">{descriptions[view]}</p>
          </div>
          {essay ? (
            <EssayEvaluation essay={essay} />
          ) : view === 'apple-launches' ? (
            <AppleLaunchTable claims={claims} select={setSelected} />
          ) : view === 'method' ? (
            <GradingRubric />
          ) : view === 'people' ? (
            <div className="people-list">
              {people.map((p) => (
                <article key={p.id}>
                  <div className="person-monogram">{p.initials}</div>
                  <div>
                    <button
                      className="text-link person-name"
                      onClick={() => setView(p.id as View)}
                    >
                      {p.name}
                      <ChevronRight size={16} />
                    </button>
                    <p>{p.description}</p>
                    <span className="fine-print">
                      {claims.filter((c) => c.personId === p.id).length} case
                      {claims.filter((c) => c.personId === p.id).length === 1
                        ? ''
                        : 's'}{' '}
                      · No accuracy estimate
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <>
              {(view === 'all' || view === 'capabilities') && (
                <EssayCollection />
              )}
              {person && (
                <div className="person-context">
                  <p>{person.note}</p>
                  <a
                    className="external-link"
                    href={person.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source reference
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
              {view === 'mark-gurman' && (
                <GurmanOverview
                  claims={claims}
                  select={setSelected}
                  openLaunches={() => setView('apple-launches')}
                />
              )}
              {collection.length > 10 && (
                <div className="research-filters">
                  <label>
                    Search claims
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(0);
                      }}
                      placeholder="AirTags, M4, forecast family…"
                    />
                  </label>
                  <label>
                    Product
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All products</option>
                      {[
                        ...new Set(
                          collection
                            .map((claim) => claim.category)
                            .filter((item): item is string => !!item),
                        ),
                      ]
                        .sort()
                        .map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Report year
                    <select
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All years</option>
                      {[
                        ...new Set(
                          collection
                            .map((claim) => claim.published.slice(0, 4))
                            .filter((item) => /^\d{4}$/.test(item)),
                        ),
                      ]
                        .sort()
                        .reverse()
                        .map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Verdict
                    <select
                      value={grade}
                      onChange={(e) => {
                        setGrade(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All verdicts</option>
                      {verdicts.map((item) => (
                        <option key={item.label}>{item.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Statement type
                    <select
                      value={kind}
                      onChange={(e) => {
                        setKind(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All statements</option>
                      <option value="expectation">Expectations</option>
                      <option value="possibility">Possibilities</option>
                      <option value="development">Internal development</option>
                    </select>
                  </label>
                  <label>
                    Sort
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="newest">Newest report</option>
                      <option value="oldest">Oldest report</option>
                    </select>
                  </label>
                </div>
              )}
              <div className="collection-meta">
                <span>
                  {view === 'capabilities'
                    ? `${essays.length} essay evaluations`
                    : `${filtered.length} of ${collection.length} claims`}
                </span>
                <span>Retrospective pilot</span>
                <button
                  className="text-link rubric-jump"
                  onClick={() => setView('method')}
                >
                  Rubric {RUBRIC_VERSION}
                  <BookOpen size={13} />
                </button>
              </div>
              {filtered.length ? (
                <Table className="forecast-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forecast</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Target & timing</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Resolution</TableHead>
                      <TableHead>Sources</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered
                      .slice(currentPage * 25, (currentPage + 1) * 25)
                      .map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="row-type">
                              {c.type === 'models'
                                ? 'Model release'
                                : c.category || 'Product release'}{' '}
                              <span>· {c.id}</span>
                            </div>
                            <button
                              className="claim-link"
                              onClick={() => setSelected(c)}
                            >
                              {c.title}
                              <ChevronRight size={15} aria-hidden="true" />
                            </button>
                            <button
                              className="author-link"
                              onClick={() => setView(c.personId as View)}
                            >
                              {c.person}
                            </button>
                          </TableCell>
                          <TableCell>
                            {c.published}
                            <span className="cell-note">{c.dateNote}</span>
                          </TableCell>
                          <TableCell>
                            {c.target}
                            <span className="cell-note">{c.milestone}</span>
                            <span
                              className={`timing-label ${c.timing.label === 'Late' ? 'timing-late' : ''}`}
                            >
                              {c.timing.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Status value={c.status} />
                            <span className="cell-note">{c.statusNote}</span>
                          </TableCell>
                          <TableCell>
                            <span className="clarity-label">{c.clarity}</span>
                            <span className="cell-note">
                              {c.evidence} evidence
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="row-sources">
                              {(['Forecast', 'Outcome'] as const).map(
                                (role) => {
                                  const source = c.sources.find(
                                    (item) =>
                                      item.role === role &&
                                      item.access === 'Read',
                                  );
                                  return source ? (
                                    <a
                                      key={role}
                                      href={source.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label={`${role} source for ${c.title}`}
                                    >
                                      {role}
                                      <ArrowUpRight size={12} />
                                    </a>
                                  ) : (
                                    <span key={role}>{role}: missing</span>
                                  );
                                },
                              )}
                              <button
                                className="all-sources"
                                onClick={() => setSelected(c)}
                              >
                                All {c.sources.length} sources
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : view === 'capabilities' ? (
                <p className="essay-category-note">
                  Open an essay above to inspect its capability, compute,
                  adoption and governance predictions, with individual
                  resolution tests and grades.
                </p>
              ) : (
                <div className="empty-state">
                  <BookOpen size={25} strokeWidth={1.4} />
                  <h2>
                    {collection.length
                      ? 'No claims match these filters'
                      : 'No cases collected yet'}
                  </h2>
                  <p>
                    This category will cover measurable capability and adoption
                    forecasts. The first collection focuses on product and model
                    releases.
                  </p>
                </div>
              )}
              {filtered.length > 25 && (
                <div className="research-pagination">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span aria-live="polite">
                    Page {currentPage + 1} of {pageCount}
                  </span>
                  <button
                    disabled={currentPage + 1 === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
              <div className="reading-note">
                <BookOpen size={18} strokeWidth={1.5} />
                <div>
                  <h2>Read the evidence behind each call</h2>
                  <p>
                    Open a forecast to inspect its source, interpretation, and
                    review status. A source lead is kept visible until the
                    original claim can be verified.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setView('method')}
                  >
                    View the full rubric
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>Forecast Index</span>
            <span>Sources first. Conclusions revisable.</span>
          </footer>
        </div>
      </SidebarInset>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="claim-sheet" side="right">
          {selected && (
            <ClaimDetail
              claim={selected}
              select={setSelected}
              openRubric={() => {
                setSelected(null);
                setView('method');
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
