import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api, enc } from "./api";
import type {
  AlertEvent,
  AlertRule,
  Analysis,
  AppSettings,
  Candle,
  DcaResult,
  HistoryRange,
  HistoryStats,
  Portfolio,
  Progress,
  ProjectionInput,
  ProjectionResult,
  PulseItem,
  Quote,
  RuleMeta,
  RunSummary,
  SchedulerStatus,
  SearchHit,
  Txn,
  WatchItem,
  WatchRow,
} from "./types";

const MIN = 60_000;

// ── market ──────────────────────────────────────────────────────────────────
export const usePulse = () =>
  useQuery({ queryKey: ["pulse"], queryFn: () => api.get<PulseItem[]>("/api/market/pulse"), staleTime: MIN, refetchInterval: 2 * MIN });

export const useQuote = (symbol?: string) =>
  useQuery({ queryKey: ["quote", symbol], queryFn: () => api.get<Quote>(`/api/market/quote/${enc(symbol!)}`), enabled: Boolean(symbol), staleTime: MIN });

export const useAnalysis = (symbol?: string) =>
  useQuery({
    queryKey: ["analysis", symbol],
    queryFn: () => api.get<Analysis>(`/api/market/analysis/${enc(symbol!)}`),
    enabled: Boolean(symbol),
    staleTime: 5 * MIN,
    retry: 1,
  });

export const useHistory = (symbol?: string, range: HistoryRange = "1y") =>
  useQuery({
    queryKey: ["history", symbol, range],
    queryFn: () => api.get<Candle[]>(`/api/market/history/${enc(symbol!)}?range=${range}`),
    enabled: Boolean(symbol),
    staleTime: 15 * MIN,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useStats = (symbol?: string, range: HistoryRange = "10y") =>
  useQuery({
    queryKey: ["stats", symbol, range],
    queryFn: () => api.get<HistoryStats>(`/api/market/stats/${enc(symbol!)}?range=${range}`),
    enabled: Boolean(symbol),
    staleTime: 30 * MIN,
    retry: 1,
  });

export const useSearch = (q: string) =>
  useQuery({
    queryKey: ["search", q],
    queryFn: () => api.get<SearchHit[]>(`/api/market/search?q=${enc(q)}`),
    enabled: q.trim().length >= 1,
    staleTime: 10 * MIN,
    placeholderData: keepPreviousData,
  });

export const useDca = (symbol?: string, monthly = 100, range: HistoryRange = "10y") =>
  useQuery({
    queryKey: ["dca", symbol, monthly, range],
    queryFn: () => api.get<DcaResult>(`/api/market/dca/${enc(symbol!)}?monthly=${monthly}&range=${range}`),
    enabled: Boolean(symbol) && monthly > 0,
    staleTime: 15 * MIN,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useProjection = (input: ProjectionInput | null) =>
  useQuery({
    queryKey: ["projection", input],
    queryFn: () => api.post<ProjectionResult>("/api/market/projection", input),
    enabled: Boolean(input),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });

// ── watchlist ───────────────────────────────────────────────────────────────
export const useWatchlist = () => useQuery({ queryKey: ["watchlist"], queryFn: () => api.get<WatchItem[]>("/api/watchlist"), staleTime: MIN });

export const useWatchlistOverview = () =>
  useQuery({ queryKey: ["watchlist-overview"], queryFn: () => api.get<WatchRow[]>("/api/watchlist/overview"), staleTime: 2 * MIN, refetchInterval: 5 * MIN });

export function useWatchlistMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["watchlist"] });
    qc.invalidateQueries({ queryKey: ["watchlist-overview"] });
    qc.invalidateQueries({ queryKey: ["alert-rules"] });
  };
  const add = useMutation({ mutationFn: (symbol: string) => api.post<WatchItem>("/api/watchlist", { symbol }), onSuccess: invalidate });
  const remove = useMutation({ mutationFn: (id: number) => api.del(`/api/watchlist/${id}`), onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number; notes?: string; thesis?: string }) => api.patch<WatchItem>(`/api/watchlist/${id}`, body),
    onSuccess: invalidate,
  });
  return { add, remove, update };
}

// ── alerts ──────────────────────────────────────────────────────────────────
export const useAlertMeta = () => useQuery({ queryKey: ["alert-meta"], queryFn: () => api.get<RuleMeta[]>("/api/alerts/meta"), staleTime: Infinity });
export const useAlertRules = () => useQuery({ queryKey: ["alert-rules"], queryFn: () => api.get<AlertRule[]>("/api/alerts/rules"), staleTime: MIN });
export const useAlertEvents = (limit = 100) =>
  useQuery({
    queryKey: ["alert-events", limit],
    queryFn: () => api.get<{ events: AlertEvent[]; unread: number }>(`/api/alerts/events?limit=${limit}`),
    staleTime: 30_000,
    refetchInterval: 2 * MIN,
  });
export const useAlertStatus = () =>
  useQuery({ queryKey: ["alert-status"], queryFn: () => api.get<SchedulerStatus>("/api/alerts/status"), staleTime: 30_000, refetchInterval: 2 * MIN });

export function useAlertMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["alert-rules"] });
    qc.invalidateQueries({ queryKey: ["alert-events"] });
    qc.invalidateQueries({ queryKey: ["alert-status"] });
    qc.invalidateQueries({ queryKey: ["watchlist-overview"] });
  };
  const create = useMutation({
    mutationFn: (body: { symbol?: string | null; type: string; params?: Record<string, unknown>; cooldownHours?: number }) => api.post<AlertRule>("/api/alerts/rules", body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number; enabled?: boolean; params?: Record<string, unknown>; cooldownHours?: number }) => api.patch<AlertRule>(`/api/alerts/rules/${id}`, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: (id: number) => api.del(`/api/alerts/rules/${id}`), onSuccess: invalidate });
  const run = useMutation({ mutationFn: () => api.post<RunSummary>("/api/alerts/run"), onSuccess: invalidate });
  const readAll = useMutation({ mutationFn: () => api.post("/api/alerts/events/read-all"), onSuccess: invalidate });
  const clearEvents = useMutation({ mutationFn: () => api.del("/api/alerts/events"), onSuccess: invalidate });
  const digest = useMutation({ mutationFn: () => api.post<{ ok: boolean; error?: string }>("/api/alerts/digest"), onSuccess: invalidate });
  return { create, update, remove, run, readAll, clearEvents, digest };
}

// ── portfolio ───────────────────────────────────────────────────────────────
export const usePortfolio = () => useQuery({ queryKey: ["portfolio"], queryFn: () => api.get<Portfolio>("/api/portfolio"), staleTime: MIN, refetchInterval: 3 * MIN });
export const useTransactions = () => useQuery({ queryKey: ["transactions"], queryFn: () => api.get<Txn[]>("/api/portfolio/transactions"), staleTime: MIN });

export function usePortfolioMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["portfolio"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };
  const trade = useMutation({
    mutationFn: (body: { symbol: string; side: "buy" | "sell"; qty?: number; amount?: number; price?: number; fee?: number; note?: string }) =>
      api.post<{ txn: Txn; portfolio: Portfolio }>("/api/portfolio/trade", body),
    onSuccess: invalidate,
  });
  const reset = useMutation({ mutationFn: (startingCash: number) => api.post("/api/portfolio/reset", { startingCash }), onSuccess: invalidate });
  const removeTxn = useMutation({ mutationFn: (id: number) => api.del(`/api/portfolio/transactions/${id}`), onSuccess: invalidate });
  return { trade, reset, removeTxn };
}

// ── progress ────────────────────────────────────────────────────────────────
export const useProgress = () => useQuery({ queryKey: ["progress"], queryFn: () => api.get<Record<string, Progress>>("/api/progress"), staleTime: MIN });

export function useProgressMutations() {
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: ({ lessonId, ...body }: { lessonId: string; completed?: boolean; quizScore?: number; quizTotal?: number }) => api.put<Progress>(`/api/progress/${enc(lessonId)}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
  return { save };
}

// ── settings ────────────────────────────────────────────────────────────────
export const useSettings = () => useQuery({ queryKey: ["settings"], queryFn: () => api.get<AppSettings>("/api/settings"), staleTime: 5 * MIN });

export function useSettingsMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["settings"] });
    qc.invalidateQueries({ queryKey: ["alert-status"] });
  };
  const save = useMutation({ mutationFn: (patch: Partial<AppSettings> | Record<string, unknown>) => api.put<AppSettings>("/api/settings", patch), onSuccess: invalidate });
  const testEmail = useMutation({ mutationFn: () => api.post<{ ok: boolean; error?: string }>("/api/settings/test-email") });
  const reset = useMutation({
    mutationFn: (scope: "all" | "learning" | "portfolio" | "alerts") => api.post("/api/settings/reset", { scope }),
    onSuccess: () => qc.invalidateQueries(),
  });
  return { save, testEmail, reset };
}
