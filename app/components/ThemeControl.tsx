"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "auto" | "dark";

const modes: ThemeMode[] = ["light", "auto", "dark"];

function resolvedTheme(mode: ThemeMode) {
  if (mode !== "auto") return mode;
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme = resolvedTheme(mode);
  root.style.colorScheme = root.dataset.theme;
}

export function ThemeControl() {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme-mode");
    const initialMode = modes.includes(saved as ThemeMode) ? (saved as ThemeMode) : "auto";
    setMode(initialMode);
    applyTheme(initialMode);

    const interval = window.setInterval(() => {
      if ((document.documentElement.dataset.themeMode || "auto") === "auto") applyTheme("auto");
    }, 60_000);

    const onVisibilityChange = () => {
      if (!document.hidden && (document.documentElement.dataset.themeMode || "auto") === "auto") {
        applyTheme("auto");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const chooseMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
    window.localStorage.setItem("theme-mode", nextMode);
    applyTheme(nextMode);
  };

  return (
    <div className="theme-control" role="group" aria-label="Color theme">
      {modes.map((themeMode) => (
        <button
          type="button"
          key={themeMode}
          aria-pressed={mode === themeMode}
          onClick={() => chooseMode(themeMode)}
        >
          {themeMode}
        </button>
      ))}
    </div>
  );
}
