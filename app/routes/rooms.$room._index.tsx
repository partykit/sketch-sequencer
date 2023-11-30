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
    <main className="p-6 bg-stone-100" style={{ minHeight: "100dvh" }}>
      <Sequencer partykitHost={partykitHost} room={room} />
    </main>
  );
}
