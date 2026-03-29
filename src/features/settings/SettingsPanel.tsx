import { useEffect, useMemo } from "react";
import styles from "./SettingsPanel.module.css";

// ---------------------------------------------------------------------------
// Settings schema
// ---------------------------------------------------------------------------

type BooleanDef = { key: string; label: string; type: "boolean"; default: boolean };
type NumberDef  = { key: string; label: string; type: "number";  default: number;  min: number; max: number; step?: number };
type SelectDef  = { key: string; label: string; type: "select";  default: string;  options: string[] };
type TextDef    = { key: string; label: string; type: "text";    default: string };
type SettingDef = BooleanDef | NumberDef | SelectDef | TextDef;

type Section = { title: string; settings: SettingDef[] };

const SECTIONS: Section[] = [
  {
    title: "Font",
    settings: [
      { key: "fontSize",      label: "Font Size",       type: "number",  default: 14,         min: 8,  max: 30, step: 1 },
      { key: "fontFamily",    label: "Font Family",     type: "text",    default: "Menlo, Monaco, 'Courier New', monospace" },
      { key: "fontLigatures", label: "Font Ligatures",  type: "boolean", default: false },
      { key: "lineHeight",    label: "Line Height",     type: "number",  default: 0,          min: 0,  max: 60, step: 1 },
    ],
  },
  {
    title: "Cursor",
    settings: [
      { key: "cursorStyle",    label: "Cursor Style",    type: "select", default: "line",  options: ["line", "block", "underline", "line-thin", "block-outline", "underline-thin"] },
      { key: "cursorBlinking", label: "Cursor Blinking", type: "select", default: "blink", options: ["blink", "smooth", "phase", "expand", "solid"] },
    ],
  },
  {
    title: "Editing",
    settings: [
      { key: "tabSize",              label: "Tab Size",               type: "number",  default: 2,                    min: 1, max: 8, step: 1 },
      { key: "insertSpaces",         label: "Insert Spaces",          type: "boolean", default: true },
      { key: "wordWrap",             label: "Word Wrap",              type: "select",  default: "off",                options: ["off", "on", "wordWrapColumn", "bounded"] },
      { key: "formatOnPaste",        label: "Format On Paste",        type: "boolean", default: false },
      { key: "formatOnType",         label: "Format On Type",         type: "boolean", default: false },
      { key: "autoClosingBrackets",  label: "Auto Closing Brackets",  type: "select",  default: "languageDefined",    options: ["always", "languageDefined", "beforeWhitespace", "never"] },
      { key: "autoClosingQuotes",    label: "Auto Closing Quotes",    type: "select",  default: "languageDefined",    options: ["always", "languageDefined", "beforeWhitespace", "never"] },
    ],
  },
  {
    title: "Display",
    settings: [
      { key: "lineNumbers",                   label: "Line Numbers",                  type: "select",  default: "on",   options: ["on", "off", "relative", "interval"] },
      { key: "renderWhitespace",              label: "Render Whitespace",             type: "select",  default: "none", options: ["none", "boundary", "selection", "trailing", "all"] },
      { key: "renderLineHighlight",           label: "Render Line Highlight",         type: "select",  default: "line", options: ["none", "gutter", "line", "all"] },
      { key: "minimap.enabled",               label: "Minimap",                       type: "boolean", default: false },
      { key: "folding",                       label: "Folding",                       type: "boolean", default: true },
      { key: "bracketPairColorization.enabled", label: "Bracket Pair Colorization",  type: "boolean", default: true },
    ],
  },
  {
    title: "Scrolling",
    settings: [
      { key: "scrollBeyondLastLine", label: "Scroll Beyond Last Line", type: "boolean", default: false },
      { key: "smoothScrolling",      label: "Smooth Scrolling",        type: "boolean", default: false },
      { key: "mouseWheelZoom",       label: "Mouse Wheel Zoom",        type: "boolean", default: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Dot-notation helpers
// ---------------------------------------------------------------------------

function getSettingValue(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function setSettingValue(obj: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
  const parts = key.split(".");
  const result = { ...obj };
  let cur: Record<string, unknown> = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    cur[part] = typeof cur[part] === "object" && cur[part] !== null ? { ...(cur[part] as Record<string, unknown>) } : {};
    cur = cur[part] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return result;
}

function buildDefaults(): Record<string, unknown> {
  let obj: Record<string, unknown> = {};
  for (const section of SECTIONS) {
    for (const def of section.settings) {
      obj = setSettingValue(obj, def.key, def.default);
    }
  }
  return obj;
}

// ---------------------------------------------------------------------------
// Control components
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

function NumberInput({ value, min, max, step, onChange }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      className={styles.numberInput}
      value={value}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      className={styles.textInput}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function SelectInput({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      className={styles.selectInput}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ---------------------------------------------------------------------------
// SettingRow
// ---------------------------------------------------------------------------

function SettingRow({ def, settings, onChange }: {
  def: SettingDef;
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  const raw = getSettingValue(settings, def.key);

  let control: React.ReactNode;
  if (def.type === "boolean") {
    const checked = raw != null ? Boolean(raw) : def.default;
    control = <Toggle checked={checked} onChange={v => onChange(def.key, v)} />;
  } else if (def.type === "number") {
    const num = raw != null ? Number(raw) : def.default;
    control = <NumberInput value={num} min={def.min} max={def.max} step={def.step} onChange={v => onChange(def.key, v)} />;
  } else if (def.type === "text") {
    const str = raw != null ? String(raw) : def.default;
    control = <TextInput value={str} onChange={v => onChange(def.key, v)} />;
  } else {
    const str = raw != null ? String(raw) : def.default;
    control = <SelectInput value={str} options={def.options} onChange={v => onChange(def.key, v)} />;
  }

  return (
    <div className={styles.row}>
      <span className={styles.label}>{def.label}</span>
      {control}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsPanel
// ---------------------------------------------------------------------------

interface Props {
  settingsJson: string;
  onSettingsChange: (json: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function SettingsPanel({ settingsJson, onSettingsChange, onReset, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const settings = useMemo<Record<string, unknown>>(() => {
    try {
      return JSON.parse(settingsJson) as Record<string, unknown>;
    } catch {
      return buildDefaults();
    }
  }, [settingsJson]);

  function handleChange(key: string, value: unknown) {
    const next = setSettingValue(settings, key, value);
    onSettingsChange(JSON.stringify(next, null, 2));
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span>Editor Settings</span>
          <div className={styles.actions}>
            <button onClick={onReset}>Reset</button>
            <button onClick={onClose}>✕</button>
          </div>
        </div>
        <div className={styles.content}>
          {SECTIONS.map(section => (
            <Section key={section.title} title={section.title}>
              {section.settings.map(def => (
                <SettingRow key={def.key} def={def} settings={settings} onChange={handleChange} />
              ))}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
