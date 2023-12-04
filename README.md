# partycore

Multiplayer polyrhythmic drum sequencer demo using PartyKit, Yjs and Tone.js. Designed by [Mark Hurrell](https://mhurrell.co.uk).

![video](/docs/assets/demo.mp4)

## What it is

There are three fixed tracks. You can turn the steps on and off. You can change the length of the loop separately for each track.

It gets noise. People dance with their cursors.

![cursor](/docs/assets/cursors.gif)

## How it works

The app is built and served with PartyKit using the [Remix template](https://github.com/partykit/remix-starter).

Data sync uses Yjs. So the [backend party](https://github.com/partykit/sketch-sequencer/blob/main/party/sequencer.ts) doesn't do much at all. But the Yjs doc is wrapped inside a hook that provides functionality: look at [useSequencer](https://github.com/partykit/sketch-sequencer/blob/main/app/hooks/use-sequencer.tsx) for the high-level functions to edit the steps and the ranges.

The sound itself plays using the [Tone.js](https://tonejs.github.io) Web Audio framework. Have a look at the [Player component](https://github.com/partykit/sketch-sequencer/blob/main/app/components/Player.tsx) to see how the sequencer data is used to schedule the sounds.

## What next

It's hidden but this is already a multi room app. (Change the `/rooms/1999` in the URL and pick a different room ID.) So it would be fun to allow for users to pick a room, and create and share their own set of tracks from a bank of samples.
