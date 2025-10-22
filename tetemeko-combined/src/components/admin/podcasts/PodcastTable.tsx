"use client";
import { Podcast } from "@/interfaces/podcasts";
import PodcastRow from "./PodcastRow";

interface Props {
  podcasts: Podcast[];
  onEdit: (podcast: Podcast) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onSelect: (podcast: Podcast) => void;
}

export default function PodcastTable({ podcasts, onEdit, onDelete, onToggle, onSelect }: Props) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {podcasts.map((podcast) => (
          <PodcastRow
            key={podcast._id}
            podcast={podcast}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
      </tbody>
    </table>
  );
}