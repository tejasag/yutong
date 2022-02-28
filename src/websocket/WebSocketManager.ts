import EventEmitter from "events";
import fetch from "node-fetch";

import type { Client } from "../client/Client";

class WebSocketManager extends EventEmitter {
  client: Client;
  status: string;

  constructor(client: Client) {
    super();
    this.client = client;
    this.status = "idle";
  }

  debug(message: string): void {
    this.client.emit(Events.Debug, `[WebSocketManager] ${message}`);
  }

  async connect() {
    const res = await fetch(
      "https://slack.com/api/apps.connections.open",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.client.token}`,
        },
      }
    ).then((r) => r.json());

    if (!res["ok"]) {
    }
  }
}
