import { useState } from "react";

export default function Notification() {
  const [enabled, setEnabled] = useState(false);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
        className="w-4 h-4"
      />
      <span>{enabled ? "Enabled" : "Disabled"}</span>
    </label>
  );
}
