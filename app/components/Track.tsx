import { TrackConfig } from "party/sequencer-shared";
import Step from "./Step";
import Slider from "./Slider";

export default function Track(props: {
  trackId: string;
  steps: boolean[];
  setStep: (step: number, value: boolean) => void;
  range: number[];
  setRange: (range: number[]) => void;
}) {
  const { trackId, steps, setStep, range, setRange } = props;
  const track = TrackConfig[trackId];

  if (!track) return null;

  return (
    <div className="track" style={{ "--ui-color": track.color } as any}>
      <h2>
        <span>{track.name}</span>
      </h2>
      <div className="steps">
        {steps.map((step, index) => (
          <Step
            key={index}
            stepId={index}
            checked={step}
            handleToggle={() => setStep(index, !step)}
          />
        ))}
      </div>
      <div className="loop-range">
        <Slider lower={range[0]} upper={range[1]} onChange={setRange} />
      </div>
    </div>
  );
}
