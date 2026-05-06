'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  initialDisplayName: string
  initialAvatarUrl: string | null
  email: string | null
}

export function ProfileForm({
  initialDisplayName,
  initialAvatarUrl,
  email,
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const dirty =
    displayName.trim() !== initialDisplayName.trim() ||
    (avatarUrl.trim() || null) !== (initialAvatarUrl ?? null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dirty) return
    const trimmed = displayName.trim()
    if (trimmed.length === 0) {
      setError('Το ψευδώνυμο δεν μπορεί να είναι κενό.')
      return
    }
    setSaving(true)
    setError(null)
    setSaved(false)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      setError('Δεν είσαι συνδεδεμένος.')
      return
    }
    const { error: updError } = await supabase
      .from('profiles')
      .update({
        display_name: trimmed,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq('id', user.id)
    setSaving(false)
    if (updError) {
      setError(updError.message)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-bg-elevated p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-fg-muted">
            Ψευδώνυμο
          </span>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            maxLength={40}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-fg-muted">
            Avatar URL <span className="text-fg-subtle">(προαιρετικό)</span>
          </span>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        {email && (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-fg-muted">
              Email
            </span>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-md border border-border bg-bg-soft px-3 py-2 text-sm text-fg-muted"
            />
          </label>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {error && (
          <span className="mr-auto inline-flex items-center gap-1 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {error}
          </span>
        )}
        {saved && !error && (
          <span className="mr-auto inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Αποθηκεύτηκε.
          </span>
        )}
        <button
          type="submit"
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" aria-hidden />
          {saving ? 'Αποθήκευση…' : 'Αποθήκευσε'}
        </button>
      </div>
    </form>
  )
}
