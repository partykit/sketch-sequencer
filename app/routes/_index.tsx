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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Hello, World</h1>
      <p>
        <a href="/rooms/example-room">Example Room &rarr;</a>
      </p>
    </div>
  );
}
