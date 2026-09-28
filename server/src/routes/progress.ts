import { Router } from "express";
import { z } from "zod";
import { data, nowIso, save } from "../db.js";
import { bad } from "../lib/http.js";

export const progressRouter = Router();

progressRouter.get("/", (_req, res) => {
  res.json(data.progress);
});

progressRouter.put("/:lessonId", (req, res) => {
  const parsed = z
    .object({ completed: z.boolean().optional(), quizScore: z.number().min(0).optional(), quizTotal: z.number().min(0).optional() })
    .safeParse(req.body);
  if (!parsed.success) throw bad("invalid body");
  const id = req.params.lessonId;
  const prev = data.progress[id] ?? { lessonId: id, completed: false, quizScore: null, quizTotal: null, completedAt: null, updatedAt: nowIso() };
  const next = { ...prev, updatedAt: nowIso() };
  if (parsed.data.quizScore !== undefined) next.quizScore = parsed.data.quizScore;
  if (parsed.data.quizTotal !== undefined) next.quizTotal = parsed.data.quizTotal;
  if (parsed.data.completed !== undefined) {
    next.completed = parsed.data.completed;
    next.completedAt = parsed.data.completed ? prev.completedAt ?? nowIso() : null;
  }
  data.progress[id] = next;
  save();
  res.json(next);
});

progressRouter.delete("/", (_req, res) => {
  data.progress = {};
  save();
  res.json({ ok: true });
});
