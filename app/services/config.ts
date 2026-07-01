// Base URL of the deployed MoneyMentor Worker, e.g.
//   https://moneymentor-api.<you>.workers.dev
// Set it in a .env file at the repo root (Expo inlines EXPO_PUBLIC_* at build):
//   EXPO_PUBLIC_WORKER_URL=https://moneymentor-api.<you>.workers.dev
// For local development, point it at `wrangler dev` on your machine's LAN IP,
// e.g. http://192.168.1.20:8787
//
// `process` is declared module-locally so this typechecks without the generated
// (and gitignored) expo-env.d.ts.
declare const process: { env: Record<string, string | undefined> };

export const WORKER_URL = process.env.EXPO_PUBLIC_WORKER_URL ?? "";
