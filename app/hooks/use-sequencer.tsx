import { useMemo, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc, getYjsValue } from "@syncedstore/core";
import { docShape } from "party/sequencer-shared";
import { useSyncedStore } from "@syncedstore/react";
import {
  TrackConfig,
  TRACK_LENGTH,
  TrackRange,
  ActiveStep,
  SerializedRoom,
} from "party/sequencer-shared";

const PARTY = "sequencer";

export default function useSequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { partykitHost, room } = props;
  const store = syncedStore(docShape);
  const state = useSyncedStore(store);
  const [activeStep, setActiveStep] = useState<ActiveStep>(
    Object.entries(TrackConfig).reduce((acc, [trackId, _]) => {
      acc[trackId] = null;
      return acc;
    }, {} as ActiveStep)
  );

  const { provider } = useMemo(() => {
    const ydoc = getYjsDoc(store);
    const provider = new YPartyKitProvider(partykitHost, room, ydoc, {
      party: PARTY,
    });
    return { provider };
  }, []);

  const serialize = () => {
    const trackIds = Object.keys(TrackConfig);
    const serialized: SerializedRoom = {
      tracks: trackIds.map((trackId) => {
        return {
          trackId,
          steps: getSteps(trackId),
          range: getRange(trackId),
        };
      }),
    };
    return serialized;
  };

  const deserialize = (serialized: SerializedRoom) => {
    serialized.tracks.forEach((track) => {
      const { trackId, steps, range } = track;
      if (trackId in TrackConfig) {
        steps.map((step, index) => {
          setStep(trackId, index, step);
        });
        setRange(trackId, range);
      }
    });
  };

  const getSteps = (trackId: string) => {
    // steps is an array of booleans of length TRACK_LENGTH
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
    const range = {
      lower: 0,
      upper: TRACK_LENGTH - 1,
    } as TrackRange;
    if (trackId in TrackConfig) {
      const lower = state[`${trackId}Range`].lower ?? range.lower;
      const upper = state[`${trackId}Range`].upper ?? range.upper;
      // Start is bounded between 0 and TRACK_LENGTH - 1
      range.lower = Math.min(Math.max(0, lower), TRACK_LENGTH - 1);
      // End is bounded between start and TRACK_LENGTH - 1
      range.upper = Math.min(Math.max(lower, upper), TRACK_LENGTH - 1);
    }
    return range;
  };

  const setRange = (trackId: string, range: TrackRange) => {
    if (!(trackId in TrackConfig)) return;
    if (range.lower < 0 || range.lower > TRACK_LENGTH - 1) return;
    if (range.upper < 0 || range.upper > TRACK_LENGTH - 1) return;
    if (range.upper < range.lower) return;

    state[`${trackId}Range`].lower = range.lower;
    state[`${trackId}Range`].upper = range.upper;
  };

  const markActive = (trackId: string, step: number | null) => {
    setActiveStep((prev) => {
      return { ...prev, [trackId]: step };
    });
  };

  const markAllInactive = () => {
    setActiveStep((prev) => {
      return Object.entries(prev).reduce((acc, [trackId, _]) => {
        acc[trackId] = null;
        return acc;
      }, {} as ActiveStep);
    });
  };

  return {
    state,
    getSteps,
    setStep,
    getRange,
    setRange,
    activeStep,
    markActive,
    markAllInactive,
  };
}
