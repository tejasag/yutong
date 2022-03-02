import { Client, WebSocketManager } from "../dist/index.js";

import "dotenv/config";

let token = process.env.SLACK_TOKEN;
let appToken = process.env.SLACK_APP_TOKEN;

const client = new Client({
  token: token,
  appToken: appToken,
});

//client.on("debug", (i) => console.log(i));

client.on("ready", () => {
  console.log("Logged in!");
});

client.on("message", (msg) => {
  console.log(msg);
});

client.login();
