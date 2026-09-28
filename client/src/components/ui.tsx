import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { IcAlert, IcCheck, IcInfo, IcSparkle, IcX } from "./icons";
import type { Stance } from "@/lib/types";
import { STANCE_LABEL } from "@/lib/types";
import { num } from "@/lib/format";
import "./ui.css";

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({
  title,
  eyebrow,
  subtitle,
  actions,
  children,
  className = "",
  ink,
  tight,
  style,
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  ink?: boolean;
  tight?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`card ${ink ? "ink" : ""} ${tight ? "tight" : ""} ${className}`} style={style}>
      {(title || actions || eyebrow) && (
        <header className="card-title">
          <div className="col" style={{ gap: 3 }}>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h3>{title}</h3>}
            {subtitle && <div className="muted small">{subtitle}</div>}
          </div>
          {actions && <div className="row">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = "default",
  size,
  to,
  href,
  loading,
  icon,
  className = "",
  ...rest
}: {
  children?: ReactNode;
  variant?: "default" | "primary" | "brass" | "ghost" | "danger";
  size?: "sm" | "lg";
  to?: string;
  href?: string;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  const cls = `btn ${variant === "default" ? "" : variant} ${size ?? ""} ${className}`;
  const inner = (
    <>
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {inner}
    </button>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} aria-label="Loading" />;
}

// ── Fields ──────────────────────────────────────────────────────────────────
export function Field({ label, hint, children, inline }: { label: ReactNode; hint?: ReactNode; children: ReactNode; inline?: boolean }) {
  return (
    <div className={`field ${inline ? "inline" : ""}`}>
      <label>{label}</label>
      {children}
      {hint && <div className="tiny muted-3">{hint}</div>}
    </div>
  );
}

/** Numeric input that lets the user type freely and commits parsed numbers. */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  addon,
  prefix,
  placeholder,
  mono = true,
  disabled,
  width,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  addon?: string;
  prefix?: string;
  placeholder?: string;
  mono?: boolean;
  disabled?: boolean;
  width?: number | string;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(Number.isFinite(value) ? String(value) : "");
  }, [value, focused]);
  const commit = (t: string) => {
    setText(t);
    const n = Number(t.replace(/,/g, ""));
    if (t.trim() !== "" && Number.isFinite(n)) {
      let v = n;
      if (min !== undefined) v = Math.max(min, v);
      if (max !== undefined) v = Math.min(max, v);
      onChange(v);
    }
  };
  const input = (
    <input
      className={`input ${mono ? "mono" : ""}`}
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      disabled={disabled}
      step={step}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setText(Number.isFinite(value) ? String(value) : "");
      }}
      onChange={(e) => commit(e.target.value)}
      style={{ width }}
    />
  );
  if (!addon && !prefix) return input;
  return (
    <div className="input-group" style={{ width }}>
      {prefix && <span className="addon left">{prefix}</span>}
      {input}
      {addon && <span className="addon">{addon}</span>}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => num(v),
  hint,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="slider">
      <div className="row between">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <span className="mono slider-val">{format(value)}</span>
      </div>
      <input id={id} className="range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <div className="tiny muted-3">{hint}</div>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="toggle" onClick={() => !disabled && onChange(!checked)} disabled={disabled}>
      <span className="switch" aria-checked={checked} />
      {label && <span className="small">{label}</span>}
    </button>
  );
}

export function Select({ value, onChange, options, className = "" }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <select className={`select ${className}`} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs<T extends string>({ tabs, value, onChange, className = "" }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Badges ──────────────────────────────────────────────────────────────────
export function Badge({ tone = "", children, dot }: { tone?: "" | "good" | "warn" | "bad" | "info" | "brass"; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`badge ${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export const STANCE_TONE: Record<Stance, "good" | "info" | "warn" | "bad"> = {
  accumulate: "good",
  steady: "info",
  patience: "warn",
  caution: "bad",
};

export function StanceBadge({ stance, headline }: { stance: Stance; headline?: string }) {
  return (
    <Badge tone={STANCE_TONE[stance]} dot>
      {headline ?? STANCE_LABEL[stance]}
    </Badge>
  );
}

export function LevelBadge({ level }: { level: "opportunity" | "neutral" | "caution" | "info" | "reminder" }) {
  const map = {
    opportunity: { tone: "good" as const, label: "Opportunity" },
    neutral: { tone: "" as const, label: "Neutral" },
    caution: { tone: "bad" as const, label: "Caution" },
    info: { tone: "info" as const, label: "Heads-up" },
    reminder: { tone: "brass" as const, label: "Reminder" },
  };
  const m = map[level] ?? map.neutral;
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

// ── Callout ─────────────────────────────────────────────────────────────────
export function Callout({ tone = "note", title, children }: { tone?: "tip" | "warn" | "note" | "key"; title?: ReactNode; children: ReactNode }) {
  const icon = tone === "warn" ? <IcAlert size={18} /> : tone === "tip" ? <IcSparkle size={18} /> : tone === "key" ? <IcCheck size={18} /> : <IcInfo size={18} />;
  const defaultTitle = { tip: "Tip", warn: "Careful", note: "Note", key: "Key idea" }[tone];
  return (
    <aside className={`callout ${tone}`}>
      <div className="callout-icon">{icon}</div>
      <div className="grow">
        <div className="callout-title">{title ?? defaultTitle}</div>
        <div className="callout-body">{children}</div>
      </div>
    </aside>
  );
}

// ── Stat tile ───────────────────────────────────────────────────────────────
export function StatTile({
  label,
  value,
  delta,
  deltaTone,
  sub,
  hero,
  children,
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: "good" | "bad" | "";
  sub?: ReactNode;
  hero?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`stat ${hero ? "hero" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {(delta || sub) && (
        <div className="row" style={{ gap: 8 }}>
          {delta && <span className={`stat-delta ${deltaTone ?? ""}`}>{delta}</span>}
          {sub && <span className="tiny muted-3">{sub}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Empty / loading ─────────────────────────────────────────────────────────
export function Empty({ title, text, action }: { title: ReactNode; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="serif">{title}</div>
      {text && <div className="small">{text}</div>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

export function Skeleton({ w = "100%", h = 16, className = "" }: { w?: number | string; h?: number | string; className?: string }) {
  return <div className={`skeleton ${className}`} style={{ width: w, height: h }} />;
}

export function ErrorNote({ error, retry }: { error: unknown; retry?: () => void }) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    <div className="callout warn" role="alert">
      <div className="callout-icon">
        <IcAlert size={18} />
      </div>
      <div className="grow">
        <div className="callout-title">Something went wrong</div>
        <div className="callout-body">{msg}</div>
        {retry && (
          <div style={{ marginTop: 8 }}>
            <Button size="sm" onClick={retry}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, width = 520 }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal rise" role="dialog" aria-modal="true" style={{ maxWidth: width }}>
        <header className="row between" style={{ marginBottom: 14 }}>
          <h3>{title}</h3>
          <button className="btn ghost icon" onClick={onClose} aria-label="Close">
            <IcX />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="row" style={{ justifyContent: "flex-end", marginTop: 18, gap: 8 }}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

// ── Toasts ──────────────────────────────────────────────────────────────────
interface Toast {
  id: number;
  tone: "good" | "bad" | "info";
  text: string;
}
const ToastCtx = createContext<{ push: (tone: Toast["tone"], text: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = useCallback((tone: Toast["tone"], text: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, tone, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      {createPortal(
        <div className="toasts" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.tone}`}>
              {t.tone === "good" ? <IcCheck size={16} /> : t.tone === "bad" ? <IcAlert size={16} /> : <IcInfo size={16} />}
              <span>{t.text}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  return {
    success: (t: string) => ctx?.push("good", t),
    error: (t: string) => ctx?.push("bad", t),
    info: (t: string) => ctx?.push("info", t),
  };
}

// ── Inline markdown (bold, italic, code, links) ─────────────────────────────
export function InlineMd({ text }: { text: string }) {
  const parts = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {parts.map((p, i) => {
        switch (p.t) {
          case "b":
            return <strong key={i}>{p.v}</strong>;
          case "i":
            return <em key={i}>{p.v}</em>;
          case "c":
            return <code key={i}>{p.v}</code>;
          case "a":
            return p.href.startsWith("/") ? (
              <Link key={i} to={p.href}>
                {p.v}
              </Link>
            ) : (
              <a key={i} href={p.href} target="_blank" rel="noreferrer">
                {p.v}
              </a>
            );
          default:
            return <span key={i}>{p.v}</span>;
        }
      })}
    </>
  );
}

type Part = { t: "s" | "b" | "i" | "c"; v: string } | { t: "a"; v: string; href: string };
const RX = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
function parseInline(text: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(RX)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ t: "s", v: text.slice(last, idx) });
    const tok = m[0];
    if (tok.startsWith("**")) out.push({ t: "b", v: tok.slice(2, -2) });
    else if (tok.startsWith("`")) out.push({ t: "c", v: tok.slice(1, -1) });
    else if (tok.startsWith("*")) out.push({ t: "i", v: tok.slice(1, -1) });
    else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (mm) out.push({ t: "a", v: mm[1], href: mm[2] });
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push({ t: "s", v: text.slice(last) });
  return out;
}

// ── Page header ─────────────────────────────────────────────────────────────
export function PageHeader({ eyebrow, title, lede, actions }: { eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header rise">
      <div className="grow">
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  );
}

export function Confirm({
  open,
  onClose,
  onConfirm,
  title,
  text,
  confirmLabel = "Confirm",
  danger,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  text: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={440}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="muted">{text}</p>
    </Modal>
  );
}
