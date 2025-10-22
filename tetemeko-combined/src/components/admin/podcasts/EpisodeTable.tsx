"use client";
import { Episode } from "@/interfaces/podcasts";
import EpisodeRow from "./EpisodeRow";

interface Props {
  episodes: Episode[];
  onEdit: (episode: Episode) => void;
  onDelete: (id: string) => void;
}

export default function EpisodeTable({ episodes, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Duration</th>
          <th className="p-2 border text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {episodes.map((ep) => (
          <EpisodeRow key={ep._id} episode={ep} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}