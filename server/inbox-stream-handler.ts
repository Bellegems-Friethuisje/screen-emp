import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { getEntries, subscribe, type InboxEntry } from "./inbox-store";

function toSseMessage(entry: InboxEntry) {
  return `data: ${JSON.stringify(entry)}\n\n`;
}

// GET /api/inbox/stream — Server-Sent Events. Pushes existing entries on
// connect, then pushes each new one live as it's received (no polling).
export const inboxStreamHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (_request, _context, _runtime) => {
    let unsubscribe: (() => void) | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        for (const entry of [...getEntries()].reverse()) {
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
  { name: "my-app:inbox-stream-handler", path: `/api/inbox/stream`, method: ["GET"], immutable: false },
);
