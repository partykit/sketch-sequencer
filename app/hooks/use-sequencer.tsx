import { useEffect, useMemo, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc, getYjsValue } from "@syncedstore/core";
import { docShape } from "party/sequencer-shared";
import { useSyncedStore } from "@syncedstore/react";
import {
  TRACK_LENGTH,
  TrackRange,
  ActiveStep,
  SerializedRoom,
  defaultSequencerConfig,
  type SequencerTrack,
} from "party/sequencer-shared";

const PARTY = "sequencer";

export default function useSequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { partykitHost, room } = props;
  const store = syncedStore(docShape);
  const state = useSyncedStore(store);

  const [sequencerTracks, setSequencerTracks] = useState<SequencerTrack[]>(
    defaultSequencerConfig.tracks
  );

  useEffect(() => {
    if ("tracks" in state.config) {
      setSequencerTracks(state.config["tracks"]);
    }
  }, [state.config]);

  const allowedTrackId = (trackId: string) => {
    return sequencerTracks.some((track) => track.trackId === trackId);
  };

  const ensureTrackId = (trackId: string) => {
    if (!(trackId in state.sequencer)) {
      state.sequencer[trackId] = {
        steps: new Map<number, boolean>(),
        range: {},
      };
    }
  };

  const [activeStep, setActiveStep] = useState<ActiveStep>(
    sequencerTracks.reduce((acc, sequencerTrack) => {
      acc[sequencerTrack.trackId] = null;
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
    const serialized: SerializedRoom = {
      config: {
        tracks: sequencerTracks,
      },
      sequencer: sequencerTracks.map((track) => {
        return {
          trackId: track.trackId,
          steps: getSteps(track.trackId),
          range: getRange(track.trackId),
        };
      }),
    };
    return serialized;
  };

  const protocol = ["localhost", "127.0.0.1:1999", "0.0.0.0:1999"].includes(
    partykitHost
  )
    ? "http"
    : "https";
  const checkpointUrl = `${protocol}://${partykitHost}/parties/${PARTY}/${room}/checkpoint`;

  const deserialize = (serialized: SerializedRoom) => {
    setSequencerTracks(serialized.config.tracks);
    serialized.sequencer.forEach((track) => {
      const { trackId, steps, range } = track;
      steps.map((step, index) => {
        setStep(trackId, index, step);
      });
      setRange(trackId, range);
    });
  };

  const save = async () => {
    // POST the serialized room to the partykit server
    const serialized = serialize();
    const response = await fetch(checkpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serialized),
    });
    if (!response.ok) {
      throw new Error("Failed to save room");
    }
  };

  const load = async () => {
    // GET the serialized room from the partykit server
    const response = await fetch(checkpointUrl);
    if (!response.ok) {
      throw new Error("Failed to load room");
    }
    const { success, serialized } = await response.json();
    if (success) {
      deserialize(serialized);
    }
  };

  const getSteps = (trackId: string) => {
    // steps is an array of booleans of length TRACK_LENGTH
    const steps = Array(TRACK_LENGTH).fill(false);
    if (allowedTrackId(trackId)) {
      const syncedSteps = getYjsValue(state.sequencer[trackId]?.steps) as
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
    if (allowedTrackId(trackId)) {
      ensureTrackId(trackId);
      if (value) {
        state.sequencer[trackId].steps[step] = true;
      } else if (step in state.sequencer[trackId].steps) {
        delete state.sequencer[trackId].steps[step];
      }
    }
  };

  const getRange = (trackId: string) => {
    // range is an object with lower and upper properties
    const range = {
      lower: 0,
      upper: TRACK_LENGTH - 1,
    } as TrackRange;
    if (allowedTrackId(trackId)) {
      const lower = state.sequencer[trackId]?.range.lower ?? range.lower;
      const upper = state.sequencer[trackId]?.range.upper ?? range.upper;
      // Start is bounded between 0 and TRACK_LENGTH - 1
      range.lower = Math.min(Math.max(0, lower), TRACK_LENGTH - 1);
      // End is bounded between start and TRACK_LENGTH - 1
      range.upper = Math.min(Math.max(lower, upper), TRACK_LENGTH - 1);
    }
    return range;
  };

  const setRange = (trackId: string, range: TrackRange) => {
    if (!allowedTrackId(trackId)) return;
    if (range.lower < 0 || range.lower > TRACK_LENGTH - 1) return;
    if (range.upper < 0 || range.upper > TRACK_LENGTH - 1) return;
    if (range.upper < range.lower) return;

    ensureTrackId(trackId);
    state.sequencer[trackId].range.lower = range.lower;
    state.sequencer[trackId].range.upper = range.upper;
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
    sequencerTracks,
    getSteps,
    setStep,
    getRange,
    setRange,
    activeStep,
    markActive,
    markAllInactive,
    save,
    load,
  };
}
