import { Link } from "react-router-dom";
import type { Block, WidgetId } from "@/content/types";
import { Callout, InlineMd } from "./ui";
import { Widget, WIDGET_META } from "./widgets";
import { IcCalc, IcExternal } from "./icons";
import "./lesson-blocks.css";

export function WidgetFrame({ widget, props, caption, compact }: { widget: WidgetId; props?: Record<string, unknown>; caption?: string; compact?: boolean }) {
  const meta = WIDGET_META[widget];
  return (
    <figure className={`widget-frame ${compact ? "compact" : ""}`}>
      <figcaption className="widget-head">
        <span className="row" style={{ gap: 8 }}>
          <span className="widget-icon">
            <IcCalc size={14} />
          </span>
          <span className="widget-title">{meta?.title ?? widget}</span>
        </span>
        <Link to={`/tools/${widget}`} className="tiny row" style={{ gap: 4 }}>
          Open in Tools <IcExternal size={12} />
        </Link>
      </figcaption>
      <div className="widget-body">
        <Widget widget={widget} props={props} />
      </div>
      {caption && (
        <div className="widget-caption">
          <InlineMd text={caption} />
        </div>
      )}
    </figure>
  );
}

export function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} index={i} />
      ))}
    </div>
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function BlockView({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <InlineMd text={block.text} />
        </p>
      );
    case "h2":
      return <h2 id={slug(block.text)}>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag>
          {block.items.map((it, i) => (
            <li key={i}>
              <InlineMd text={it} />
            </li>
          ))}
        </Tag>
      );
    }
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title}>
          <InlineMd text={block.text} />
        </Callout>
      );
    case "example":
      return (
        <div className="example">
          <div className="example-head">
            <span className="eyebrow">Worked example</span>
            <div className="example-title">{block.title}</div>
          </div>
          <ol className="example-steps">
            {block.steps.map((s, i) => (
              <li key={i}>
                <InlineMd text={s} />
              </li>
            ))}
          </ol>
          <div className="example-result">
            <span className="eyebrow">Result</span>
            <div>
              <InlineMd text={block.result} />
            </div>
          </div>
        </div>
      );
    case "table":
      return (
        <div className="table-wrap lesson-table">
          <table className="table">
            {block.caption && <caption>{block.caption}</caption>}
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <InlineMd text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "terms":
      return (
        <dl className="terms">
          {block.terms.map((t) => (
            <div className="term" key={t.term}>
              <dt>{t.term}</dt>
              <dd>
                <InlineMd text={t.def} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "quote":
      return (
        <blockquote className="lesson-quote">
          <p>
            <InlineMd text={block.text} />
          </p>
          {block.by && <cite>{block.by}</cite>}
        </blockquote>
      );
    case "steps":
      return (
        <div className="steps">
          {block.title && <div className="steps-title">{block.title}</div>}
          {block.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <div className="step-text">
                  <InlineMd text={s.text} />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case "widget":
      return <WidgetFrame widget={block.widget} props={block.props} caption={block.caption} />;
    default:
      return <div data-index={index} />;
  }
}
