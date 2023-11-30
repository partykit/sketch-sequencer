import useSequencer from "~/hooks/use-sequencer";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { state, getTrackSteps, setTrackStep } = useSequencer(props);
  const kickSteps = getTrackSteps("kick");

  const handleToggle = () => {
    setTrackStep("kick", 0, !kickSteps[0]);
  };

  return (
    <div>
      <p>room: {props.room}</p>
      <pre>{JSON.stringify(state.toJSON(), null, 2)}</pre>
      <button onClick={handleToggle}>Toggle</button>
      <pre>{JSON.stringify(kickSteps)}</pre>
    </div>
  );
}
