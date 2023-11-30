import useSequencer from "~/hooks/use-sequencer";

export default function Sequencer(props: {
  partykitHost: string;
  room: string;
}) {
  useSequencer(props);

  return <div>room: {props.room}</div>;
}
