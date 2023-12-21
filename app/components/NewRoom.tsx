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
  const [newRoomId, setNewRoomId] = useState<string>("");
  const submit = useSubmit();

  const handleCreateRoom = () => {
    const roomId =
      newRoomId.length > 0
        ? newRoomId
        : Math.random().toString(36).substring(7);
    let initial = tracks.map((track) => track.type);

    // A couple of rooms are fixed to certain track presets to avoid
    // them being overwritten in production
    switch (roomId) {
      case "1999":
        initial = presetSequencerTracks["partycore"].map((track) => track.type);
        break;
      case "carol":
        initial = presetSequencerTracks["festive"].map((track) => track.type);
        break;
    }

    if (initial.length === 0) return;
    submit({ initial }, { action: `/rooms/${roomId}`, method: "POST" });
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

  const handleLoadPreset = (presetName: keyof typeof presetSequencerTracks) => {
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
                handleLoadPreset(
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
      <label>
        <input
          type="text"
          placeholder="Room ID (default is random)"
          onChange={(e) => setNewRoomId(e.target.value)}
          value={newRoomId}
        />
        <span>
          (Appears in URL. Tracks will be replaced if the room already exists)
        </span>
      </label>
      <button onClick={handleCreateRoom}>Create</button>
    </>
  );
}
