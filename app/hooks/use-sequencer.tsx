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
    // range is a two item array with default values
    const range = [0, TRACK_LENGTH - 1];
    if (trackId in TrackConfig) {
      const syncedRange = getYjsValue(state[`${trackId}Range`]) as
        | undefined
        | number[];
      if (!syncedRange) return range;
      if (syncedRange.length === 2) {
        // Start is bounded between 0 and TRACK_LENGTH - 1
        range[0] = Math.min(Math.max(0, syncedRange[0]), TRACK_LENGTH - 1);
        // End is bounded between start and TRACK_LENGTH - 1
        range[1] = Math.min(
          Math.max(range[0], syncedRange[1]),
          TRACK_LENGTH - 1
        );
      }
    }
    return range;
  };

  const setRange = (trackId: string, range: number[]) => {
    if (!(trackId in TrackConfig)) return;
    if (range.length !== 2) return;
    if (range[0] < 0 || range[0] > TRACK_LENGTH - 1) return;
    if (range[1] < 0 || range[1] > TRACK_LENGTH - 1) return;
    if (range[1] <= range[0]) return;

    state[`${trackId}Range`][0] = range[0];
    state[`${trackId}Range`][1] = range[1];
  };

  return { state, getSteps, setStep, getRange, setRange };
}
