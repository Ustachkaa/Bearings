import { Link, useParams, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { LESSON_BY_ID, LESSONS, nextLesson, prevLesson } from "@/content/lessons";
import { MODULES } from "@/content/modules";
import { useProgress, useProgressMutations } from "@/lib/queries";
import { LessonBlocks } from "@/components/LessonBlocks";
import { Quiz } from "@/components/Quiz";
import { Badge, Button, Card, useToast } from "@/components/ui";
import { IcArrowLeft, IcArrowRight, IcCheck, IcClock } from "@/components/icons";
import "./pages.css";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function LessonPage() {
  const { id = "" } = useParams();
  const lesson = LESSON_BY_ID[id];
  const { data: progress } = useProgress();
  const { save } = useProgressMutations();
  const toast = useToast();

  const headings = useMemo(() => (lesson ? lesson.blocks.filter((b) => b.type === "h2").map((b) => (b as { text: string }).text) : []), [lesson]);
  if (!lesson) return <Navigate to="/learn" replace />;

  const module = MODULES.find((m) => m.id === lesson.module)!;
  const n = LESSONS.findIndex((l) => l.id === lesson.id) + 1;
  const prev = prevLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const p = progress?.[lesson.id];
  const moduleDone = module.lessonIds.filter((lid) => progress?.[lid]?.completed).length;

  const markComplete = () => {
    save.mutate({ lessonId: lesson.id, completed: true }, { onSuccess: () => toast.success("Lesson marked complete") });
  };

  return (
    <div className="lesson-layout">
      <article>
        <header className="lesson-header rise">
          <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
            <Link to="/learn" className="tiny row" style={{ gap: 4, textDecoration: "none" }}>
              <IcArrowLeft size={12} /> Learn
            </Link>
            <span className="tiny muted-3">/</span>
            <span className="tiny muted-3">
              Module {module.number} · {module.title}
            </span>
          </div>
          <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
            <Badge tone="brass">Lesson {n}</Badge>
            <Badge>
              <IcClock size={12} /> {lesson.minutes} min
            </Badge>
            {p?.completed && (
              <Badge tone="good">
                <IcCheck size={12} /> Completed
              </Badge>
            )}
          </div>
          <h1>{lesson.title}</h1>
          <p className="lede">{lesson.subtitle}</p>
        </header>

        <div className="rise d1">
          <LessonBlocks blocks={lesson.blocks} />
        </div>

        <section className="takeaways rise d2">
          <div className="eyebrow">Remember</div>
          <ul>
            {lesson.takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>

        <Card className="rise d3" style={{ marginTop: 28 }}>
          <Quiz
            questions={lesson.quiz}
            previousScore={p?.quizScore !== null && p?.quizScore !== undefined ? { score: p.quizScore, total: p.quizTotal ?? lesson.quiz.length } : null}
            onComplete={(score, total) => {
              save.mutate({ lessonId: lesson.id, quizScore: score, quizTotal: total, completed: true });
              toast.success(`Quiz saved: ${score}/${total}. Lesson complete.`);
            }}
          />
        </Card>

        {!p?.completed && (
          <div className="row" style={{ justifyContent: "center", marginTop: 18 }}>
            <Button variant="ghost" onClick={markComplete} icon={<IcCheck size={14} />}>
              Mark as complete without the quiz
            </Button>
          </div>
        )}

        <nav className="lesson-nav">
          {prev ? (
            <Link to={`/learn/${prev.id}`}>
              <div className="tiny row" style={{ gap: 4 }}>
                <IcArrowLeft size={12} /> Previous
              </div>
              <div className="serif">{prev.title}</div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/learn/${next.id}`} className="next">
              <div className="tiny row" style={{ gap: 4, justifyContent: "flex-end" }}>
                Next <IcArrowRight size={12} />
              </div>
              <div className="serif">{next.title}</div>
            </Link>
          ) : (
            <Link to="/explore" className="next">
              <div className="tiny">You finished the course</div>
              <div className="serif">Go explore the markets</div>
            </Link>
          )}
        </nav>
      </article>

      <aside className="lesson-side rise d2">
        <Card tight>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            In this lesson
          </div>
          <div className="toc">
            {headings.map((h) => (
              <a key={h} href={`#${slug(h)}`}>
                {h}
              </a>
            ))}
            <a href="#quiz-anchor">Quiz</a>
          </div>
        </Card>
        <Card tight>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Module {module.number}
          </div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{module.title}</div>
          <div className="progress-track" style={{ marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: `${(moduleDone / module.lessonIds.length) * 100}%` }} />
          </div>
          <div className="col" style={{ gap: 4 }}>
            {module.lessonIds.map((lid) => {
              const l = LESSON_BY_ID[lid];
              const d = progress?.[lid]?.completed;
              return (
                <Link key={lid} to={`/learn/${lid}`} className="tiny row" style={{ gap: 6, textDecoration: "none", color: lid === lesson.id ? "var(--ink)" : "var(--ink-2)", fontWeight: lid === lesson.id ? 600 : 400 }}>
                  <span style={{ width: 14, color: d ? "var(--good)" : "var(--ink-4)" }}>{d ? <IcCheck size={12} /> : "·"}</span>
                  {l.title}
                </Link>
              );
            })}
          </div>
        </Card>
      </aside>
    </div>
  );
}
