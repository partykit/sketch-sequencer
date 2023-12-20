import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import {
  AVAILABLE_TRACKS,
  presetSequencerTracks,
  type SequencerTrack,
  type Track,
} from "party/sequencer-shared";

export default function NewRoom() {
  const [tracks, setTracks] = useState<SequencerTrack[]>(
    presetSequencerTracks["partycore"]
  );
  const submit = useSubmit();

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    const initial = tracks.map((track) => track.type);
    if (initial.length === 0) return;
    submit({ initial }, { action: `/rooms/${newRoomId}`, method: "POST" });
  };

  const handleAddTrack = (trackType: string, track: Track) => {
    setTracks((tracks) => [
      ...tracks,
      { trackId: track.name, type: trackType } as SequencerTrack,
    ]);
  };

  const handleRemoveTrack = (trackIndex: number) => {
    setTracks((tracks) => {
      const newTracks = [...tracks];
      newTracks.splice(trackIndex, 1);
      return newTracks;
    });
  };

  const handleLoadPresent = (
    presetName: keyof typeof presetSequencerTracks
  ) => {
    if (!presetSequencerTracks[presetName]) return;
    setTracks(presetSequencerTracks[presetName]);
  };

  return (
    <>
      <h2>Tracks for room:</h2>
      <ul>
        {tracks.map((track, trackIndex) => (
          <li key={`track-${trackIndex}`}>
            {track.trackId} (type: {track.type})
            <button onClick={() => handleRemoveTrack(trackIndex)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2>Add a new track:</h2>
      <ul>
        {Object.entries(AVAILABLE_TRACKS).map(([trackType, track]) => (
          <li key={`availableTrack-${trackType}`}>
            <h3>{track.name}</h3>
            <button onClick={() => handleAddTrack(trackType, track)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      <h2>Load preset:</h2>
      <ul>
        {Object.keys(presetSequencerTracks).map((presetName) => (
          <li key={`preset-${presetName}`}>
            <h3>{presetName}</h3>
            <button
              onClick={() =>
                handleLoadPresent(
                  presetName as keyof typeof presetSequencerTracks
                )
              }
            >
              Load
            </button>
          </li>
        ))}
      </ul>
      <h2>Create Room</h2>
      <button onClick={handleCreateRoom}>Create</button>
    </>
  );
}
