import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { markReady } from "./takeaway-store";

// POST /api/tickets/ready — marks a pickup number as ready. Manual for now
// (clicked from the board itself) until a real "order ready" signal exists.
export const takeawayReadyHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (request, _context, _runtime) => {
    const { number } = (await request.json()) as { number?: string };
    if (number) markReady(number);

    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  },
  { name: "my-app:takeaway-ready-handler", path: `/api/tickets/ready`, method: ["POST"], immutable: false },
);
