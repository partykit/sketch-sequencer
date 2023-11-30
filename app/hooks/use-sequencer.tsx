import { useMemo } from "react";
import Provider from "y-partykit/provider";
import { Doc } from "yjs";

const PARTY = "sequencer";

export default function useSequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { partykitHost, room } = props;

  const { ydoc, provider } = useMemo(() => {
    const ydoc = new Doc();
    const provider = new Provider(partykitHost, room, ydoc, {
      party: PARTY,
    });
    return { ydoc, provider };
  }, []);
}
