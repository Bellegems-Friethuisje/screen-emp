export type InboxEntry = {
  receivedAt: string;
  body: unknown;
};

const entries: InboxEntry[] = [];
const MAX_ENTRIES = 100;
const subscribers = new Set<(entry: InboxEntry) => void>();

export function addEntry(body: unknown) {
  const entry = { receivedAt: new Date().toISOString(), body };
  entries.unshift(entry);
  entries.length = Math.min(entries.length, MAX_ENTRIES);
  for (const subscriber of subscribers) subscriber(entry);
}

export function getEntries(): InboxEntry[] {
  return entries;
}

export function clearEntries() {
  entries.length = 0;
}

export function subscribe(callback: (entry: InboxEntry) => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}
