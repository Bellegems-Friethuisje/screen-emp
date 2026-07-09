import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { addEntry, clearEntries, getEntries } from "./inbox-store";

// POST/GET/DELETE /api/inbox
// POST: accepts any JSON (or raw text) body and stores it.
// GET: returns all stored entries (used by the /inbox page to display posted data).
// DELETE: clears stored entries.
export const inboxHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (request, _context, _runtime) => {
    if (request.method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        body = await request.text();
      }
      addEntry(body);
      return new Response(JSON.stringify({ status: "OK" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (request.method === "DELETE") {
      clearEntries();
      return new Response(JSON.stringify({ status: "OK" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ entries: getEntries() }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  },
  { name: "my-app:inbox-handler", path: `/api/inbox`, method: ["GET", "POST", "DELETE"], immutable: false },
);
