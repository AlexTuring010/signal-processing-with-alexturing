import Link from 'next/link'
import { ArrowLeft, Brain } from 'lucide-react'
import { QuizSession } from '@/components/practice/QuizSession'
import { QUIZ_BANK } from '@/content/practice/quiz-bank'
import {
  FormulaSheetPanel,
  FormulaSheetButton,
} from '@/components/practice/FormulaSheetPanel'

export const metadata = {
  title: 'Quiz — Σωστό/Λάθος + πολλαπλής επιλογής',
  description:
    'Quiz mode με τρεις τρόπους: static, timed, ή one-at-a-time. Φίλτρο κατά topic. Το τυπολόγιο διαθέσιμο από το κουμπί κάτω αριστερά.',
}

export default function QuizPage() {
  return (
    <>
      <FormulaSheetPanel />
      <FormulaSheetButton />

      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <Link
            href="/practice"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Πίσω στο Practice hub
          </Link>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <Brain className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quiz mode
          </h1>
          <p className="mt-3 max-w-2xl text-fg-muted">
            Σωστό/Λάθος και πολλαπλής επιλογής, με εξήγηση και link στις
            σχετικές ενότητες θεωρίας μετά από κάθε απάντηση. Άνοιξε το
            τυπολόγιο όποτε θέλεις από το κουμπί κάτω αριστερά.
          </p>
        </header>

        <QuizSession bank={QUIZ_BANK} defaultDurationSec={600} />
      </div>
    </>
  )
}
