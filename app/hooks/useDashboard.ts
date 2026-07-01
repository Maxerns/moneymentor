import { useCallback, useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { getDashboard } from "../services/dashboardApi";
import {
  DEFAULT_WATCHLIST,
  getWatchlist,
  saveWatchlist,
  type Watchlist,
} from "../services/watchlistService";
import type { DashboardResponse } from "../types/dashboard";

interface DashboardState {
  watchlist: Watchlist;
  data: DashboardResponse | null;
  loading: boolean; // initial load
  refreshing: boolean; // pull-to-refresh
  error: string | null;
  refresh: () => Promise<void>;
  updateWatchlist: (next: Watchlist) => Promise<void>;
}

// Loads the user's watchlist from Firestore, then the aggregated dashboard from
// the Worker keyed on it. Watchlist edits persist and re-fetch.
export function useDashboard(): DashboardState {
  const [watchlist, setWatchlist] = useState<Watchlist>(DEFAULT_WATCHLIST);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (list: Watchlist) => {
    setError(null);
    try {
      const res = await getDashboard({
        crypto: list.crypto,
        stocks: list.stocks,
        fx: list.fx,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      const list = uid
        ? await getWatchlist(uid).catch(() => DEFAULT_WATCHLIST)
        : DEFAULT_WATCHLIST;
      if (!active) return;
      setWatchlist(list);
      await fetchData(list);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [fetchData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(watchlist);
    setRefreshing(false);
  }, [fetchData, watchlist]);

  const updateWatchlist = useCallback(
    async (next: Watchlist) => {
      setWatchlist(next);
      const uid = auth.currentUser?.uid;
      if (uid) await saveWatchlist(uid, next).catch(() => undefined);
      await fetchData(next);
    },
    [fetchData],
  );

  return {
    watchlist,
    data,
    loading,
    refreshing,
    error,
    refresh,
    updateWatchlist,
  };
}
