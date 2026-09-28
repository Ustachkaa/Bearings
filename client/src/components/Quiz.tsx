import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { Button, InlineMd } from "./ui";
import { IcCheck, IcX } from "./icons";
import "./quiz.css";

export function Quiz({ questions, onComplete, previousScore }: { questions: QuizQuestion[]; onComplete: (score: number, total: number) => void; previousScore?: { score: number; total: number } | null }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [done, setDone] = useState(false);
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);

  const finish = () => {
    setDone(true);
    onComplete(score, questions.length);
  };
  const reset = () => {
    setAnswers(questions.map(() => null));
    setDone(false);
  };

  return (
    <div className="quiz">
      <div className="row between" style={{ marginBottom: 14 }}>
        <div>
          <div className="eyebrow">Check your understanding</div>
          <h3 style={{ marginTop: 4 }}>Quick quiz</h3>
        </div>
        <div className="tiny muted-3">
          {answered}/{questions.length} answered
          {previousScore && !done && ` · last time ${previousScore.score}/${previousScore.total}`}
        </div>
      </div>
      <ol className="quiz-list">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi} className="quiz-q">
              <div className="quiz-question">
                <InlineMd text={q.q} />
              </div>
              <div className="quiz-options">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = q.answer === oi;
                  const state = chosen === null ? "" : isChosen ? (isCorrect ? "right" : "wrong") : isCorrect ? "reveal" : "";
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`quiz-opt ${state}`}
                      disabled={chosen !== null}
                      onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                    >
                      <span className="quiz-letter">{String.fromCharCode(65 + oi)}</span>
                      <span className="grow">
                        <InlineMd text={opt} />
                      </span>
                      {state === "right" && <IcCheck size={16} />}
                      {state === "wrong" && <IcX size={16} />}
                    </button>
                  );
                })}
              </div>
              {chosen !== null && (
                <div className={`quiz-explain ${chosen === q.answer ? "right" : "wrong"}`}>
                  <strong>{chosen === q.answer ? "Correct. " : "Not quite. "}</strong>
                  <InlineMd text={q.explain} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="row between wrap" style={{ marginTop: 16 }}>
        {done ? (
          <div className="quiz-result">
            You scored <strong>{score}</strong> out of {questions.length}.{" "}
            {score === questions.length ? "Full marks." : score >= questions.length / 2 ? "Solid. Re-read the parts you missed." : "Worth a second read before moving on."}
          </div>
        ) : (
          <div className="tiny muted-3">Answer every question to finish.</div>
        )}
        <div className="row">
          {done && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Retake
            </Button>
          )}
          {!done && (
            <Button variant="primary" disabled={answered < questions.length} onClick={finish}>
              Finish quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
