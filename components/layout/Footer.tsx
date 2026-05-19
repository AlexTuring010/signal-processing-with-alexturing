import Link from 'next/link'
import { Github, BookOpen, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-soft/40">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Mission */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-fg">
              Algorithms &amp; Complexity · Class Hub
            </h3>
            <p className="text-sm leading-relaxed text-fg-muted">
              Φτιαγμένο με{' '}
              <Heart
                className="inline h-3.5 w-3.5 -translate-y-px text-accent"
                aria-hidden
              />{' '}
              για τους συμφοιτητές μου στο μάθημα{' '}
              <span className="font-medium">K17 — Αλγόριθμοι και Πολυπλοκότητα</span>{' '}
              του Τμήματος Πληροφορικής &amp; Τηλεπικοινωνιών του ΕΚΠΑ.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <Link href="/practice" className="text-fg-muted hover:text-fg">
                Practice
              </Link>
              <Link href="/formulas" className="text-fg-muted hover:text-fg">
                Formula sheet
              </Link>
              <Link href="/bookmarks" className="text-fg-muted hover:text-fg">
                Σελιδοδείκτες
              </Link>
            </div>
          </div>

          {/* Credits */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-fg">Συντελεστές</h3>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li>
                <span className="block text-xs uppercase tracking-wider text-fg-subtle">
                  Αρχική ιδέα &amp; αρχιτεκτονική
                </span>
                <a
                  href="https://github.com/AlexTuring010"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 hover:text-fg"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden />
                  Alex Turing
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-fg-subtle">
                  Αυτό το repository (Αλγόριθμοι)
                </span>
                <a
                  href="https://github.com/steliosrotas/algorithms-with-steliosrotas"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 hover:text-fg"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden />
                  Stelios Rotas
                </a>
              </li>
            </ul>
          </div>

          {/* Copyright / material */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-fg">
              Πνευματικά δικαιώματα υλικού
            </h3>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-fg-muted">
              <BookOpen
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden
              />
              <span>
                Οι σημειώσεις των διαλέξεων (PDF στο φάκελο{' '}
                <code className="rounded bg-bg px-1 py-0.5 text-[11px]">
                  material/Notes2026/
                </code>
                ) ανήκουν στην{' '}
                <strong className="text-fg">Αρχοντία Γιαννοπούλου</strong>,
                διδάσκουσα του μαθήματος. Παρατίθενται εδώ αποκλειστικά για
                εκπαιδευτική χρήση από τους φοιτητές του μαθήματος.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Algorithms Class Hub · Δεν συλλέγουμε
            analytics. Καθαρό εργαλείο μελέτης.
          </p>
          <p>
            Εκπαιδευτική χρήση μόνο · Όχι επίσημο υλικό του Τμήματος.
          </p>
        </div>
      </div>
    </footer>
  )
}
