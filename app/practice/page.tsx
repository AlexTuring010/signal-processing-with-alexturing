import { GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'Practice',
  description: 'Παλιά θέματα και ασκήσεις για εξάσκηση.',
}

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Practice hub</h1>
      <p className="mt-3 text-fg-muted">
        Εδώ θα μαζεύονται όλα τα παλιά θέματα εξετάσεων, λυμένα βήμα-βήμα,
        χωρισμένα ανά θεματική και έτος. Αυτή η σελίδα είναι placeholder — το
        περιεχόμενο έρχεται μετά την υλοποίηση των βασικών ενοτήτων.
      </p>
    </div>
  )
}
