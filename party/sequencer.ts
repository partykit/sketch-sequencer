import type * as Party from "partykit/server";
import { onConnect, unstable_getYDoc, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";
import type { SerializedRoom } from "./sequencer-shared";

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
    //console.log("ydoc changed");
    // called on every ydoc change
    // no-op
  }

  async onRequest(req: Party.Request) {
    // /checkpoint is used to store a saved room state

    const url = new URL(req.url);

    if (!url.pathname.endsWith("/checkpoint")) {
      return new Response("Not found", { status: 404 });
    }

    if (req.method === "POST") {
      const serialized = (await req.json()) as SerializedRoom;
      await this.party.storage.put("checkpoint", serialized);
      return Response.json({ success: true });
    } else if (req.method === "GET") {
      const serialized = (await this.party.storage.get(
        "checkpoint"
      )) as null | SerializedRoom;
      const response = {
        success: serialized !== null,
        serialized,
      };
      return Response.json(response);
    }

    console.log("returning 405");

    return new Response("Method not allowed", { status: 405 });
  }
}

SequencerServer satisfies Party.Worker;
