import { useState } from "react";
import { Field, NumberInput, Slider, StatTile } from "@/components/ui";
import { money, pct } from "@/lib/format";

export function PositionSize({ portfolio = 10000, riskPct = 5 }: { portfolio?: number; riskPct?: number }) {
  const [pf, setPf] = useState(portfolio);
  const [share, setShare] = useState(riskPct);
  const [drop, setDrop] = useState(50);

  const size = pf * (share / 100);
  const loss = size * (drop / 100);
  const lossShare = pf > 0 ? loss / pf : 0;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Field label="Portfolio value">
            <NumberInput value={pf} onChange={setPf} min={0} step={100} prefix="$" />
          </Field>
          <Slider label="Max share of portfolio for one holding" value={share} min={1} max={25} onChange={setShare} format={(v) => `${v}%`} hint="A common beginner rule: under 5% for a single stock, a few percent for crypto." />
          <Slider label="How far could it fall before you would panic?" value={drop} min={10} max={90} step={5} onChange={setDrop} format={(v) => `−${v}%`} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Max position size" value={money(size, "USD", { digits: 0 })} sub={`${share}% of ${money(pf, "USD", { digits: 0 })}`} />
            <StatTile label={`If it fell ${drop}% you would lose`} value={money(loss, "USD", { digits: 0 })} deltaTone="bad" />
            <StatTile label="…which is this much of your portfolio" value={pct(-lossShare, 1)} sub="the whole pot barely notices" />
          </div>
          <table className="widget-table">
            <thead>
              <tr>
                <th>Share of portfolio</th>
                <th className="num">Position</th>
                <th className="num">Loss at −{drop}%</th>
                <th className="num">Hit to portfolio</th>
              </tr>
            </thead>
            <tbody>
              {[2, 5, 10, 20].map((s) => {
                const p = pf * (s / 100);
                const l = p * (drop / 100);
                return (
                  <tr key={s} className={s === share ? "hl" : ""}>
                    <td>{s}%</td>
                    <td className="num">{money(p, "USD", { digits: 0 })}</td>
                    <td className="num">{money(l, "USD", { digits: 0 })}</td>
                    <td className="num">{pct(-(pf ? l / pf : 0), 1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="widget-note">
        Decide the size <strong>before</strong> you buy, when you are calm. A position small enough that its worst plausible fall is a shrug is a position you can hold through anything, which is the only way long-term returns actually arrive.
      </p>
    </div>
  );
}
