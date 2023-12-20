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
    
    <><header>
      <h1>PartyCore. let's get a new party started</h1>
      </header>

    <div id="newParty">
      <NewRoom />
    </div>
    </>
  );
}
