import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

// The user's self-reported cash/savings figure, used by the "money in real
// terms" card. Stored separately from the watchlist at
// users/{uid}/dashboard/mentor.
function mentorRef(uid: string) {
  return doc(db, "users", uid, "dashboard", "mentor");
}

export async function getCashAmount(uid: string): Promise<number | null> {
  const snap = await getDoc(mentorRef(uid));
  const value = snap.exists() ? snap.data().cashAmount : null;
  return typeof value === "number" ? value : null;
}

export async function saveCashAmount(uid: string, amount: number): Promise<void> {
  await setDoc(mentorRef(uid), { cashAmount: amount }, { merge: true });
}
