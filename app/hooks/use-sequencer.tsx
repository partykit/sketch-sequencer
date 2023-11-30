import { useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { docShape } from "party/sequencer-shared";
import { useSyncedStore } from "@syncedstore/react";

const PARTY = "sequencer";

export default function useSequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { partykitHost, room } = props;
  const store = syncedStore(docShape);
  const state = useSyncedStore(store);

  const { provider } = useMemo(() => {
    const ydoc = getYjsDoc(store);
    const provider = new YPartyKitProvider(partykitHost, room, ydoc, {
      party: PARTY,
    });
    return { provider };
  }, []);

  return { state };
}
