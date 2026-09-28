import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

/** Small uppercase ticker input that commits on Enter or blur. */
export function SymbolInput({ value, onCommit, label = "Ticker" }: { value: string; onCommit: (s: string) => void; label?: string }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const commit = () => {
    const s = text.trim().toUpperCase();
    if (s && s !== value) onCommit(s);
    else setText(value);
  };
  return (
    <div className="field">
      <label>{label}</label>
      <div className="widget-symbol">
        <input
          className="input mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          placeholder="e.g. VWCE.DE"
          aria-label={label}
        />
        <Button size="sm" onClick={commit}>
          Go
        </Button>
      </div>
      <div className="tiny muted-3">Examples: VOO, VWCE.DE, IWDA.AS, AAPL, BTC-USD</div>
    </div>
  );
}
