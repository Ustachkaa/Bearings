import { useState } from "react";
import { Field, NumberInput, Slider, StatTile } from "@/components/ui";
import { money, num } from "@/lib/format";

export function EmergencyFund({ monthlyExpenses = 1500, months = 6 }: { monthlyExpenses?: number; months?: number }) {
  const [exp, setExp] = useState(monthlyExpenses);
  const [mo, setMo] = useState(months);
  const [saved, setSaved] = useState(0);

  const target = exp * mo;
  const covered = exp > 0 ? saved / exp : 0;
  const gap = Math.max(0, target - saved);
  const perMonth = gap / 12;
  const progress = target > 0 ? Math.min(1, saved / target) : 0;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Field label="Monthly essential expenses" hint="Rent, food, utilities, transport, debt payments. Not holidays.">
            <NumberInput value={exp} onChange={setExp} min={0} step={50} prefix="$" />
          </Field>
          <Field label="Emergency savings you already have">
            <NumberInput value={saved} onChange={setSaved} min={0} step={50} prefix="$" />
          </Field>
          <Slider label="Months of cover you want" value={mo} min={3} max={12} onChange={setMo} format={(v) => `${v} months`} hint="Three months for a very stable job, six for most people, more for irregular income." />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Target emergency fund" value={money(target, "USD", { digits: 0 })} sub={`${mo} × ${money(exp, "USD", { digits: 0 })}`} />
            <StatTile label="Months covered today" value={`${num(covered, 1)} mo`} deltaTone={covered >= mo ? "good" : ""} />
            <StatTile label="Save per month to get there in a year" value={gap === 0 ? "Done" : money(perMonth, "USD", { digits: 0 })} deltaTone={gap === 0 ? "good" : ""} />
          </div>
          <div>
            <div className="row between" style={{ marginBottom: 6 }}>
              <span className="label">Progress</span>
              <span className="mono small">{Math.round(progress * 100)}%</span>
            </div>
            <div className="widget-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Emergency fund progress">
              <span style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      <p className="widget-note">
        This money is the reason you will never be forced to sell investments at the worst moment. It lives in a <strong>deposit or savings account</strong> you can reach within days, and it is never invested. Build it first, then start the monthly plan.
      </p>
    </div>
  );
}
