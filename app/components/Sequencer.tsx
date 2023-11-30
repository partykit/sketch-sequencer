import useSequencer from "~/hooks/use-sequencer";
import { useEffect } from "react";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
}) {
  const { state } = useSequencer(props);
  const kickSteps = state.kickSteps;

  useEffect(() => {
    kickSteps[0] = true;
  }, []);

  const handleToggle = () => {
    kickSteps[0] = !kickSteps[0];
  };

  return (
    <div>
      <p>room: {props.room}</p>
      <pre>{JSON.stringify(state.toJSON(), null, 2)}</pre>
      <button onClick={handleToggle}>Toggle</button>
    </div>
  );
}
