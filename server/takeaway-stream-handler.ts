import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { getNumbers, subscribe, type TakeawayNumber } from "./takeaway-store";

function toSseMessage(entry: TakeawayNumber) {
  return `data: ${JSON.stringify(entry)}\n\n`;
}

// GET /api/tickets/stream — Server-Sent Events for the takeaway board.
// Pushes existing numbers on connect, then each new one live as it arrives.
export const takeawayStreamHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (_request, _context, _runtime) => {
    let unsubscribe: (() => void) | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        for (const entry of [...getNumbers()].reverse()) {
          controller.enqueue(encoder.encode(toSseMessage(entry)));
        }

        unsubscribe = subscribe((entry) => {
          controller.enqueue(encoder.encode(toSseMessage(entry)));
        });
      },
      cancel() {
        unsubscribe?.();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      },
    });
  },
  { name: "my-app:takeaway-stream-handler", path: `/api/tickets/stream`, method: ["GET"], immutable: false },
);
