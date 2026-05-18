import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Brain,
  ListChecks,
  BookOpen,
  Sigma,
  ChevronRight,
  Bookmark,
  Flame,
  MessageSquare,
  Trophy,
  Zap,
  FlaskConical,
} from 'lucide-react'
import { CHAPTERS, AVAILABLE_COUNT, ALL_SECTIONS } from '@/lib/content-index'
import { Comments } from '@/components/layout/Comments'
import { Leaderboard } from '@/components/layout/Leaderboard'

const FIRST_AVAILABLE = ALL_SECTIONS.find((s) => s.available)

const EXAM_PRIORITY = [
  {
    label: 'AM',
    weight: '35–40%',
    href: '/am/conventional',
    color: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
  {
    label: 'FM',
    weight: '25–30%',
    href: '/fm/idea',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    label: 'Fourier',
    weight: '15%',
    href: '/foundations/fourier-transform',
    color: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  {
    label: 'Noise',
    weight: '12–15%',
    href: '/noise/sources',
    color: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  },
]

export default function HomePage() {
  const lecturePct = Math.round((AVAILABLE_COUNT / ALL_SECTIONS.length) * 100)

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs font-medium tracking-wide text-fg-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
          K21 — Συστήματα Επικοινωνιών · ΕΚΠΑ DIT
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Signal Processing{' '}
          <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
            Class Hub
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-muted">
          Φτιαγμένο για να καταλάβουμε{' '}
          <em>πραγματικά</em> το μάθημα — όχι απλώς να αποστηθίσουμε τύπους.
          Κάτι ασαφές; Κάποιο λάθος; Άσε σχόλιο και θα βελτιωθεί. Όσο
          περισσότερα μάτια, τόσο πιο καλό γίνεται για όλους.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {FIRST_AVAILABLE && (
            <Link
              href={`/${FIRST_AVAILABLE.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Ξεκίνα από την αρχή
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <Link
            href="/practice/sose-to-eksamino"
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600"
          >
            <Flame className="h-4 w-4" aria-hidden />
            Σώσε το εξάμηνο
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            Practice
          </Link>
          <Link
            href="/practice/quiz"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
          >
            <Brain className="h-4 w-4" aria-hidden />
            Quiz
          </Link>
          <Link
            href="/formulas"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
          >
            <Sigma className="h-4 w-4" aria-hidden />
            Τυπολόγιο
          </Link>
        </div>
      </section>

      {/* Two paths — pick how you want to study */}
      <section className="mx-auto mt-14 max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">
            Πώς θες να μελετήσεις;
          </h2>
          <span className="text-xs text-fg-subtle">
            Δύο τρόποι — διάλεξε αυτόν που σου ταιριάζει
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Path 1: theory first (existing) */}
          {FIRST_AVAILABLE && (
            <Link
              href={`/${FIRST_AVAILABLE.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-bg-elevated p-6 transition hover:border-accent/50 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-300">
                <BookOpen className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Από τη θεωρία προς τις ασκήσεις
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Ο κλασικός τρόπος. Διαβάζεις σε σειρά κεφαλαίων, χτίζεις
                βαθιά κατανόηση, λύνεις ασκήσεις στο τέλος. Δίπλα σε κάθε
                ενότητα έχεις viz, formula sheet και comments.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <PathChip>📚 Σε βάθος</PathChip>
                <PathChip>🧠 Καταλαβαίνεις, δεν αποστηθίζεις</PathChip>
                <PathChip>⏱ Όλο το εξάμηνο</PathChip>
              </div>
              <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-sky-600 dark:text-sky-400">
                Ξεκίνα από την αρχή
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          )}
          {/* Path 2: sose to eksamino (new, urgent framing) */}
          <Link
            href="/practice/sose-to-eksamino"
            className="group relative flex flex-col rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-bg-elevated p-6 shadow-md transition hover:border-rose-500 hover:shadow-lg"
          >
            <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Flame className="h-3 w-3" aria-hidden />
              Last-minute friendly
            </span>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-300">
              <Zap className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Σώσε το εξάμηνο
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              <em>Just-in-time learning</em>. Ξεκίνα από την πιο εύκολη
              άσκηση. Κολλάς; Σου λέμε ακριβώς ποιο κομμάτι θεωρίας
              χρειάζεσαι. Επιστρέφεις, λύνεις, επόμενη. Κάθε άσκηση = ένα
              εργαλείο που μπορεί να πέσει στην εξέταση.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <PathChip accent>🛠 75 ασκήσεις</PathChip>
              <PathChip accent>📊 Παρακολούθηση εξετ. βάρους</PathChip>
              <PathChip accent>🎯 Coaching ανά άσκηση</PathChip>
            </div>
            <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-rose-600 dark:text-rose-400">
              Ξεκίνα από Άσκηση 1
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
          </Link>
        </div>
      </section>

      {/* Collaborative manifesto — compact, two-column */}
      <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-accent/30 bg-accent-soft/15 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr] sm:gap-7">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 text-accent">
              <MessageSquare className="h-4 w-4" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Πώς γίνεται καλύτερο το site
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              Δεν είναι τέλειο. Γι&apos; αυτό σε χρειάζεται.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Αν μπερδεύτηκες σε κάτι, αυτό είναι <em>χρήσιμη πληροφορία</em>:
              η εξήγηση χρειάζεται δουλειά. Άσε σχόλιο και θα φτιαχτεί. Στις
              θεωρητικές σελίδες υπάρχει κουμπί{' '}
              <em className="whitespace-nowrap">«Σχόλιο»</em> δίπλα σε κάθε
              ενότητα — χρησιμοποίησέ το για να ξέρουμε{' '}
              <em>για ποιο σημείο</em> μιλάς.
            </p>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3.5 text-sm">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
              <Trophy className="h-4 w-4" aria-hidden />
              Top Contributors
            </div>
            <p className="text-xs leading-relaxed text-fg-muted">
              Leaderboard για όσους βοηθάνε το site να γίνει καλύτερο —
              διορθώσεις, χρήσιμες διευκρινήσεις, καλές προτάσεις, tips.
            </p>
          </div>
        </div>
      </section>

      {/* Quick destinations */}
      <section className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickDest
          href="/practice"
          Icon={ListChecks}
          title="Λυμένες ασκήσεις"
          subtitle="Παλαιότερα θέματα εξετάσεων με χρονιά + βάρος, φιλτραρίσιμα"
          accent="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
        />
        <QuickDest
          href="/practice/quiz"
          Icon={Brain}
          title="Quiz mode"
          subtitle="Σ/Λ + πολλαπλής επιλογής σε 3 modes (static / timed / one-by-one)"
          accent="bg-purple-500/15 text-purple-600 dark:text-purple-300"
        />
        <QuickDest
          href="/formulas"
          Icon={Sigma}
          title="Τυπολόγιο"
          subtitle="Όλες οι κρίσιμες εξισώσεις. Διαθέσιμο και ως slide-out στο /practice"
          accent="bg-sky-500/15 text-sky-600 dark:text-sky-300"
        />
        <QuickDest
          href="/bookmarks"
          Icon={Bookmark}
          title="Bookmarks"
          subtitle="Σημαδεμένες σελίδες για γρήγορη πρόσβαση"
          accent="bg-amber-500/15 text-amber-600 dark:text-amber-300"
        />
      </section>

      {/* Lab track — optional MATLAB part */}
      <section className="mx-auto mt-12 max-w-5xl rounded-2xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/5 via-bg-elevated to-bg-elevated p-5 sm:p-6">
        <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr_auto]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300">
            <FlaskConical className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              Προαιρετικό · MATLAB lab
            </div>
            <h3 className="text-lg font-bold tracking-tight sm:text-xl">
              Παρακολουθείς το εργαστήριο;
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Ξεχωριστή ενότητα για το <strong>MATLAB μέρος</strong> του μαθήματος — όλα τα labs σε πλήρη μορφή, ασκήσεις από παλιές εξετάσεις του εργαστηρίου, και ένας σύντομος guide για την εγκατάσταση. Αν δεν παρακολουθείς, μπορείς να το αγνοήσεις τελείως.
            </p>
          </div>
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
          >
            Lab Hub
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Exam priority banner */}
      <section className="mx-auto mt-12 max-w-5xl rounded-xl border border-border bg-bg-elevated p-5">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-rose-500" aria-hidden />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
            Αν μένει λίγος χρόνος μέχρι την εξέταση
          </h2>
        </div>
        <p className="mb-4 text-sm text-fg-muted">
          Με βάση το βάρος στις προηγούμενες εξετάσεις (6 περιόδους
          αναλύθηκαν). Ξεκίνα από τα μεγάλα ποσοστά.
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAM_PRIORITY.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition hover:opacity-80 ${p.color}`}
            >
              {p.label}
              <span className="rounded-full bg-white/30 px-1.5 py-0.5 text-[11px] font-mono tabular-nums dark:bg-black/30">
                {p.weight}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full syllabus */}
      <section className="mx-auto mt-14 max-w-6xl">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Όλη η ύλη</h2>
          <span className="text-sm text-fg-muted">
            <span className="font-mono tabular-nums text-fg">
              {AVAILABLE_COUNT}/{ALL_SECTIONS.length}
            </span>{' '}
            ενότητες ({lecturePct}%)
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((c) => {
            const ready = c.sections.filter((s) => s.available).length
            const total = c.sections.length
            const allReady = ready === total && total > 0
            return (
              <article
                key={c.id}
                className="rounded-xl border border-border bg-bg-elevated p-4 transition hover:border-border/80"
              >
                <header className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold tracking-tight">{c.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-mono tabular-nums ${
                      allReady
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : ready === 0
                          ? 'bg-bg-soft text-fg-subtle'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {ready}/{total}
                  </span>
                </header>
                {c.blurb && (
                  <p className="mb-3 text-xs text-fg-muted">{c.blurb}</p>
                )}
                <ul className="space-y-1">
                  {c.sections.map((s) => (
                    <li key={s.slug}>
                      {s.available ? (
                        <Link
                          href={`/${s.slug}`}
                          className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-accent/5"
                        >
                          <span className="text-fg-muted group-hover:text-accent">
                            {s.title}
                          </span>
                          <ChevronRight
                            className="h-3.5 w-3.5 text-fg-subtle opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-accent"
                            aria-hidden
                          />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm">
                          <span className="text-fg-subtle/60">{s.title}</span>
                          <span className="rounded-full bg-bg-soft px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                            σύντομα
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mx-auto mt-14 max-w-4xl">
        <Leaderboard />
      </section>

      {/* Comments — site-wide / general */}
      <section className="mx-auto mt-12 max-w-4xl">
        <Comments
          slug="homepage"
          pageTitle="Homepage"
          title="Σχόλια για το site συνολικά"
        />
      </section>
    </div>
  )
}

function QuickDest({
  href,
  Icon,
  title,
  subtitle,
  accent,
}: {
  href: string
  Icon: typeof BookOpen
  title: string
  subtitle: string
  accent: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-bg-elevated p-4 transition hover:border-accent/50 hover:shadow-md"
    >
      <div
        className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-md ${accent}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="flex items-center gap-1 font-semibold tracking-tight">
        {title}
        <ChevronRight
          className="ml-auto h-4 w-4 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-fg-muted">{subtitle}</p>
    </Link>
  )
}

function PathChip({
  children,
  accent,
}: {
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        accent
          ? 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300'
          : 'border-border bg-bg-soft text-fg-muted'
      }`}
    >
      {children}
    </span>
  )
}
