import type { LinksFunction } from "partymix";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Fathom from "~/components/Fathom";
import { useLoaderData } from "@remix-run/react";

// PartyKit will inject the host into the server bundle
// so let's read it here and expose it to the client
declare const PARTYKIT_HOST: string;
export function loader({ context }) {
  return { partykitHost: PARTYKIT_HOST, ...context };
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const { partykitHost } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Fathom />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
