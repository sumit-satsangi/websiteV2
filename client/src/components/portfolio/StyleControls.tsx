import { useEffect, useState } from "react";

const fonts = [
  { id: "roboto", label: "Roboto Sans Thin", family: "Roboto Sans" },
  { id: "calibri", label: "Calibri Light", family: "Calibri" },
  { id: "tahoma", label: "Tahoma", family: "Tahoma" },
] as const;

const accents = [
  { id: "green", label: "Neon green", color: "#b6ff00" },
  { id: "orange", label: "Neon orange", color: "#ff6a00" },
  { id: "pink", label: "Neon pink", color: "#ff2ebd" },
] as const;

type FontId = (typeof fonts)[number]["id"];
type AccentId = (typeof accents)[number]["id"];

function readPreference<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key) as T | null;
  return value && allowed.includes(value) ? value : fallback;
}

export function StyleControls() {
  const [font, setFont] = useState<FontId>(() => readPreference("sumitfolio-font", "roboto", fonts.map((item) => item.id)));
  const [accent, setAccent] = useState<AccentId>(() => readPreference("sumitfolio-accent", "orange", accents.map((item) => item.id)));

  useEffect(() => {
    document.documentElement.dataset.font = font;
    window.localStorage.setItem("sumitfolio-font", font);
  }, [font]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem("sumitfolio-accent", accent);
  }, [accent]);

  return (
    <div className="style-controls" aria-label="V2 visual controls">
      <label className="style-controls__font">
        <span>Type</span>
        <select value={font} onChange={(event) => setFont(event.target.value as FontId)} aria-label="Choose website font">
          {fonts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <div className="style-controls__accent" role="group" aria-label="Choose highlight color">
        <span>Signal</span>
        {accents.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`accent-swatch accent-swatch--${item.id}${accent === item.id ? " accent-swatch--active" : ""}`}
            aria-label={item.label}
            aria-pressed={accent === item.id}
            onClick={() => setAccent(item.id)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <span className="style-controls__version">V2</span>
    </div>
  );
}
