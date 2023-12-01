import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  TrackConfig,
  TrackRange,
  ClickTrackConfig,
} from "party/sequencer-shared";

type Track = {
  steps: boolean[];
  range: TrackRange;
};

// Config
const BPM = 150;
const ENABLE_CLICK_TRACK = false;

export default function Player(props: {
  tracks: Record<string, Track>;
  markActive: (trackId: string, step: number) => void;
  markAllInactive: () => void;
}) {
  const { tracks, markActive, markAllInactive } = props;
  const [prepared, setPrepared] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Initialize the players object
  const players = useRef<Record<string, Tone.Player>>({}).current;

  // Create players
  useEffect(() => {
    Object.entries(TrackConfig).forEach(([trackID, track]) => {
      players[trackID] = new Tone.Player(track.sample).toDestination();
    });
    players._click = new Tone.Player(ClickTrackConfig.sample).toDestination();

    // Cleanup function
    return () => {
      Object.values(players).forEach((player) => {
        player.dispose();
      });
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = BPM;

    const sequences = {} as Record<string, Tone.Sequence>;

    // Click track
    if (ENABLE_CLICK_TRACK && players._click) {
      sequences._click = new Tone.Sequence(
        (time, step) => {
          if (step % 4 === 0) {
            //console.log("Click should play now", step, time);
            players._click.start(time);
          }
        },
        Array.from(Array(16).keys()),
        "16n"
      ).start(0);
    }

    Object.entries(tracks).forEach(([trackID, track]) => {
      if (!players[trackID]) return;

      const sequenceLength = track.range.upper - track.range.lower + 1;
      const sequenceSteps = Array.from(
        { length: sequenceLength },
        (_, i) => i + track.range.lower
      );

      if (sequences[trackID]) {
        sequences[trackID].dispose(); // dispose of the old sequence
      }

      sequences[trackID] = new Tone.Sequence(
        (time, step) => {
          if (track.steps[step]) {
            //console.log("Playing", trackID, step, time);
            players[trackID].start(time);
          }
          markActive(trackID, step);
        },
        sequenceSteps,
        "16n"
      ).start(track.range.lower * Tone.Time("4n").toSeconds());
    });

    return () => {
      for (const seq of Object.values(sequences)) {
        seq.dispose();
      }
    };
  }, [players, tracks]);

  const togglePlaying = () => {
    Tone.start();
    setPlaying((prev) => {
      const newPlaying = !prev;
      if (newPlaying) {
        Tone.start(); // Required to start audio context
        Tone.Transport.start();
        console.log("Started transport", Tone.Transport.state);
      } else {
        Tone.Transport.stop();
        markAllInactive();
      }
      return newPlaying;
    });
  };

  return (
    <div>
      {prepared === false && (
        <button onClick={() => setPrepared(true)}>Allow Audio</button>
      )}
      {prepared === true && (
        <button onClick={togglePlaying}>{playing ? "Pause" : "Play"}</button>
      )}
    </div>
  );
}
