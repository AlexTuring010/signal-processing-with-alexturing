'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, RotateCcw, ChevronRight, Trophy } from 'lucide-react'
import type { QuizQuestion, Topic } from '@/content/practice/types'
import { TopicFilter } from './TopicFilter'
import { QuizCard } from './QuizCard'

export type QuizMode = 'static' | 'timed' | 'single'

type Props = {
  bank: QuizQuestion[]
  /** Total seconds for "timed" mode; per-question seconds for "single" mode. */
  defaultDurationSec?: number
}

type Answer = {
  questionId: string
  value: boolean | number
  correct: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function isCorrect(q: QuizQuestion, value: boolean | number): boolean {
  if (q.type === 'true-false') return value === q.correctAnswer
  return value === q.correctAnswer
}

export function QuizSession({ bank, defaultDurationSec = 600 }: Props) {
  const [mode, setMode] = useState<QuizMode>('static')
  const [topics, setTopics] = useState<Set<Topic>>(new Set())
  const [running, setRunning] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [finished, setFinished] = useState(false)
  const sessionId = useRef(0)

  // Filter the bank by selected topics
  const filtered = useMemo(() => {
    if (topics.size === 0) return bank
    return bank.filter((q) => topics.has(q.topic))
  }, [bank, topics])

  // Topic counts for the filter chips
  const topicCounts = useMemo(() => {
    const c: Partial<Record<Topic, number>> = {}
    for (const q of bank) c[q.topic] = (c[q.topic] ?? 0) + 1
    return c
  }, [bank])

  const handleTopicToggle = (t: Topic) => {
    setTopics((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  const handleStart = () => {
    sessionId.current++
    const ordered = mode === 'static' ? filtered : shuffle(filtered)
    setQuestions(ordered)
    setAnswers(new Map())
    setCurrentIdx(0)
    setFinished(false)
    setRunning(true)
    if (mode === 'timed') {
      setTimeLeft(defaultDurationSec)
    } else if (mode === 'single') {
      setTimeLeft(defaultDurationSec)
    }
  }

  const handleReset = () => {
    setRunning(false)
    setFinished(false)
    setQuestions([])
    setAnswers(new Map())
    setCurrentIdx(0)
  }

  // Timer
  useEffect(() => {
    if (!running || finished) return
    if (mode === 'static') return
    if (timeLeft <= 0) {
      if (mode === 'timed') {
        setFinished(true)
        setRunning(false)
      } else if (mode === 'single') {
        // Auto-advance to next question
        handleAdvance()
      }
      return
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finished, timeLeft, mode])

  const handleAnswer = (q: QuizQuestion, value: boolean | number) => {
    const correct = isCorrect(q, value)
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(q.id, { questionId: q.id, value, correct })
      return next
    })
  }

  const handleAdvance = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true)
      setRunning(false)
      return
    }
    setCurrentIdx((i) => i + 1)
    if (mode === 'single') setTimeLeft(defaultDurationSec)
  }

  const score = useMemo(() => {
    let correct = 0
    for (const a of answers.values()) if (a.correct) correct++
    return { correct, answered: answers.size, total: questions.length }
  }, [answers, questions.length])

  // ─────────── Setup screen ───────────
  if (!running) {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-bg-elevated p-5">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">1. Επιλέξε topics</h2>
          <p className="mb-3 text-sm text-fg-muted">
            Άσε όλα ενεργά για ανάμεικτο quiz, ή φίλτραρε για να εξασκηθείς σε
            ένα συγκεκριμένο κεφάλαιο.
          </p>
          <TopicFilter
            selected={topics}
            onChange={handleTopicToggle}
            onClear={() => setTopics(new Set())}
            counts={topicCounts}
          />
          <p className="mt-3 text-xs text-fg-subtle">
            {filtered.length} ερωτήσεις στη λίστα.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-bg-elevated p-5">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">2. Επιλέξε mode</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <ModeOption
              id="static"
              title="Static"
              description="Όλες οι ερωτήσεις σε μία σελίδα. Χωρίς χρονικό όριο. Δες λύσεις όποτε θες."
              active={mode === 'static'}
              onSelect={() => setMode('static')}
            />
            <ModeOption
              id="timed"
              title="Timed"
              description={`Όλες οι ερωτήσεις, τυχαία σειρά, με συνολικό χρονικό όριο ${Math.round(defaultDurationSec / 60)} λεπτά. Score στο τέλος.`}
              active={mode === 'timed'}
              onSelect={() => setMode('timed')}
            />
            <ModeOption
              id="single"
              title="One-at-a-time"
              description={`Μία ερώτηση τη φορά, τυχαία σειρά, ${defaultDurationSec / 10}s ανά ερώτηση. Καλό για quick drilling.`}
              active={mode === 'single'}
              onSelect={() => setMode('single')}
            />
          </div>
        </section>

        <button
          type="button"
          onClick={handleStart}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          Ξεκίνα το quiz
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // ─────────── Finished screen ───────────
  if (finished) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
          <Trophy className="mx-auto mb-3 h-10 w-10 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <h2 className="text-2xl font-bold tracking-tight">Τέλος quiz</h2>
          <p className="mt-2 text-fg-muted">
            <span className="text-3xl font-bold tabular-nums text-fg">
              {score.correct}/{score.total}
            </span>{' '}
            σωστά ({pct}%)
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2 text-sm font-semibold text-fg transition hover:border-accent/50"
          >
            <RotateCcw className="h-4 w-4" />
            Νέο quiz
          </button>
        </section>
        <section className="space-y-4">
          <h3 className="text-base font-semibold">Αναλυτικές απαντήσεις</h3>
          {questions.map((q, idx) => {
            const a = answers.get(q.id)
            return (
              <QuizCard
                key={q.id}
                question={q}
                index={idx + 1}
                total={questions.length}
                selected={a ? a.value : null}
                reveal
              />
            )
          })}
        </section>
      </div>
    )
  }

  // ─────────── Static mode (all visible) ───────────
  if (mode === 'static') {
    return (
      <div className="space-y-6">
        <SessionHeader
          score={score}
          onReset={handleReset}
          showFinish
          onFinish={() => setFinished(true)}
        />
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const a = answers.get(q.id)
            return (
              <QuizCard
                key={q.id}
                question={q}
                index={idx + 1}
                total={questions.length}
                selected={a ? a.value : null}
                onSelect={(v) => handleAnswer(q, v)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // ─────────── Timed mode (all visible, with timer) ───────────
  if (mode === 'timed') {
    return (
      <div className="space-y-6">
        <SessionHeader
          score={score}
          timeLeft={timeLeft}
          onReset={handleReset}
          showFinish
          onFinish={() => setFinished(true)}
        />
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const a = answers.get(q.id)
            return (
              <QuizCard
                key={q.id}
                question={q}
                index={idx + 1}
                total={questions.length}
                selected={a ? a.value : null}
                onSelect={(v) => handleAnswer(q, v)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // ─────────── Single mode (one at a time, per-question timer) ───────────
  const current = questions[currentIdx]
  const currentAnswer = current ? answers.get(current.id) : undefined
  const answeredThis = currentAnswer != null
  return (
    <div className="space-y-6">
      <SessionHeader
        score={score}
        timeLeft={timeLeft}
        timerLabel="Χρόνος ερώτησης"
        onReset={handleReset}
      />
      {current && (
        <QuizCard
          question={current}
          index={currentIdx + 1}
          total={questions.length}
          selected={currentAnswer ? currentAnswer.value : null}
          onSelect={(v) => handleAnswer(current, v)}
        />
      )}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleAdvance}
          disabled={!answeredThis && timeLeft > 0}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {currentIdx + 1 >= questions.length ? 'Δες αποτελέσματα' : 'Επόμενη ερώτηση'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SessionHeader({
  score,
  timeLeft,
  timerLabel = 'Χρόνος',
  onReset,
  showFinish = false,
  onFinish,
}: {
  score: { correct: number; answered: number; total: number }
  timeLeft?: number
  timerLabel?: string
  onReset: () => void
  showFinish?: boolean
  onFinish?: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated p-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-fg-muted">
          Σωστά:{' '}
          <span className="font-mono font-semibold text-fg tabular-nums">
            {score.correct}/{score.answered}
          </span>{' '}
          (από {score.total})
        </span>
        {timeLeft != null && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs font-mono tabular-nums text-fg">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {timerLabel}: {formatTime(timeLeft)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showFinish && (
          <button
            type="button"
            onClick={onFinish}
            className="rounded-md border border-border bg-bg-soft px-3 py-1.5 text-xs font-semibold text-fg-muted transition hover:border-accent/50 hover:text-fg"
          >
            Τελείωσε
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-3 py-1.5 text-xs font-semibold text-fg-muted transition hover:border-accent/50 hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}

function ModeOption({
  id,
  title,
  description,
  active,
  onSelect,
}: {
  id: string
  title: string
  description: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left transition ${
        active
          ? 'border-accent bg-accent/5 ring-2 ring-accent/30'
          : 'border-border bg-bg-soft hover:border-accent/40'
      }`}
      aria-pressed={active}
    >
      <h3 className="mb-1 font-semibold tracking-tight">{title}</h3>
      <p className="text-xs text-fg-muted">{description}</p>
    </button>
  )
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
