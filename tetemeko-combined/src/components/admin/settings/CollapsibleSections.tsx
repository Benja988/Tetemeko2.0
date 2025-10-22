import { useState, ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function CollapsibleSections({ title, children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border rounded-md mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
      >
        <h2 className="font-semibold">{title}</h2>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
