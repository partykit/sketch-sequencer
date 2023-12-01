import useSequencer from "~/hooks/use-sequencer";
import { TrackConfig, TrackRange } from "party/sequencer-shared";
import Track from "~/components/Track";
import Player from "~/components/Player";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { state, getSteps, setStep, getRange, setRange } = useSequencer(props);

  const trackIds = Object.keys(TrackConfig);

  // We need to construct an entire tracks object here to hand to the Player
  const tracks = Object.entries(TrackConfig).reduce((acc, [trackId, track]) => {
    acc[trackId] = {
      steps: getSteps(trackId),
      range: getRange(trackId),
      sample: track.sample,
    };
    return acc;
  }, {} as any);

  return (
    <>
      {trackIds.map((trackId, index) => (
        <Track
          key={index}
          trackId={trackId}
          steps={getSteps(trackId)}
          setStep={(step: number, value: boolean) =>
            setStep(trackId, step, value)
          }
          range={getRange(trackId)}
          setRange={(range: TrackRange) => setRange(trackId, range)}
        />
      ))}
      <Player tracks={tracks} />
    </>
  );
}
