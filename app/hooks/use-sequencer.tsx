import { useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc, getYjsValue } from "@syncedstore/core";
import { docShape } from "party/sequencer-shared";
import { useSyncedStore } from "@syncedstore/react";
import { TrackConfig, TRACK_LENGTH } from "party/sequencer-shared";
import * as Y from "yjs";

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

  const getSteps = (trackId: string) => {
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

  const setStep = (trackId: string, step: number, value: boolean) => {
    if (trackId in TrackConfig) {
      if (value) {
        state[`${trackId}Steps`][step] = true;
      } else {
        delete state[`${trackId}Steps`][step];
      }
    }
  };

  const getRange = (trackId: string) => {
    // range is an object with lower and upper properties
    const range = [0, TRACK_LENGTH - 1];
    if (trackId in TrackConfig) {
      const lower = state[`${trackId}Range`].lower ?? 0;
      const upper = state[`${trackId}Range`].upper ?? TRACK_LENGTH - 1;
      console.log("getRange", lower, upper);
      // Start is bounded between 0 and TRACK_LENGTH - 1
      range[0] = Math.min(Math.max(0, lower), TRACK_LENGTH - 1);
      // End is bounded between start and TRACK_LENGTH - 1
      range[1] = Math.min(Math.max(range[0], upper), TRACK_LENGTH - 1);
    }
    console.log("returning range", range[0], range[1]);
    return range;
  };

  const setRange = (trackId: string, range: number[]) => {
    if (!(trackId in TrackConfig)) return;
    if (range.length !== 2) return;
    if (range[0] < 0 || range[0] > TRACK_LENGTH - 1) return;
    if (range[1] < 0 || range[1] > TRACK_LENGTH - 1) return;
    if (range[1] <= range[0]) return;

    console.log("setRange", trackId, range);
    state[`${trackId}Range`].lower = range[0];
    state[`${trackId}Range`].upper = range[1];
  };

  return { state, getSteps, setStep, getRange, setRange };
}
