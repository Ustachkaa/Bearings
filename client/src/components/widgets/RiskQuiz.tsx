import { useState } from "react";
import { Button, StatTile } from "@/components/ui";
import { StackedBar } from "@/components/charts/Bars";
import { usePref } from "@/lib/theme";

interface Q {
  q: string;
  options: string[]; // index 0 scores 1, index 3 scores 4
}

const QUESTIONS: Q[] = [
  { q: "When will you need most of this money?", options: ["Within 3 years", "In 3 to 7 years", "In 7 to 15 years", "Not for 15 years or more"] },
  { q: "Your portfolio falls 30% in six months. What do you do?", options: ["Sell everything to stop the pain", "Sell some and wait", "Hold and keep the plan", "Buy more while it is cheap"] },
  { q: "How stable is your income?", options: ["Irregular or uncertain", "Stable but tight", "Stable with some savings", "Very stable with a solid emergency fund"] },
  { q: "How much investing experience do you have?", options: ["None at all", "I have read a little", "I have invested a small amount before", "I have held investments through a downturn"] },
  { q: "How important is it that this money is available exactly when planned?", options: ["Essential, no flexibility", "Important", "Somewhat flexible", "Very flexible, it can wait"] },
  { q: "Which would let you sleep best?", options: ["Never losing money, even if it grows slowly", "Small dips, modest growth", "Some rough years for better growth", "Big swings are fine if the long run is strong"] },
];

interface Profile {
  name: string;
  min: number;
  mix: { stocks: number; bonds: number; cash: number };
  text: string;
}

const PROFILES: Profile[] = [
  { name: "Cautious", min: 6, mix: { stocks: 40, bonds: 50, cash: 10 }, text: "Short horizon or low tolerance for swings. Growth still matters, but stability comes first." },
  { name: "Balanced", min: 11, mix: { stocks: 60, bonds: 35, cash: 5 }, text: "A medium horizon and a moderate stomach. Rough years will happen and will be survivable." },
  { name: "Growth", min: 16, mix: { stocks: 80, bonds: 18, cash: 2 }, text: "A long horizon and the temperament to hold through bear markets. Most of the portfolio works hard." },
  { name: "Adventurous", min: 21, mix: { stocks: 90, bonds: 10, cash: 0 }, text: "Fifteen-plus years and a calm view of volatility. Almost everything in broad stock funds." },
];

function profileFor(score: number): Profile {
  return [...PROFILES].reverse().find((p) => score >= p.min) ?? PROFILES[0];
}

interface Saved {
  score: number;
  at: string;
}

export function RiskQuiz() {
  const [saved, setSaved] = usePref<Saved | null>("risk-profile", null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [active, setActive] = useState(saved === null);

  const pick = (i: number) => {
    const next = [...answers, i + 1];
    if (next.length === QUESTIONS.length) {
      const score = next.reduce((a, b) => a + b, 0);
      setSaved({ score, at: new Date().toISOString() });
      setActive(false);
      setAnswers([]);
      setStep(0);
    } else {
      setAnswers(next);
      setStep(step + 1);
    }
  };

  const retake = () => {
    setAnswers([]);
    setStep(0);
    setActive(true);
  };

  if (active) {
    const q = QUESTIONS[step];
    return (
      <div className="widget">
        <div className="quiz-progress" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
          {QUESTIONS.map((_, i) => (
            <span key={i} className={i <= step ? "done" : ""} />
          ))}
        </div>
        <div className="tiny muted-3" style={{ marginTop: 8 }}>
          Question {step + 1} of {QUESTIONS.length}
        </div>
        <div className="quiz-q">{q.q}</div>
        <div className="quiz-options">
          {q.options.map((o, i) => (
            <button key={o} type="button" className="quiz-option" onClick={() => pick(i)}>
              {o}
            </button>
          ))}
        </div>
        <p className="widget-note">There are no wrong answers. Be honest about how you would actually feel, not how you think an investor should feel.</p>
      </div>
    );
  }

  const score = saved?.score ?? 6;
  const p = profileFor(score);
  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <div className="eyebrow">Your profile</div>
          <div className="quiz-result-name">{p.name}</div>
          <div className="small muted">{p.text}</div>
          <StatTile label="Score" value={`${score} of 24`} />
          <Button size="sm" onClick={retake}>
            Retake the quiz
          </Button>
        </div>
        <div className="widget-outputs">
          <div className="label">Suggested starting mix</div>
          <StackedBar
            segments={[
              { label: "Stocks", value: p.mix.stocks, color: "var(--s1)" },
              { label: "Bonds", value: p.mix.bonds, color: "var(--s3)" },
              { label: "Cash", value: p.mix.cash, color: "var(--s2)" },
            ]}
            format={(v) => `${v.toFixed(0)}%`}
            ariaLabel={`Suggested mix for a ${p.name} profile`}
          />
          <div className="widget-tiles">
            <StatTile label="Stocks" value={`${p.mix.stocks}%`} sub="broad index funds" />
            <StatTile label="Bonds" value={`${p.mix.bonds}%`} sub="government or aggregate bond funds" />
            <StatTile label="Cash" value={`${p.mix.cash}%`} sub="beyond your emergency fund" />
          </div>
        </div>
      </div>
      <p className="widget-note">
        This is a starting point, not a prescription. Two things move the answer over time: your horizon shortens as goals approach, and your tolerance usually grows once you have held through a real downturn. <strong>Retake it after your first bad month.</strong>
      </p>
    </div>
  );
}
