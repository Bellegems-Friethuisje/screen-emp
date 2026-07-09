export type OrderStatus = "in_progress" | "ready";

export type TakeawayEntry = {
  number: string;
  receivedAt: string;
  status: OrderStatus;
};

const entries: TakeawayEntry[] = [];
const MAX_ENTRIES = 50;
const subscribers = new Set<(entries: TakeawayEntry[]) => void>();

function notify() {
  const snapshot = [...entries];
  for (const subscriber of subscribers) subscriber(snapshot);
}

export function addEntry(number: string) {
  entries.unshift({ number, receivedAt: new Date().toISOString(), status: "in_progress" });
  entries.length = Math.min(entries.length, MAX_ENTRIES);
  notify();
}

// No automated "order ready" event exists yet — this is called manually
// (from the board itself) until a real trigger is wired up.
export function markReady(number: string) {
  const entry = entries.find((candidate) => candidate.number === number && candidate.status === "in_progress");
  if (entry) {
    entry.status = "ready";
    notify();
  }
}

export function getEntries(): TakeawayEntry[] {
  return entries;
}

export function clearEntries() {
  entries.length = 0;
  notify();
}

export function subscribe(callback: (entries: TakeawayEntry[]) => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}
