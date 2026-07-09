import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { addNumber, clearNumbers } from "./takeaway-store";

type TicketWebhook = {
  event_data?: {
    header?: {
      consumption_type?: number;
      prefix_number?: string | number | null;
      number?: number;
    };
  };
};

// POST /api/tickets — receives CREATE_TICKET webhooks. Takeaway tickets
// (consumption_type === 2) are turned into a pickup number (prefix +
// last 2 digits of the ticket number) and pushed to the takeaway board.
export const ticketHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (request, _context, _runtime) => {
    if (request.method === "DELETE") {
      clearNumbers();
      return new Response(JSON.stringify({ status: "OK" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    let payload: TicketWebhook;
    try {
      payload = (await request.json()) as TicketWebhook;
    } catch {
      return new Response(JSON.stringify({ status: "invalid JSON" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const header = payload.event_data?.header;
    if (header?.consumption_type === 2 && header.number != null) {
      const prefix = header.prefix_number != null ? String(header.prefix_number) : "";
      const lastTwoDigits = String(header.number).slice(-2);
      addNumber(`${prefix}${lastTwoDigits}`);
    }

    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  },
  { name: "my-app:ticket-handler", path: `/api/tickets`, method: ["POST", "DELETE"], immutable: false },
);
