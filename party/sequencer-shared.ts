export type Track = {
  name: string;
  color: string;
  sample: string;
};

export type TrackRange = {
  lower: number;
  upper: number;
};

export type ActiveStep = Record<string, number | null>;

export const TRACK_LENGTH = 16;

export const AVAILABLE_TRACKS: Record<string, Track> = {
  kick: {
    name: "Kick",
    color: "#ec5c3d",
    sample: "/assets/kick.wav",
  },
  snare: {
    name: "Snare",
    color: "#e34a71",
    sample: "/assets/snare.wav",
  },
  hat: {
    name: "Hat",
    color: "#6faed7",
    sample: "/assets/hat.wav",
  },
  pkxmas01: {
    name: "partykit team xxx",
    color: "#999999",
    sample: "/assets/PK-XMAS-01.wav",
  },
  pkxmas02: {
    name: "christmas",
    color: "#999999",
    sample: "/assets/PK-XMAS-02.wav",
  },
  pkxmas03: {
    name: "merry",
    color: "#999999",
    sample: "/assets/PK-XMAS-03.wav",
  },
  pkxmas04: {
    name: "a very",
    color: "#999999",
    sample: "/assets/PK-XMAS-04.wav",
  },
  pkxmas05: {
    name: "all",
    color: "#999999",
    sample: "/assets/PK-XMAS-05.wav",
  },
  pkxmas06: {
    name: "you",
    color: "#999999",
    sample: "/assets/PK-XMAS-06.wav",
  },
  pkxmas07: {
    name: "wish",
    color: "#999999",
    sample: "/assets/PK-XMAS-07.wav",
  },
  pkxmas08: {
    name: "We",
    color: "#999999",
    sample: "/assets/PK-XMAS-08.wav",
  },
};

// config is an object with properties: tracks
// { sequencerId: string, trackId: string }[]
// If metadata is empty then it defaults to using TrackConfig
// sequencer is an object with key of trackId and value of:
// { range: {}, steps: {} }
export const docShape = { config: {}, sequencer: {} } as any;

export type SequencerTrack = {
  trackId: string;
  type: keyof typeof AVAILABLE_TRACKS;
};

export const presetSequencerTracks = {
  partycore: ["kick", "snare", "hat"].map(
    (trackId) =>
      ({
        trackId,
        type: trackId,
      } as SequencerTrack)
  ),
  festive: ["xmasMelody", "xmasKick", "xmasSnare", "xmasHat"].map(
    (trackId) =>
      ({
        trackId,
        type: trackId,
      } as SequencerTrack)
  ),
  click: [{ trackId: "click", type: "click" }],
};

export const defaultSequencerConfig = {
  tracks: presetSequencerTracks["partycore"],
};

// serializedRoom is an object that represents a room state so it can
// be saved and loaded
export type SerializedRoom = {
  config: {
    tracks: SequencerTrack[]; // { trackId, type }
  };
  sequencer: {
    trackId: string;
    steps: boolean[]; // must be TRACK_LENGTH long
    range: TrackRange; // i.e. object with lower and upper properties
  }[];
};
