import EventEmitter from "events";

export class Client extends EventEmitter {
  readonly token: string;
  constructor({ token }: { token: string }) {
    super();
    this.token = token;
  }
}
