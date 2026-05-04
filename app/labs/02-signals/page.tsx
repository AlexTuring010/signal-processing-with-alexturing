import Link from 'next/link'
import { FlaskConical, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Lab 2 — Continuous & discrete signals (placeholder)',
  description:
    'Πλήρης σελίδα του Lab 2. Σύντομα — αυτή η σελίδα είναι placeholder.',
}

export default function Lab2Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/foundations/signals"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> πίσω στα Σήματα
      </Link>
      <div className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        🚧 Lab 2 — Συνεχή και διακριτά σήματα στο MATLAB
      </h1>
      <p className="mt-3 text-fg-muted">
        Αυτή η σελίδα είναι σύντομα. Εδώ θα μπει το πλήρες περιεχόμενο του
        εργαστηρίου: ορισμός χρονικού διανύσματος, plotting σε συνεχή/διακριτή
        μορφή, βασικά σήματα (cosine, step, ορθογώνιο, ράμπα), έλεγχος
        περιοδικότητας, decomposition σε άρτιο/περιττό, και αριθμητικός
        υπολογισμός ενέργειας με <code className="font-mono">trapz</code>.
      </p>
      <p className="mt-3 text-sm text-fg-subtle">
        Στο μεταξύ, η LabBox μέσα στη σελίδα{' '}
        <Link href="/foundations/signals" className="text-accent hover:underline">
          /foundations/signals
        </Link>{' '}
        έχει αρκετά starter snippets για να ξεκινήσεις.
      </p>
    </div>
  )
}
