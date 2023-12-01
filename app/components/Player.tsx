import { useState } from "react";
import { TrackRange } from "party/sequencer-shared";

type Track = {
  steps: boolean[];
  range: TrackRange;
  sample: string;
};

export default function Player(props: { tracks: Record<string, Track> }) {
  const { tracks } = props;
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <button onClick={() => setPlaying((prev) => !prev)}>
        {playing ? "Stop" : "Play"}
      </button>
    </div>
  );
}
