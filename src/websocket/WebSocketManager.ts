import EventEmitter from "events";
import WebSocket from "ws";
import Status from "../utils/Status";
import { handle as eventsHandle } from "./events";

import type { Client } from "../client/Client";
import { AppsConnectionsOpenResponse, WebClient } from "@slack/web-api";
import type { WebSocketMessage } from "../types/WebSocket";

export class WebSocketManager extends EventEmitter {
  /** Client which uses the manager */
  client: Client;

  /** WebSocket connection */
  websocket: WebSocket | undefined;

  /** Status of the WebSocket connection */
  status: Status;

  constructor(client: Client) {
    super();
    this.client = client;
    this.status = Status.Idle;
    this.websocket = undefined;
  }

  debug(message: string): void {
    this.client.emit("debug", `[WebSocketManager] ${message}`);
  }

  private sendMessage(id: string, payload = {}): Promise<void> {
    let msg = { envelope_id: id, paylod: payload };

    return new Promise((resolve, reject) => {
      if (this.status === Status.Idle || this.websocket === undefined)
        reject("Client is not connected");
      if (this.status === Status.Reconnecting)
        reject("Client is currently reconnecting");
      this.websocket?.send(JSON.stringify(msg), (err) => {
        if (err != undefined) {
          this.debug(
            `Could not send message to the WebSocket connection: ${err}`
          );
          return reject(err);
        }
        return resolve();
      });
    });
  }

  async handleMessage(data: string): Promise<void> {
    this.debug("Recieved a message on the WebSocket: " + data);
    let msg: WebSocketMessage;
    try {
      msg = JSON.parse(data);
    } catch (e: any) {
      this.debug(`Unable to parse the WebSocket message: ${e.message}`);
      return;
    }

    if (msg.type === "hello") {
      this.debug("Connected to Slack");
      this.status = Status.Connected;
      this.client.emit("ready");
    }

    // TODO: Handle other messages like disconnect/warnings

    const ack = async (payload: Record<string, unknown> = {}): Promise<void> =>
      await this.sendMessage(msg.envelope_id, payload);

    if (msg.type === "events_api") eventsHandle(this.client, msg, ack);
  }

  async connect(): Promise<void> {
    let socketWebClient = new WebClient(this.client.appToken);
    let res: AppsConnectionsOpenResponse =
      await socketWebClient.apps.connections.open();
    if (!res?.ok) {
      this.debug(`Not able to connect to the Slack Web API\n${res.error}`);
      throw new Error(`Not able to connect to the Slack Web API\n${res.error}`);
    }
    let ws = new WebSocket(res.url as string);
    this.websocket = ws;
    ws.on("open", () => {
      //     this.status = Status.Connected;
      this.debug("Connection established");
    });

    ws.on("message", async (msg) => {
      // console.log(JSON.parse(msg.toString("utf-8")));
      await this.handleMessage(msg.toString("utf-8"));
    });

    ws.on("close", (code, reason) => {
      this.status = Status.Idle;
    });
  }
}
