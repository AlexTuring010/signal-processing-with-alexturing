import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Brain,
  ListChecks,
  BookOpen,
  Sigma,
  FlaskConical,
  ChevronRight,
  Bookmark,
  Flame,
} from 'lucide-react'
import { CHAPTERS, AVAILABLE_COUNT, ALL_SECTIONS } from '@/lib/content-index'

const FIRST_AVAILABLE = ALL_SECTIONS.find((s) => s.available)

/** Topics ranked by exam weight from the inventory, for the "if you're cramming" panel. */
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
          K21 — Συστήματα Επικοινωνιών · ΕΚΠΑ ΔΙΤ
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Signal Processing με{' '}
          <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
            AlexTuring
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-muted">
          Διαδραστικός οδηγός για το μάθημα <em>Συστήματα Επικοινωνιών</em>. Από
          το μηδέν — με διαίσθηση πρώτα, μαθηματικά μετά, και visualizations
          που τα δένουν μεταξύ τους.
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

      {/* Quick destinations */}
      <section className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickDest
          href="/practice"
          Icon={ListChecks}
          title="Λυμένες ασκήσεις"
          subtitle="13 παραδείγματα — διαλέξεις + παλαιά θέματα, φιλτραρίσιμα κατά topic"
          accent="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
        />
        <QuickDest
          href="/practice/quiz"
          Icon={Brain}
          title="Quiz mode"
          subtitle="Σωστό/Λάθος + πολλαπλής επιλογής σε 3 modes (static / timed / one-by-one)"
          accent="bg-purple-500/15 text-purple-600 dark:text-purple-300"
        />
        <QuickDest
          href="/formulas"
          Icon={Sigma}
          title="Τυπολόγιο"
          subtitle="Όλες οι κρίσιμες εξισώσεις του μαθήματος, οργανωμένες"
          accent="bg-sky-500/15 text-sky-600 dark:text-sky-300"
        />
        <QuickDest
          href="/bookmarks"
          Icon={Bookmark}
          title="Bookmarks"
          subtitle="Σελίδες που έχεις σημαδέψει για γρήγορη πρόσβαση"
          accent="bg-amber-500/15 text-amber-600 dark:text-amber-300"
        />
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
          Η ύλη με βάση το βάρος στις προηγούμενες εξετάσεις (αναλυμένη από 8
          παρελθοντικά θέματα). Ξεκίνα από τα μεγάλα ποσοστά.
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

      {/* Full syllabus — every chapter, every section, all clickable */}
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

      {/* Why this site (compact pillars) */}
      <section className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
        <Pillar
          Icon={BookOpen}
          title="Από το μηδέν"
          body="Καμία υπόθεση ότι ξέρεις. Κάθε έννοια εξηγείται με διαίσθηση και απλό παράδειγμα πριν μπει η πρώτη εξίσωση."
        />
        <Pillar
          Icon={Sigma}
          title="Μαθηματικά με νόημα"
          body="Όταν εμφανίζεται μια εξίσωση, εξηγείται τι λέει στ' αλήθεια — όχι μόνο πώς γράφεται."
        />
        <Pillar
          Icon={FlaskConical}
          title="Lab & visualizations"
          body="Interactive demos σού δείχνουν πώς αλλάζει η συμπεριφορά όταν σύρεις slider. Lab MATLAB πάντα προαιρετικό."
        />
      </section>

      {/* Note */}
      <section className="mx-auto mt-12 max-w-3xl rounded-lg border border-dashed border-border bg-bg-soft px-5 py-4 text-sm text-fg-muted">
        <p>
          <strong className="text-fg">Σημείωση:</strong> Το site είναι σε ενεργή
          ανάπτυξη. Φτιάχνουμε μια ενότητα τη φορά, με τη φιλοσοφία ότι αν δεν
          βγάζει νόημα σε κάποιον που ξεκινάει από το μηδέν, την ξαναγράφουμε.
        </p>
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
      <div className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-md ${accent}`}>
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

function Pillar({
  Icon,
  title,
  body,
}: {
  Icon: typeof BookOpen
  title: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{body}</p>
    </div>
  )
}
