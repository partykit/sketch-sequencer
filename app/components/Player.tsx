import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  TrackConfig,
  TrackRange,
  ClickTrackConfig,
  TRACK_LENGTH,
} from "party/sequencer-shared";

type Track = {
  steps: boolean[];
  range: TrackRange;
};

// Config
const BPM = 140;
const ENABLE_CLICK_TRACK = true;

function equalSteps(a: boolean[], b: boolean[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function equalRange(a: TrackRange, b: TrackRange) {
  if (!a || !b) return false;
  return a.lower === b.lower && a.upper === b.upper;
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

  const sequences = useRef<Record<string, Tone.Sequence>>({}).current;

  useEffect(() => {
    // Set BPM
    Tone.Transport.bpm.value = BPM;
    //Tone.Transport.loop = true;
    //Tone.Transport.loopStart = "0:0:0";
    //Tone.Transport.loopEnd = `${(TRACK_LENGTH / 16).toString()}:0:0`;
  }, []);

  useEffect(() => {
    // Set up the click track
    let clickSequence: Tone.Sequence | null = null;
    if (ENABLE_CLICK_TRACK && players._click) {
      console.log("Setting up click track");
      clickSequence = new Tone.Sequence(
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

    return () => {
      if (clickSequence) {
        clickSequence.dispose();
      }
    };
  }, [players]);

  useEffect(() => {
    // Set up all other tracks
    console.log("Set up tracks");

    Object.entries(tracks).forEach(([trackID, track]) => {
      // We can't do anything if there's no sample
      if (!players[trackID]) return;

      console.log("Evaluating track", trackID, track.steps, track.range);

      // Decide whether the data has changed. If there's no change
      // then don't change the sequence
      // BUG: this step sequencer works! But only if the sequences
      // are being re-created (and therefore scheduled) every single re-render
      // But if the following block is uncommented... it doesn't work,
      // and we only hear sounds if we start turning the steps on and off
      // and that coincides with transport's loop
      // HOWEVER! the click track works happily, without needing a re-render
      // to schedule it
      /*
      if (
        tracksRef.current[trackID] &&
        equalSteps(tracksRef.current[trackID].steps, track.steps) &&
        equalRange(tracksRef.current[trackID].range, track.range)
      ) {
        console.log("No change", trackID);
        return;
      }
      */

      if (sequences[trackID]) {
        console.log("disposing", trackID);
        sequences[trackID].dispose(); // dispose of the old sequence
      }

      const sequenceLength = track.range.upper - track.range.lower + 1;
      const sequenceSteps = Array.from(
        { length: sequenceLength },
        (_, i) => i + track.range.lower
      );

      console.log("Setting up sequence", trackID, sequenceSteps);
      sequences[trackID] = new Tone.Sequence(
        (time, step) => {
          if (track.steps[step]) {
            console.log("Playing", trackID, step, time);
            players[trackID].start(time);
          }
          markActive(trackID, step);
        },
        sequenceSteps,
        "16n"
      ).start(track.range.lower * Tone.Time("4n").toSeconds());
    });

    tracksRef.current = tracks;

    return () => {
      for (const seq of Object.values(sequences)) {
        seq.dispose();
      }
    };
  }, [players, tracks]);

  useEffect(() => {
    if (prepared) {
      Tone.start();
    }

    if (playing) {
      Tone.Transport.start();
      console.log("Started transport", Tone.Transport.state);
      console.log(
        "seconds",
        Tone.Transport.seconds,
        "loop",
        Tone.Transport.loop,
        "loopStart",
        Tone.Transport.loopStart,
        "loopEnd",
        Tone.Transport.loopEnd
      );
    } else {
      Tone.Transport.stop();
      markAllInactive();
    }
  }, [prepared, playing]);

  return (
    <div>
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
