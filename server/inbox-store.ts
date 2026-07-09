export type InboxEntry = {
  receivedAt: string;
  body: unknown;
};

const entries: InboxEntry[] = [];
const MAX_ENTRIES = 100;

export function addEntry(body: unknown) {
  entries.unshift({ receivedAt: new Date().toISOString(), body });
  entries.length = Math.min(entries.length, MAX_ENTRIES);
}

export function getEntries(): InboxEntry[] {
  return entries;
}

export function clearEntries() {
  entries.length = 0;
}
