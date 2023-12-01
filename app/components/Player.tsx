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

const BPM = 120;

export default function Player(props: { tracks: Record<string, Track> }) {
  const { tracks } = props;
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
    if (players._click) {
      sequences._click = new Tone.Sequence(
        (time, step) => {
          if (step % 4 === 0) {
            //console.log("Click should play now", step, time);
            players._click.start(time);
          }
        },
        Array.from(Array(16).keys()),
        "16n"
      );
      sequences._click.start(0);
    }

    Object.entries(tracks).forEach(([trackID, track]) => {
      if (!players[trackID]) return;
      sequences[trackID] = new Tone.Sequence(
        (time, step) => {
          if (track.steps[step]) {
            //console.log("Playing", trackID, step, time);
            players[trackID].start(time);
          }
        },
        Array.from(Array(16).keys()),
        "16n"
      );
      sequences[trackID].start(0);
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
