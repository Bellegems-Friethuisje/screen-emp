<template>
  <div class="board">
    <h1>Takeaway — Ready for Pickup</h1>
    <p>
      Send <code>CREATE_TICKET</code> webhooks to <code>{{ origin }}/api/tickets</code>. Tickets with
      <code>consumption_type: 2</code> show up below as prefix + last 2 digits of the ticket number.
    </p>

    <div class="toolbar">
      <button @click="clearAll">Clear</button>
    </div>

    <p v-if="numbers.length === 0">No takeaway tickets yet.</p>

    <div class="numbers">
      <div v-for="(entry, index) in numbers" :key="index" class="number" :class="{ latest: index === 0 }">
        {{ entry.number }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

type TakeawayNumber = {
  receivedAt: string;
  number: string;
};

const numbers = ref<TakeawayNumber[]>([]);
const origin = typeof window !== "undefined" ? window.location.origin : "";
let eventSource: EventSource | undefined;

async function clearAll() {
  await fetch("/api/tickets", { method: "DELETE" });
  numbers.value = [];
}

onMounted(() => {
  eventSource = new EventSource("/api/tickets/stream");
  eventSource.onmessage = (event) => {
    const entry = JSON.parse(event.data) as TakeawayNumber;
    numbers.value = [entry, ...numbers.value];
  };
});

onUnmounted(() => {
  eventSource?.close();
});
</script>

<style scoped>
.board {
  text-align: center;
}
.toolbar {
  display: flex;
  justify-content: center;
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
.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}
.number {
  font-size: 3rem;
  font-weight: bold;
  border: 4px solid #1d4ed8;
  border-radius: 16px;
  padding: 20px 32px;
  min-width: 100px;
}
.number.latest {
  background: #1d4ed8;
  color: white;
}
</style>
