import { Link } from "react-router-dom";
import { MODULES } from "@/content/modules";
import { LESSONS, LESSON_BY_ID, TOTAL_MINUTES } from "@/content/lessons";
import { useProgress } from "@/lib/queries";
import { Button, Card, PageHeader } from "@/components/ui";
import { IcArrowRight, IcCheck, IcClock } from "@/components/icons";
import "./pages.css";

export function LearnPage() {
  const { data: progress } = useProgress();
  const done = LESSONS.filter((l) => progress?.[l.id]?.completed).length;
  const next = LESSONS.find((l) => !progress?.[l.id]?.completed) ?? LESSONS[0];
  const minutesLeft = LESSONS.filter((l) => !progress?.[l.id]?.completed).reduce((a, l) => a + l.minutes, 0);
  const pctDone = Math.round((done / LESSONS.length) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="The almanac"
        title="Learn to invest, one calm lesson at a time"
        lede={`${LESSONS.length} lessons in four modules, about ${Math.round(TOTAL_MINUTES / 60)} hours in total. Every idea comes with the arithmetic and a calculator you can play with.`}
      />

      <Card className="rise d1 continue-card">
        <div>
          <div className="eyebrow">{done === 0 ? "Start here" : done === LESSONS.length ? "All done" : "Continue where you left off"}</div>
          <h3 style={{ marginTop: 6, fontSize: "1.35rem" }}>
            {next.title}
          </h3>
          <p className="muted" style={{ marginTop: 4 }}>
            {next.subtitle}
          </p>
          <div className="row" style={{ marginTop: 14, gap: 14 }}>
            <div className="progress-track" style={{ width: 200 }}>
              <div className={`progress-fill ${pctDone === 100 ? "good" : ""}`} style={{ width: `${pctDone}%` }} />
            </div>
            <span className="tiny muted-3">
              {done} of {LESSONS.length} lessons · {minutesLeft} min left
            </span>
          </div>
        </div>
        <Button variant="primary" size="lg" to={`/learn/${next.id}`} icon={<IcArrowRight size={16} />}>
          {done === 0 ? "Begin lesson 1" : "Continue"}
        </Button>
      </Card>

      {MODULES.map((m, mi) => {
        const lessons = m.lessonIds.map((id) => LESSON_BY_ID[id]);
        const mdone = lessons.filter((l) => progress?.[l.id]?.completed).length;
        return (
          <section className={`module rise d${Math.min(5, mi + 2)}`} key={m.id}>
            <div className="module-head">
              <div className="module-num">{String(m.number).padStart(2, "0")}</div>
              <div className="grow">
                <div className="row between wrap">
                  <h2>{m.title}</h2>
                  <span className="tiny muted-3">
                    {mdone}/{lessons.length} complete
                  </span>
                </div>
                <div className="muted">{m.description}</div>
              </div>
            </div>
            <div className="lesson-grid">
              {lessons.map((l, i) => {
                const p = progress?.[l.id];
                const n = LESSONS.findIndex((x) => x.id === l.id) + 1;
                return (
                  <Link to={`/learn/${l.id}`} className={`lesson-card ${p?.completed ? "done" : ""}`} key={l.id}>
                    <div className="lesson-card-top">
                      <span>Lesson {n}</span>
                      {p?.completed ? (
                        <span className="lesson-check" aria-label="Completed">
                          <IcCheck size={12} />
                        </span>
                      ) : (
                        <span className="row" style={{ gap: 4 }}>
                          <IcClock size={12} /> {l.minutes} min
                        </span>
                      )}
                    </div>
                    <h3>{l.title}</h3>
                    <p>{l.subtitle}</p>
                    {p?.quizScore !== null && p?.quizScore !== undefined && (
                      <span className="tiny muted-3" style={{ marginTop: "auto" }}>
                        Quiz {p.quizScore}/{p.quizTotal}
                      </span>
                    )}
                    <span style={{ display: "none" }}>{i}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
