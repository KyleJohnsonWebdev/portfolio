'use client'

import {useSyncExternalStore} from 'react'

import {THEME_STORAGE_KEY} from '@/lib/theme'

/**
 * Cycles system → light → dark. The inline script in app/layout.tsx applies the saved
 * choice to <html data-theme> before first paint; this button only changes it afterwards.
 */

type Mode = 'system' | 'light' | 'dark'

const ORDER: Mode[] = ['system', 'light', 'dark']
const LABELS: Record<Mode, string> = {system: 'System', light: 'Light', dark: 'Dark'}

const listeners = new Set<() => void>()

function readMode(): Mode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system'
  }
}

function applyMode(mode: Mode) {
  const root = document.documentElement
  if (mode === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode)
}

function setMode(mode: Mode) {
  try {
    if (mode === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  applyMode(mode)
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  // Keep other open tabs in sync when the choice changes in one of them.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return
    applyMode(readMode())
    notify()
  }
  listeners.add(notify)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(notify)
    window.removeEventListener('storage', onStorage)
  }
}

export default function ThemeToggle() {
  // The server can't see localStorage, so it renders "system"; React re-reads on the client.
  const mode = useSyncExternalStore(subscribe, readMode, () => 'system' as const)
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={`Switch color theme (current: ${LABELS[mode]})`}
      className="min-h-target min-w-target cursor-pointer rounded-sm border border-border-strong bg-transparent px-3 text-meta text-ink transition-colors hover:border-ink"
    >
      Theme
    </button>
  )
}
