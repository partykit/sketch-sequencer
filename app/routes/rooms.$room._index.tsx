import "~/styles/global.css";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import PresenceProvider from "~/presence/presence-context";
import Sequencer from "~/components/Sequencer";
import Cursors from "~/components/Cursors";

declare const PARTYKIT_HOST: string;
export function loader({ params }: LoaderFunctionArgs) {
  return { room: params.room!, partykitHost: PARTYKIT_HOST };
}

export default function Games() {
  const { room, partykitHost } = useLoaderData<typeof loader>();

  return (
    <PresenceProvider
      host={partykitHost}
      room={room}
      presence={{
        name: "Anonymous DJ",
        color: "#0000f0",
      }}
    >
      <Cursors />

      <header>
        <h1>PartyCore.</h1>
      </header>

      <main style={{ minHeight: "100dvh", position: "relative" }}>
        <section id="sequencer">
          <Sequencer partykitHost={partykitHost} room={room} />
        </section>
      </main>
    </PresenceProvider>
  );
}
