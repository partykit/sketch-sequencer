import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "partymix";

// PartyKit will inject the host into the server bundle
// so let's read it here and expose it to the client
declare const PARTYKIT_HOST: string;
export function loader() {
  return { partykitHost: PARTYKIT_HOST };
}

export const meta: MetaFunction = () => {
  return [
    { title: "partycore" },
    { name: "description", content: "never less than 150bpm™" },
  ];
};

export default function Index() {
  const { partykitHost } = useLoaderData<typeof loader>();

  return (
    <div className="partymix_index">
      <h1>PartyMix.</h1>
      <ul>
        <li><a href="/rooms/example-room">PartyCore.</a></li>
      </ul>
      <footer>
        <p>Made with <a href="htts://partykit.io">PartyKit</a>, 2023.</p>  
      </footer>
    </div>
  );
}

