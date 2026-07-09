import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { getEntries, subscribe, type TakeawayEntry } from "./takeaway-store";

function toSseMessage(entries: TakeawayEntry[]) {
  return `data: ${JSON.stringify({ entries })}\n\n`;
}

// GET /api/tickets/stream — Server-Sent Events for the takeaway board.
// Sends the full entries snapshot on connect and again on every change.
export const takeawayStreamHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (_request, _context, _runtime) => {
    let unsubscribe: (() => void) | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        controller.enqueue(encoder.encode(toSseMessage(getEntries())));

        unsubscribe = subscribe((entries) => {
          controller.enqueue(encoder.encode(toSseMessage(entries)));
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
