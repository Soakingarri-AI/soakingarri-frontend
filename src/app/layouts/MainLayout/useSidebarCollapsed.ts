import { useCallback, useState } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

// Storage can be unavailable (private mode, blocked site data), so every access
// is guarded and the sidebar simply starts expanded when it can't be read.
const readCollapsed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/** Whether the sidebar is collapsed to an icon rail, remembered across reloads. */
export const useSidebarCollapsed = () => {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Not remembered this time; the toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return { collapsed, toggle };
};
