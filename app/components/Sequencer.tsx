import useSequencer from "~/hooks/use-sequencer";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { state, getSteps, setStep, getRange, setRange } = useSequencer(props);
  const kickSteps = getSteps("kick");
  const kickRange = getRange("kick");

  const handleToggle = () => {
    setStep("kick", 0, !kickSteps[0]);
  };

  return (
    <div>
      <p>room: {props.room}</p>
      <pre>{JSON.stringify(state.toJSON(), null, 2)}</pre>
      <button onClick={handleToggle}>Toggle</button>
      <pre>{JSON.stringify(kickSteps)}</pre>
      <pre>{JSON.stringify(kickRange)}</pre>
    </div>
  );
}
