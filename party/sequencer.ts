import type * as Party from "partykit/server";
import { onConnect, unstable_getYDoc, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";

export default class SequencerServer implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  constructor(public party: Party.Party) {}

  getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = {
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };
    return opts;
  }

  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.party, this.getOpts());
  }

  handleYDocChange(doc: Doc) {
    console.log("ydoc changed");
    // called on every ydoc change
    // no-op
  }
}

SequencerServer satisfies Party.Worker;
