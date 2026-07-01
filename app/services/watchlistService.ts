import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

// A user's personalized dashboard selections. Grouped by asset class, which maps
// 1:1 onto the Worker's query params. Adding a new group later (e.g. commodities)
// is purely additive.
export interface Watchlist {
  crypto: string[]; // CoinGecko ids, e.g. "bitcoin"
  stocks: string[]; // equity tickers, e.g. "AAPL"
  fx: { base: string; symbols: string[] };
}

export const DEFAULT_WATCHLIST: Watchlist = {
  crypto: ["bitcoin", "ethereum"],
  stocks: ["AAPL", "MSFT"],
  fx: { base: "GBP", symbols: ["USD", "EUR", "JPY"] },
};

function watchlistRef(uid: string) {
  return doc(db, "users", uid, "dashboard", "watchlist");
}

// Load a user's watchlist, seeding the default on first use. Missing groups fall
// back to the default so an older/partial document never breaks the dashboard.
export async function getWatchlist(uid: string): Promise<Watchlist> {
  const snap = await getDoc(watchlistRef(uid));
  if (!snap.exists()) {
    await setDoc(watchlistRef(uid), DEFAULT_WATCHLIST);
    return DEFAULT_WATCHLIST;
  }
  const data = snap.data() as Partial<Watchlist>;
  return {
    crypto: data.crypto ?? DEFAULT_WATCHLIST.crypto,
    stocks: data.stocks ?? DEFAULT_WATCHLIST.stocks,
    fx: data.fx ?? DEFAULT_WATCHLIST.fx,
  };
}

export async function saveWatchlist(
  uid: string,
  watchlist: Watchlist,
): Promise<void> {
  await setDoc(watchlistRef(uid), watchlist);
}
