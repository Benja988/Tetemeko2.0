"use client";
import Button from "@/components/ui/Button";
import { Episode } from "@/interfaces/podcasts";

interface Props {
  episode: Episode;
  onEdit: (episode: Episode) => void;
  onDelete: (id: string) => void;
}

export default function EpisodeRow({ episode, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b">
      <td className="p-2">{episode.title}</td>
      <td className="p-2">{episode.duration} mins</td>
      <td className="p-2 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => onEdit(episode)}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(episode._id)}>Delete</Button>
      </td>
    </tr>
  );
}