import useSequencer from "~/hooks/use-sequencer";
import { TrackRange, type SequencerTrack, presetSequencerTracks } from "party/sequencer-shared";
import Track from "~/components/Track";
import Player from "~/components/Player";
import Snow from "~/components/Snow";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
  initialTrackTypes: string[];
}) {
  const {
    synced,
    getSequencerTracks,
    getSteps,
    setStep,
    getRange,
    setRange,
    activeStep,
    markActive,
    markAllInactive,
    save,
    load,
  } = useSequencer(props);

  const sequencerTracks: SequencerTrack[] = getSequencerTracks();

  // We need to check where sequencerTracks matches presetSequencerTracks["festive"]
  const isFestive = sequencerTracks.every((track, index) => {
    return track.trackId === presetSequencerTracks["festive"][index].trackId;
  });

  // We need to construct an entire tracks object here to hand to the Player
  const tracks = sequencerTracks.reduce((acc, track) => {
    acc[track.trackId] = {
      type: track.type,
      steps: getSteps(track.trackId),
      range: getRange(track.trackId),
    };
    return acc;
  }, {} as any);

  if (!synced) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isFestive && <Snow />}
      {sequencerTracks.map((track, index) => (
        <Track
          key={index}
          trackId={track.trackId}
          type={track.type}
          steps={getSteps(track.trackId)}
          setStep={(step: number, value: boolean) =>
            setStep(track.trackId, step, value)
          }
          range={getRange(track.trackId)}
          setRange={(range: TrackRange) => setRange(track.trackId, range)}
          activeStep={activeStep[track.trackId] ?? null}
        />
      ))}
      <Player
        tracks={tracks}
        markActive={markActive}
        markAllInactive={markAllInactive}
      />
      <div id="checkpoint" style={{ display: "none" }}>
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
      </div>
    </>
  );
}
