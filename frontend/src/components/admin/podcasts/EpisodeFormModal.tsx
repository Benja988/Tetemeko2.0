"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Episode } from "@/interfaces/podcasts";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, id?: string) => Promise<void>;
  episode?: Episode | null;
}

export default function EpisodeFormModal({
  open,
  onClose,
  onSave,
  episode,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (episode) {
      setTitle(episode.title || "");
      setDescription(episode.description || "");
      setDuration(String(episode.duration || ""));
      setEpisodeNumber(String(episode.episodeNumber || ""));
      setTags(Array.isArray(episode.tags) ? episode.tags.join(", ") : episode.tags || "");
    } else {
      resetForm();
    }
  }, [episode]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration("");
    setEpisodeNumber("");
    setTags("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!episode && !file) {
      alert("Please upload an audio file for this episode");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", String(Number(duration)));
    formData.append("episodeNumber", String(Number(episodeNumber)));

    tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .forEach((tag) => formData.append("tags[]", tag));

    if (file) {
      formData.append("audioFile", file);
    }

    try {
      setSubmitting(true);
      await onSave(formData, episode?._id);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to save episode:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{episode ? "Edit Episode" : "Add Episode"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 w-full rounded"
            placeholder="Description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Duration (seconds)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Episode Number"
            type="number"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
            {file && <p className="text-sm mt-1">Selected: {file.name}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : episode ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
