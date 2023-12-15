import { AVAILABLE_TRACKS, TrackRange } from "party/sequencer-shared";
import Step from "./Step";
import Slider from "./Slider";

export default function Track(props: {
  trackId: string;
  type: keyof typeof AVAILABLE_TRACKS;
  steps: boolean[];
  setStep: (step: number, value: boolean) => void;
  range: TrackRange;
  setRange: (range: TrackRange) => void;
  activeStep: number | null;
}) {
  const { trackId, type, steps, setStep, range, setRange } = props;
  const track = AVAILABLE_TRACKS[type];

  if (!track) return null;

  return (
    <div
      className="track"
      style={{ "--ui-color": track.color } as any}
      data-loop-start={range.lower}
      data-loop-end={range.upper}
    >
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
            active={index === props.activeStep}
          />
        ))}
      </div>
      <div className="loop-range">
        <Slider range={range} setRange={setRange} />
      </div>
    </div>
  );
}
