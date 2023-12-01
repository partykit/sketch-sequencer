import useCursorTracking from "~/presence/use-cursors";
import OtherCursors from "~/presence/other-cursors";

export default function Cursors() {
  useCursorTracking("document");
  return <OtherCursors />;
}
