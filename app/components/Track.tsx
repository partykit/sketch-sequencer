import { TrackConfig } from "party/sequencer-shared";

export default function Track(props: { trackId: string }) {
  const { trackId } = props;
  const track = TrackConfig[trackId];

  if (!track) return null;

  return (
    <div className="track" style={{ "--ui-color": track.color } as any}>
      <h2>
        <span>{track.name}</span>
      </h2>
      <div className="steps">
        <label>
          <input id="track-1-step-1" type="checkbox" checked={true} />
          <span>1</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-2" type="checkbox" />
          <span>2</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-3" type="checkbox" />
          <span>3</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-4" type="checkbox" checked={true} />
          <span>4</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-5" type="checkbox" />
          <span>5</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-6" type="checkbox" />
          <span>6</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-7" type="checkbox" checked={true} />
          <span>7</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-8" type="checkbox" />
          <span>8</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-9" type="checkbox" />
          <span>9</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-10" type="checkbox" checked={true} />
          <span>10</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-11" type="checkbox" />
          <span>11</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-12" type="checkbox" />
          <span>12</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-13" type="checkbox" checked={true} />
          <span>13</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-14" type="checkbox" />
          <span>14</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-15" type="checkbox" checked={true} />
          <span>15</span>
          <div></div>
        </label>
        <label>
          <input id="track-1-step-16" type="checkbox" />
          <span>16</span>
          <div></div>
        </label>
      </div>
      <div className="loop-range">
        <input type="text" id="track-1-slider" />
      </div>
    </div>
  );
}
