import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  AVAILABLE_TRACKS,
  TrackRange,
  TRACK_LENGTH,
} from "party/sequencer-shared";

type Track = {
  type: keyof typeof AVAILABLE_TRACKS;
  steps: boolean[];
  range: TrackRange;
};

// Config
const BPM = 140;
const DEFAULT_STEP_DURATION = "16n"; // https://tonejs.github.io/docs/14.7.77/type/Subdivision

function equalSteps(a: boolean[], b: boolean[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function equalRange(a: TrackRange, b: TrackRange) {
  if (!a || !b) return false;
  return a.lower === b.lower && a.upper === b.upper;
}

function getSubdivision(trackId: string) {
  return AVAILABLE_TRACKS[trackId]?.duration || DEFAULT_STEP_DURATION;
}

export default function Player(props: {
  tracks: Record<string, Track>;
  markActive: (trackId: string, step: number) => void;
  markAllInactive: () => void;
}) {
  const { tracks, markActive, markAllInactive } = props;
  const tracksRef = useRef<Record<string, Track>>({});
  const [prepared, setPrepared] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Initialize the players object
  const players = useRef<Record<string, Tone.Player>>({}).current;

  // Create players for all available samples
  useEffect(() => {
    Object.entries(AVAILABLE_TRACKS).forEach(([trackId, track]) => {
      players[trackId] = new Tone.Player(track.sample).toDestination();
    });

    // Cleanup
    return () => {
      Object.values(players).forEach((player) => {
        player.dispose();
      });
    };
  }, []);

  const sequences = useRef<Record<string, Tone.Sequence>>({}).current;

  useEffect(() => {
    // Set BPM
    Tone.Transport.bpm.value = BPM;

    // Clean up sequences here too
    return () => {
      for (const seq of Object.values(sequences)) {
        //seq.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Set up all other tracks
    //console.log("Set up tracks");

    Object.entries(tracks).forEach(([trackId, track]) => {
      // We can't do anything if there's no sample
      if (!players[trackId]) return;

      //console.log("Evaluating track", trackID, track.steps, track.range);

      // Decide whether the data has changed. If there's no change
      // then don't change the sequence
      // BUG: this step sequencer works! But only if the sequences
      // are being re-created (and therefore scheduled) every single re-render
      // But if the following block is uncommented... it doesn't work,
      // and we only hear sounds if we start turning the steps on and off
      // and that coincides with transport's loop
      if (
        tracksRef.current[trackId] &&
        equalSteps(tracksRef.current[trackId].steps, track.steps) &&
        equalRange(tracksRef.current[trackId].range, track.range)
      ) {
        //console.log("No change", trackId);
        return;
      }

      if (sequences[trackId]) {
        //console.log("disposing", trackID);
        sequences[trackId].dispose(); // dispose of the old sequence
      }

      const sequenceLength = track.range.upper - track.range.lower + 1;
      const sequenceSteps = Array.from(
        { length: sequenceLength },
        (_, i) => i + track.range.lower
      );

      //console.log("Setting up sequence", trackId, track);
      sequences[trackId] = new Tone.Sequence(
        (time, step) => {
          if (track.steps[step]) {
            //console.log("Playing", trackID, step, time);
            players[trackId].start(time);
          }
          markActive(trackId, step);
        },
        sequenceSteps,
        getSubdivision(trackId)
      ).start(track.range.lower * Tone.Time("4n").toSeconds());
    });

    tracksRef.current = tracks;

    return () => {
      for (const seq of Object.values(sequences)) {
        // Sequences are disposed of at the top level of the component
        //seq.dispose();
      }
    };
  }, [players, tracks]);

  useEffect(() => {
    if (prepared) {
      Tone.start();
    }

    if (playing) {
      Tone.Transport.start();
      //console.log("Started transport", Tone.Transport.state);
    } else {
      Tone.Transport.stop();
      markAllInactive();
    }
  }, [prepared, playing]);

  return (
    <div id="player">
      {prepared === false && (
        <button onClick={() => setPrepared(true)}>Allow Audio</button>
      )}
      {prepared === true && (
        <button onClick={() => setPlaying((prev) => !prev)}>
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
