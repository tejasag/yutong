import EventEmitter from "events";
import { WebClient } from "@slack/web-api";
import { WebSocketManager } from "../websocket/WebSocketManager";

import type { ClientOptions } from "../types/Client";

export class Client extends EventEmitter {
  /** Bot OAuth Token */
  readonly token: string;

  /** Bot Application-level Token */
  readonly appToken: string;

  /** Bot REST Client */
  rest: WebClient;

  /** WebSocket connection */
  ws: WebSocketManager;

  constructor({ token, appToken }: ClientOptions) {
    super();
    this.token = token;
    this.appToken = appToken;
    this.rest = new WebClient(this.token);
    this.ws = new WebSocketManager(this);
  }

  /** Activate the bot */
  async login(): Promise<void> {
    await this.ws.connect();
  }
}
