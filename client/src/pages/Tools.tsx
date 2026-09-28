import { Link, useParams } from "react-router-dom";
import type { WidgetId } from "@/content/types";
import { LESSON_BY_ID } from "@/content/lessons";
import { Widget, WIDGET_IDS, WIDGET_META } from "@/components/widgets";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { IcArrowLeft, IcBook, IcCalc } from "@/components/icons";
import "./pages.css";

export function ToolsPage() {
  const { tool } = useParams();
  const id = tool as WidgetId | undefined;
  const meta = id ? WIDGET_META[id] : undefined;

  if (id && meta) {
    const lesson = LESSON_BY_ID[meta.lesson];
    return (
      <div>
        <div className="row wrap" style={{ gap: 8, marginBottom: 14 }}>
          <Link to="/tools" className="tiny row" style={{ gap: 4, textDecoration: "none" }}>
            <IcArrowLeft size={12} /> All tools
          </Link>
        </div>
        <PageHeader
          eyebrow="Maths lab"
          title={meta.title}
          lede={meta.blurb}
          actions={
            lesson && (
              <Button to={`/learn/${lesson.id}`} icon={<IcBook size={14} />}>
                Related lesson: {lesson.title}
              </Button>
            )
          }
        />
        <Card className="rise d1 tool-stage">
          <Widget widget={id} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Maths lab" title="Do the maths yourself" lede="Every calculator here is the arithmetic behind a lesson. Move the sliders, watch the numbers, build intuition. Nothing is saved except your risk profile." />
      <div className="tool-grid rise d1">
        {WIDGET_IDS.map((w) => {
          const m = WIDGET_META[w];
          const lesson = LESSON_BY_ID[m.lesson];
          return (
            <Link to={`/tools/${w}`} className="tool-card" key={w}>
              <span className="tool-icon">
                <IcCalc size={16} />
              </span>
              <h3>{m.title}</h3>
              <p>{m.blurb}</p>
              {lesson && (
                <div style={{ marginTop: "auto" }}>
                  <Badge>{lesson.title}</Badge>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
