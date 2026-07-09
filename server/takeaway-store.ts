export type TakeawayNumber = {
  receivedAt: string;
  number: string;
};

const numbers: TakeawayNumber[] = [];
const MAX_NUMBERS = 50;
const subscribers = new Set<(entry: TakeawayNumber) => void>();

export function addNumber(number: string) {
  const entry = { receivedAt: new Date().toISOString(), number };
  numbers.unshift(entry);
  numbers.length = Math.min(numbers.length, MAX_NUMBERS);
  for (const subscriber of subscribers) subscriber(entry);
}

export function getNumbers(): TakeawayNumber[] {
  return numbers;
}

export function clearNumbers() {
  numbers.length = 0;
}

export function subscribe(callback: (entry: TakeawayNumber) => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}
