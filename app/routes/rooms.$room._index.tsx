import "~/styles/global.css";
import { useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "partymix";
import PresenceProvider from "~/presence/presence-context";
import Sequencer from "~/components/Sequencer";
import Cursors from "~/components/Cursors";

type LoaderData = {
  room: string;
  partykitHost: string;
};

declare const PARTYKIT_HOST: string;
export function loader({ params }: LoaderFunctionArgs): LoaderData {
  return { room: params.room!, partykitHost: PARTYKIT_HOST };
}

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `partycore | ${(data as LoaderData).room}` },
    { name: "description", content: "never less than 140bpm™" },
  ];
};

export async function action({ request }: { request: Request }) {
  // initial tracks can be passed in via POST
  const body = await request.formData();
  const initial = body.get("initial") as string | undefined;
  const initialTrackTypes = initial ? initial.split(",") : [];
  return initialTrackTypes;
}

export default function Games() {
  const { room, partykitHost } = useLoaderData<typeof loader>();
  const initialTrackTypes = useActionData<string[]>() ?? [];

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
          <Sequencer
            partykitHost={partykitHost}
            room={room}
            initialTrackTypes={initialTrackTypes}
          />
        </section>
      </main>

      <footer>
        <p>
          <strong>Never less than 140bpm&trade;</strong> because everything’s
          better with friends, 2023.
        </p>
      </footer>
    </PresenceProvider>
  );
}
