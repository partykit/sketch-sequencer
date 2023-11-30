import "~/styles/global.css";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Sequencer from "~/components/Sequencer";

declare const PARTYKIT_HOST: string;
export function loader({ params }: LoaderFunctionArgs) {
  return { room: params.room!, partykitHost: PARTYKIT_HOST };
}

export default function Games() {
  const { room, partykitHost } = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <h1>PartyCore.</h1>
      </header>

      <main style={{ minHeight: "100dvh" }}>
        <section id="sequencer">
          <Sequencer partykitHost={partykitHost} room={room} />
        </section>
      </main>
    </>
  );
}
