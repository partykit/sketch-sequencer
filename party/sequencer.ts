import type * as Party from "partykit/server";

export default class SequencerServer implements Party.Server {
  constructor(public party: Party.Party) {}

  onStart() {
    console.log("SequencerServer started");
  }
}

SequencerServer satisfies Party.Worker;
