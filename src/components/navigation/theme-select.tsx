"use client";

import { useSyncExternalStore } from "react";

type Preference = "dark" | "light" | "system";
const key = "selva:theme";
let memoryPreference: Preference | undefined;
const valid = (value: string | null): value is Preference => value === "dark" || value === "light" || value === "system";

function getPreference(): Preference {
  if (memoryPreference) return memoryPreference;
  try {
    const saved = localStorage.getItem(key);
    return valid(saved) ? saved : "dark";
  } catch { return "dark"; }
}

function applyTheme(preference: Preference) {
  document.documentElement.dataset.theme = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : preference;
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const refresh = () => { applyTheme(getPreference()); callback(); };
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) { memoryPreference = undefined; refresh(); }
  };
  refresh();
  window.addEventListener("selva:theme-change", refresh);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", refresh);
  return () => {
    window.removeEventListener("selva:theme-change", refresh);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", refresh);
  };
}

export function ThemeSelect() {
  const preference = useSyncExternalStore(subscribe, getPreference, () => "dark" as const);
  return <label className="theme-control"><span className="sr-only">Color theme</span>
    <select aria-label="Color theme" value={preference} onChange={(event) => {
      const next = event.target.value;
      if (!valid(next)) return;
      memoryPreference = next;
      try { localStorage.setItem(key, next); } catch { /* Use the in-memory preference when storage is blocked. */ }
      applyTheme(next);
      window.dispatchEvent(new Event("selva:theme-change"));
    }}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select>
  </label>;
}
