import { useState } from "react";
import { TRACK_LENGTH } from "party/sequencer-shared";

const MIN = 0;
const MAX = TRACK_LENGTH - 1;

export default function Slider(props: {
  lower: number;
  upper: number;
  onChange: (values: [number, number]) => void;
}) {
  const { onChange } = props;
  const [lowerValue, setLowerValue] = useState(props.lower);
  const [upperValue, setUpperValue] = useState(props.upper);

  const handleLowerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(event.target.value), upperValue - 1);
    setLowerValue(newValue);
    onChange([newValue, upperValue]);
  };

  const handleUpperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(event.target.value), lowerValue + 1);
    setUpperValue(newValue);
    onChange([lowerValue, newValue]);
  };

  return (
    <div
      style={{ position: "relative", width: "600px", backgroundColor: "red" }}
    >
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={lowerValue}
        onChange={handleLowerChange}
        style={{ position: "absolute", width: "100%", zIndex: 1 }}
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={upperValue}
        onChange={handleUpperChange}
        style={{ position: "absolute", width: "100%", zIndex: 2 }}
      />
    </div>
  );
}
