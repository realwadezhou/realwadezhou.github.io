'use client';
import { RowCountSelect } from './row-count-select';
import { paginate, type RowCount } from '@/lib/pagination';
import { useState, type CSSProperties } from 'react';
import Link from '@/components/page-link';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileText,
  Home as HomeIcon,
  Info,
  LineChart,
  Radio,
  Ruler,
  Smartphone,
  Target,
  Trophy,
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
import { KuoOverview } from '@/components/kuo-overview';
import { GradingRubric } from '@/components/grading-rubric';
import { ResearchStatus } from '@/components/research-status';
import { VoxPilot } from '@/components/vox-pilot';
import { MushyQuestions } from '@/components/mushy-questions';
import { MushyCalibration } from '@/components/mushy-calibration';
import { OntologyOverview } from '@/components/ontology-overview';
import { rungForClaim } from '@/lib/ontology';
import { HomeOverview } from '@/components/home-overview';
import {
  About,
  EssayScoring,
  ResearchOverview,
  VibesScoring,
} from '@/components/static-pages';
import { mushyData } from '@/lib/mushy';

type View =
  | EssaySlug
  | 'home'
  | 'essays'
  | 'vibes-scoring'
  | 'essay-scoring'
  | 'about'
  | 'research-checklist'
  | 'all'
  | 'models'
  | 'products'
  | 'capabilities'
  | 'people'
  | 'method'
  | 'research'
  | 'research-vox'
  | 'research-mushy'
  | 'research-calibration'
  | 'research-ontology'
  | 'andrew-curran'
  | 'mark-gurman'
  | 'ming-chi-kuo'
  | 'apple-launches';
const titles: Record<View, string> = {
  home: 'Hindsight Research',
  essays: 'Major AI essays',
  'vibes-scoring': 'Scoring system: quantifying vibes',
  'essay-scoring': 'Scoring system: essays',
  about: 'About',
  'research-checklist': 'Internal checklist',
  'ai-2027': 'AI 2027',
  'ai-2040-plan-a': 'AI 2040: Plan A',
  'situational-awareness': 'Situational Awareness',
  all: 'Forecast index',
  models: 'Model releases',
  products: 'Product releases',
  capabilities: 'Capabilities & adoption',
  people: 'People',
  method: 'Grading rubric',
  research: 'Research',
  'research-vox': 'Vox pilot',
  'research-mushy': 'Pundit priors',
  'research-calibration': 'Leaderboard',
  'research-ontology': 'How we grade',
  'andrew-curran': 'Andrew Curran',
  'mark-gurman': 'Mark Gurman',
  'ming-chi-kuo': 'Ming-Chi Kuo',
  'apple-launches': 'Apple launch dates',
};
const descriptions: Record<View, string> = {
  home: 'What did pundits and analysts believe? How accurate were they?',
  essays:
    'Longer essays about AI, broken down into individual claims and graded on current evidence.',
  'vibes-scoring':
    'How we convert vibes into probabilities and score implicit predictions.',
  'essay-scoring':
    'Rubric 0.2: a sealed reading of each claim, then a verdict with cited evidence.',
  about: 'What this project is, and how it works.',
  'research-checklist':
    'Internal working checklist for the research pipeline. Not linked from the navigation.',
  research:
    'Where the project stands: early findings, current work, and what is not yet reliable.',
  'research-vox':
    'Vox Future Perfect, 2019–2026. Recover the author’s stated probability with the number hidden.',
  'research-mushy':
    'What pundits implied over time, against markets, Metaculus and the outcome.',
  'research-calibration':
    'How well pundits’ implied probabilities matched outcomes, by author and outlet.',
  'research-ontology':
    'Claim verdicts and inferred priors: two kinds of grading, with explicit rungs and provenance.',
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
  'ming-chi-kuo':
    'Apple supply-chain forecasts · 2015–2026 reports, reviewed November 2026',
  'apple-launches':
    'A reusable reference for announcement dates, orders, and availability—linked to forecast evaluations.',
};
/** Update when publishing changes to the site. */
const LAST_UPDATED = '15 November 2026';
const SECTIONS: [string, View[]][] = [
  [
    'Quantifying vibes',
    ['research-mushy', 'research-calibration', 'vibes-scoring'],
  ],
  [
    'Explicit forecasts',
    [
      'all',
      'models',
      'products',
      'capabilities',
      'people',
      'method',
      'andrew-curran',
      'mark-gurman',
      'ming-chi-kuo',
      'apple-launches',
    ],
  ],
  [
    'Essay evaluations',
    [
      'essays',
      'essay-scoring',
      'ai-2027',
      'ai-2040-plan-a',
      'situational-awareness',
    ],
  ],
  [
    'The project',
    [
      'research',
      'research-checklist',
      'research-vox',
      'research-ontology',
      'about',
    ],
  ],
];
const sectionOf = (view: View) =>
  SECTIONS.find(([, views]) => views.includes(view))?.[0] ?? 'Home';
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
type NavItem = {
  label: string;
  href: string;
  views: View[];
  Icon: typeof BookOpen;
};
const NAV: { group: string | null; items: NavItem[] }[] = [
  {
    group: null,
    items: [{ label: 'Home', href: '/', views: ['home'], Icon: HomeIcon }],
  },
  {
    group: 'QUANTIFYING VIBES',
    items: [
      {
        label: 'Pundit priors',
        href: '/research/mushy',
        views: ['research-mushy'],
        Icon: LineChart,
      },
      {
        label: 'Leaderboard',
        href: '/research/calibration',
        views: ['research-calibration'],
        Icon: Trophy,
      },
      {
        label: 'Scoring system',
        href: '/research/scoring',
        views: ['vibes-scoring'],
        Icon: Ruler,
      },
    ],
  },
  {
    group: 'EXPLICIT FORECASTS',
    items: [
      {
        label: 'Apple releases',
        href: '/forecasts/products',
        views: [
          'products',
          'all',
          'models',
          'mark-gurman',
          'ming-chi-kuo',
          'andrew-curran',
          'apple-launches',
          'people',
        ],
        Icon: Smartphone,
      },
      {
        label: 'Scoring system',
        href: '/forecasts/method',
        views: ['method'],
        Icon: Ruler,
      },
    ],
  },
  {
    group: 'ESSAY EVALUATIONS',
    items: [
      {
        label: 'Major AI essays',
        href: '/essays',
        views: [
          'essays',
          'capabilities',
          'ai-2027',
          'ai-2040-plan-a',
          'situational-awareness',
        ],
        Icon: BookOpen,
      },
      {
        label: 'Scoring system',
        href: '/research/essay-scoring',
        views: ['essay-scoring'],
        Icon: Ruler,
      },
    ],
  },
  {
    group: 'THE PROJECT',
    items: [
      {
        label: 'Research',
        href: '/research',
        views: ['research', 'research-checklist', 'research-ontology'],
        Icon: FileText,
      },
      {
        label: 'Calibration',
        href: '/research/vox',
        views: ['research-vox'],
        Icon: Target,
      },
      { label: 'About', href: '/about', views: ['about'], Icon: Info },
    ],
  },
];
function Navigation({ view }: { view: View }) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar className="site-sidebar">
      <SidebarHeader className="brand">
        <Radio size={21} strokeWidth={1.8} />
        <span className="brand-name">
          <span>Hindsight Research</span>
          <span className="brand-version">v0.2</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map(({ group, items }) => (
          <SidebarGroup key={group ?? 'top'}>
            {group && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
            <SidebarMenu>
              {items.map(({ label, href, views, Icon }) => {
                const active = views.includes(view);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      className="nav-item"
                      isActive={active}
                      render={
                        <Link
                          href={href}
                          onClick={() => setOpenMobile(false)}
                          aria-current={active ? 'page' : undefined}
                        />
                      }
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="sidebar-note">
        <span>Site last updated {LAST_UPDATED}</span>
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
            <dd>
              {claim.probability
                ? `${claim.probability.strict ? 'Greater than' : 'At least'} ${Math.round(claim.probability.value * 100)}% · lower bound, no point-probability score`
                : 'Not recorded · no probability score'}
            </dd>
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
  initialView = 'home',
}: {
  initialView?: View;
}) {
  const view = initialView;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState<RowCount>(25);
  const [sort, setSort] = useState('newest');
  // Forecast views have their own static pages (/forecasts/<view>).
  const setView = (next: View) => window.location.assign(`/forecasts/${next}`);
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
  const {
    pageCount,
    current: currentPage,
    visible,
  } = paginate(filtered, page, rowCount);
  const person = people.find((p) => p.id === view);
  return (
    <SidebarProvider style={{ '--sidebar-width': '15rem' } as CSSProperties}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation view={view} />
      <SidebarInset>
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="sidebar-toggle" />
            <span>{sectionOf(view)}</span>
            {view !== 'home' && (
              <>
                <ChevronRight size={13} aria-hidden="true" />
                <span>{titles[view]}</span>
              </>
            )}
          </div>
          <span className="edition">{LAST_UPDATED}</span>
        </header>
        <div id="main-content" className="page-content" tabIndex={-1}>
          <div className="page-heading">
            <div className="eyebrow">
              {view === 'home' ? 'Version 0.2' : sectionOf(view).toUpperCase()}
            </div>
            <h1>{titles[view]}</h1>
            <p className="intro">{descriptions[view]}</p>
          </div>
          {essay ? (
            <EssayEvaluation essay={essay} />
          ) : view === 'home' ? (
            <HomeOverview />
          ) : view === 'essays' ? (
            <EssayCollection />
          ) : view === 'vibes-scoring' ? (
            <VibesScoring />
          ) : view === 'essay-scoring' ? (
            <EssayScoring />
          ) : view === 'about' ? (
            <About />
          ) : view === 'apple-launches' ? (
            <AppleLaunchTable claims={claims} select={setSelected} />
          ) : view === 'method' ? (
            <GradingRubric />
          ) : view === 'research' ? (
            <ResearchOverview
              questions={mushyData.questions.length}
              readings={
                mushyData.questions
                  .flatMap((q) => q.points)
                  .filter(
                    (p) => p.p != null && p.reader === mushyData.readers[0],
                  ).length
              }
              references={mushyData.questions.reduce(
                (n, q) => n + q.series.length,
                0,
              )}
            />
          ) : view === 'research-checklist' ? (
            <ResearchStatus />
          ) : view === 'research-vox' ? (
            <VoxPilot />
          ) : view === 'research-mushy' ? (
            <MushyQuestions />
          ) : view === 'research-calibration' ? (
            <MushyCalibration />
          ) : view === 'research-ontology' ? (
            <OntologyOverview />
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
              {view === 'ming-chi-kuo' && (
                <KuoOverview
                  claims={claims}
                  select={setSelected}
                  openLaunches={() => setView('apple-launches')}
                />
              )}
              {view === 'mark-gurman' && (
                <GurmanOverview
                  claims={claims}
                  select={setSelected}
                  openLaunches={() => setView('apple-launches')}
                />
              )}
              {collection.length > 0 && (
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
                  <RowCountSelect
                    value={rowCount}
                    onChange={(value) => {
                      setRowCount(value);
                      setPage(0);
                    }}
                  />
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
                    {visible.map((c) => (
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
                          <Status value={c.status} />{' '}
                          <span
                            className="status status-neutral hindsight-badge"
                            title="Commitment rung"
                          >
                            {rungForClaim(c)}
                          </span>
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
                            {(['Forecast', 'Outcome'] as const).map((role) => {
                              const source = c.sources.find(
                                (item) =>
                                  item.role === role && item.access === 'Read',
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
                            })}
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
              {rowCount === 'all' && (
                <p className="fine-print" aria-live="polite">
                  Showing all {filtered.length} rows
                </p>
              )}
              {pageCount > 1 && (
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
            <span>Hindsight Research</span>
            <span>
              Project is in early testing. All numbers are subject to revision.
            </span>
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
