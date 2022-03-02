import type { Client } from "../../../client/Client";
import type { MessageEvent, GenericMessageEvent } from "../../../types/Events";

export default async (client: Client, payload: MessageEvent): Promise<void> => {
  client.emit("message", (payload as GenericMessageEvent).text);
};
