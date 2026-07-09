<template>
  <div class="board">
    <div class="columns">
      <section class="column">
        <h2>{{ isFrench ? "En cours de préparation" : "We zijn ermee bezig" }}</h2>
        <div class="numbers">
          <button
            v-for="entry in inProgress"
            :key="entry.number"
            class="number"
            @click="markReady(entry.number)"
          >
            {{ entry.number }}
          </button>
        </div>
      </section>

      <section class="column">
        <h2>{{ isFrench ? "Prêt à récupérer" : "Klaar om af te halen" }}</h2>
        <div class="numbers">
          <div v-for="entry in ready" :key="entry.number" class="number ready">
            {{ entry.number }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

type OrderStatus = "in_progress" | "ready";
type TakeawayEntry = {
  number: string;
  receivedAt: string;
  status: OrderStatus;
};

const entries = ref<TakeawayEntry[]>([]);
const isFrench = ref(false);
let eventSource: EventSource | undefined;
let languageInterval: ReturnType<typeof setInterval> | undefined;

const inProgress = computed(() => entries.value.filter((entry) => entry.status === "in_progress"));
const ready = computed(() => entries.value.filter((entry) => entry.status === "ready"));

async function markReady(number: string) {
  await fetch("/api/tickets/ready", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number }),
  });
}

onMounted(() => {
  eventSource = new EventSource("/api/tickets/stream");
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data) as { entries: TakeawayEntry[] };
    entries.value = data.entries;
  };

  languageInterval = setInterval(() => {
    isFrench.value = !isFrench.value;
  }, 8000);
});

onUnmounted(() => {
  eventSource?.close();
  if (languageInterval) clearInterval(languageInterval);
});
</script>

<style scoped>
.board {
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 40px 24px;
}
.columns {
  display: flex;
  gap: 0;
  align-items: stretch;
  max-width: 1400px;
  margin: 0 auto;
}
.column {
  flex: 1;
  text-align: center;
  padding: 0 48px;
}
.column + .column {
  border-left: 2px solid #333;
}
.column h2 {
  font-size: 2.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0 0 40px;
  color: #fff;
}
.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
.number {
  font-size: 5rem;
  font-weight: 900;
  line-height: 1;
  border: 6px solid #f59e0b;
  border-radius: 20px;
  padding: 28px 40px;
  min-width: 160px;
  background: #111;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
}
.number.ready {
  background: #14532d;
  border-color: #22c55e;
  color: #fff;
  cursor: default;
}
</style>
