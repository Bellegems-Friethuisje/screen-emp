<template>
  <div>
    <h1>Inbox</h1>
    <p>
      POST JSON to <code>/api/inbox</code> and it will show up below instantly (pushed live via
      Server-Sent Events, no polling).
    </p>
    <pre class="example">curl -X POST {{ origin }}/api/inbox \
  -H "Content-Type: application/json" \
  -d '{"hello": "world"}'</pre>

    <div class="toolbar">
      <button @click="clearAll">Clear</button>
    </div>

    <p v-if="entries.length === 0">No data received yet.</p>

    <ul class="entries">
      <li v-for="(entry, index) in entries" :key="index">
        <div class="timestamp">{{ entry.receivedAt }}</div>
        <pre>{{ JSON.stringify(entry.body, null, 2) }}</pre>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

type InboxEntry = {
  receivedAt: string;
  body: unknown;
};

const entries = ref<InboxEntry[]>([]);
const origin = typeof window !== "undefined" ? window.location.origin : "";
let eventSource: EventSource | undefined;

async function clearAll() {
  await fetch("/api/inbox", { method: "DELETE" });
  entries.value = [];
}

onMounted(() => {
  eventSource = new EventSource("/api/inbox/stream");
  eventSource.onmessage = (event) => {
    const entry = JSON.parse(event.data) as InboxEntry;
    entries.value = [entry, ...entries.value];
  };
});

onUnmounted(() => {
  eventSource?.close();
});
</script>

<style scoped>
.example {
  background: #f3f4f6;
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85em;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.toolbar button {
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9em;
}
.entries {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.entries li {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
}
.timestamp {
  font-size: 0.8em;
  color: #6b7280;
  margin-bottom: 4px;
}
.entries pre {
  margin: 0;
  overflow-x: auto;
}
</style>
