import { useEffect, useState } from "react";
import { TRACK_LENGTH, TrackRange } from "party/sequencer-shared";

const MIN = 0;
const MAX = TRACK_LENGTH - 1;

export default function Slider(props: {
  range: TrackRange;
  setRange: (range: TrackRange) => void;
}) {
  const { setRange } = props;
  const [lowerValue, setLowerValue] = useState(props.range.lower);
  const [upperValue, setUpperValue] = useState(props.range.upper);

  const handleLowerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(event.target.value), upperValue - 1);
    setLowerValue(newValue);
    setRange({ lower: newValue, upper: upperValue });
  };

  const handleUpperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(event.target.value), lowerValue + 1);
    setUpperValue(newValue);
    setRange({ lower: lowerValue, upper: newValue });
  };

  useEffect(() => {
    setLowerValue(props.range.lower);
    setUpperValue(props.range.upper);
  }, [props.range]);

  return (
    <div
      style={{ position: "relative", width: "600px", backgroundColor: "red" }}
    >
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={lowerValue}
        onChange={(e) => handleLowerChange(e)}
        style={{ position: "absolute", width: "100%", zIndex: 1 }}
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={upperValue}
        onChange={(e) => handleUpperChange(e)}
        style={{ position: "absolute", width: "100%", zIndex: 2 }}
      />
    </div>
  );
}
