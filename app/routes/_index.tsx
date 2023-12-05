import type { MetaFunction } from "partymix";

export const meta: MetaFunction = () => {
  return [
    { title: "partycore" },
    { name: "description", content: "never less than 140bpm™" },
  ];
};

export default function Index() {
  return (
    <div className="partymix_index">
      <h1>PartyMix.</h1>
      <ul>
        <li>
          <a href="/rooms/1999">PartyCore.</a>
        </li>
      </ul>
      <footer>
        <p>
          Made with <a href="https://www.partykit.io">PartyKit</a>, 2023. Code
          on <a href="https://github.com/partykit/sketch-sequencer">github</a>.
        </p>
      </footer>
    </div>
  );
}
