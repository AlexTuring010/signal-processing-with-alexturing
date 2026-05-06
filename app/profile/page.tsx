import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Award, ShieldCheck, MessageSquare, CheckCircle2, Clock, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'
import {
  CATEGORY_LABELS,
  type CommentCategory,
  type CommentStatus,
} from '@/lib/supabase/types'

export const metadata = {
  title: 'Το προφίλ μου',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?next=/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, role, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-fg-muted">
        Δεν βρέθηκε προφίλ. Δοκίμασε αποσύνδεση και επανασύνδεση.
      </div>
    )
  }

  const { data: myComments } = await supabase
    .from('comments')
    .select(
      'id, slug, page_title, section_title, body, status, category, points_awarded, created_at',
    )
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const totalPoints = (myComments ?? []).reduce(
    (s, c) => s + (c.points_awarded ?? 0),
    0,
  )

  const isModerator = profile.role === 'moderator'

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Το προφίλ μου</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Άλλαξε το ψευδώνυμο και το avatar. Δες τα σχόλια που έχεις
            αφήσει και τους πόντους που έχεις πάρει.
          </p>
        </div>
        {isModerator && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Moderator
          </span>
        )}
      </header>

      <ProfileForm
        initialDisplayName={profile.display_name}
        initialAvatarUrl={profile.avatar_url}
        email={user.email ?? null}
      />

      <section className="mt-10 rounded-xl border border-border bg-bg-elevated p-5">
        <header className="mb-4 flex flex-wrap items-center gap-3">
          <Award className="h-5 w-5 text-purple-500" aria-hidden />
          <h2 className="text-base font-semibold tracking-tight">Πόντοι μου</h2>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-purple-500/40 bg-purple-500/10 px-2.5 py-1 text-sm font-bold text-purple-700 dark:text-purple-300">
            {totalPoints}
          </span>
        </header>
        <p className="text-xs text-fg-muted">
          Πόντοι δίνονται μόνο σε σχόλια που έχουν περάσει review (έγκυρες
          διορθώσεις, χρήσιμες διευκρινήσεις, καλές προτάσεις).
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-elevated p-5">
        <header className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
          <h2 className="text-base font-semibold tracking-tight">
            Τα σχόλιά μου
          </h2>
          <span className="ml-auto text-xs text-fg-subtle">
            {(myComments ?? []).length} σχόλι{(myComments ?? []).length === 1 ? 'ο' : 'α'}
          </span>
        </header>
        {(myComments ?? []).length === 0 ? (
          <p className="text-sm italic text-fg-subtle">
            Δεν έχεις αφήσει σχόλιο ακόμα. Όταν διαβάζεις, σημείωσε ό,τι σου
            φαίνεται ασαφές ή λάθος.
          </p>
        ) : (
          <ul className="space-y-2">
            {(myComments ?? []).map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-border bg-bg-soft/40 p-3 text-sm"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-fg-muted">
                  <Link
                    href={`/${c.slug}`}
                    className="font-mono text-fg hover:text-accent"
                  >
                    /{c.slug}
                  </Link>
                  {c.section_title && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                      ⛬ {c.section_title}
                    </span>
                  )}
                  {c.status === 'resolved' && (
                    <StatusBadge status={c.status as CommentStatus} />
                  )}
                  {c.points_awarded > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                      <Award className="h-2.5 w-2.5" aria-hidden />+
                      {c.points_awarded}
                    </span>
                  )}
                  {c.category && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft px-1.5 py-0.5 text-[10px] text-fg-muted">
                      <Tag className="h-2.5 w-2.5" aria-hidden />
                      {CATEGORY_LABELS[c.category as CommentCategory]}
                    </span>
                  )}
                  <span className="ml-auto text-fg-subtle">
                    {new Date(c.created_at).toLocaleDateString('el-GR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="line-clamp-3 whitespace-pre-wrap text-sm text-fg">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: CommentStatus }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-2.5 w-2.5" aria-hidden />
        Resolved
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
      <Clock className="h-2.5 w-2.5" aria-hidden />
      Προς review
    </span>
  )
}
