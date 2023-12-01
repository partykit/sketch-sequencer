export type Track = {
  name: string;
  color: string;
};

export const TRACK_LENGTH = 16;

export const TrackConfig: Record<string, Track> = {
  kick: {
    name: "Kick",
    color: "#ec5c3d",
  },
  snare: {
    name: "Snare",
    color: "#e34a71",
  },
  hat: {
    name: "Hat",
    color: "#6faed7",
  },
};

// docShape is the empty object for the yjs doc
// it has keys for each track:
// trackSteps: {}
// trackRange: []
// where 'track' is replaced by the key for each track
// Behaviour:
// trackSteps is a map of number 0...TRACK_LENGTH-1 to a boolean, where
// not being present is the same as false.
// trackRange is empty or has lower and upper properties,
// where each is a number 0...TRACK_LENGTH-1, defaulting to 0 for the first
// item and TRACK_LENGTH for the second.
// This is so that the empty yjs doc is still valid.
export const docShape = {} as any;

for (const track in TrackConfig) {
  docShape[`${track}Steps`] = {};
  docShape[`${track}Range`] = {};
}
