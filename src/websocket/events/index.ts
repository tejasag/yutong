import type { Client } from "../../client/Client";
import type { WebSocketMessage } from "../../types/WebSocket";

import Message from "./handlers/Message";

export type EventHandler = (client: Client, payload: any) => void;

const events: { [key: string]: EventHandler } = {
  message: Message,
};

export async function handle(
  client: Client,
  event: WebSocketMessage,
  ack: (options: Record<string, unknown>) => Promise<void>
): Promise<void> {
  await ack({});
  const handler: any = events[event.payload.event.type as string];
  if (handler !== undefined && event.payload.event !== undefined) {
    try {
      await handler(client, event.payload.event);
    } catch (e) {
      console.error(e as Error);
    }
  }
}
