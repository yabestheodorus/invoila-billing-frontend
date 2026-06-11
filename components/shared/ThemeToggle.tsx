'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

/**
 * Flips `.dark` on <html> and remembers the choice in localStorage. The initial
 * class is set before paint by the inline script in app/layout.tsx; this only
 * reads the current state on mount (avoids an SSR hydration mismatch) and lets
 * the user override the OS default.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-8 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-surface-muted hover:text-foreground"
    >
      {/* Render a stable icon until mounted so server and client markup match. */}
      {mounted && dark ? <FiSun className="size-4" /> : <FiMoon className="size-4" />}
    </button>
  );
}
