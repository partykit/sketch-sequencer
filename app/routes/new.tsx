import type { MetaFunction } from "partymix";
import NewRoom from "~/components/NewRoom";

export const meta: MetaFunction = () => {
  return [
    { title: "partycore | New Room" },
    { name: "description", content: "never less than 140bpm™" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>New room</h1>
      <NewRoom />
    </div>
  );
}
