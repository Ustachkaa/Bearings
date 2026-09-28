import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/lib/queries";
import type { SearchHit } from "@/lib/types";
import { typeLabel } from "@/lib/format";
import { IcSearch } from "./icons";
import "./ticker-search.css";

export function TickerSearch({
  onPick,
  placeholder = "Search a company, fund or coin…",
  autoFocus,
  compact,
}: {
  onPick?: (hit: SearchHit) => void;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const nav = useNavigate();
  const box = useRef<HTMLDivElement>(null);
  const { data, isFetching } = useSearch(q);

  useEffect(() => {
    const t = setTimeout(() => setQ(text.trim()), 220);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const hits = data ?? [];
  const pick = (h: SearchHit) => {
    setOpen(false);
    setText("");
    setQ("");
    if (onPick) onPick(h);
    else nav(`/explore/${encodeURIComponent(h.symbol)}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(hits.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hits[active]) pick(hits[active]);
      else if (text.trim()) pick({ symbol: text.trim().toUpperCase(), name: text.trim().toUpperCase(), exchange: "", type: "OTHER" });
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className={`tsearch ${compact ? "compact" : ""}`} ref={box}>
      <div className="tsearch-input">
        <IcSearch size={16} />
        <input
          value={text}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => text && setOpen(true)}
          onKeyDown={onKey}
          aria-label="Search markets"
          aria-expanded={open}
          role="combobox"
          aria-controls="tsearch-list"
        />
        {isFetching && <span className="spinner" style={{ width: 12, height: 12 }} />}
      </div>
      {open && q && (
        <ul className="tsearch-list" id="tsearch-list" role="listbox">
          {hits.length === 0 && !isFetching && <li className="tsearch-empty">No matches. Try a ticker like VWCE.DE, AAPL or BTC-USD.</li>}
          {hits.map((h, i) => (
            <li key={h.symbol} role="option" aria-selected={i === active} className={i === active ? "active" : ""} onMouseEnter={() => setActive(i)} onMouseDown={() => pick(h)}>
              <span className="mono tsearch-sym">{h.symbol}</span>
              <span className="tsearch-name">{h.name}</span>
              <span className="tsearch-meta">
                {typeLabel(h.type)}
                {h.exchange ? ` · ${h.exchange}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
