import { useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc, getYjsValue } from "@syncedstore/core";
import { docShape } from "party/sequencer-shared";
import { useSyncedStore } from "@syncedstore/react";
import { TrackConfig, TRACK_LENGTH } from "party/sequencer-shared";

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

  const getTrackSteps = (trackId: string) => {
    // steps is an object with keys 1..TRACK_LENGTH
    const steps = Array(TRACK_LENGTH).fill(false);
    if (trackId in TrackConfig) {
      const syncedSteps = getYjsValue(state[`${trackId}Steps`]) as
        | undefined
        | Map<number, boolean>;
      if (!syncedSteps) return steps;
      syncedSteps.forEach((step, index) => {
        steps[index] = step;
      });
    }
    return steps;
  };

  const setTrackStep = (trackId: string, step: number, value: boolean) => {
    if (trackId in TrackConfig) {
      if (value) {
        state[`${trackId}Steps`][step] = true;
      } else {
        delete state[`${trackId}Steps`][step];
      }
    }
  };

  return { state, getTrackSteps, setTrackStep };
}
