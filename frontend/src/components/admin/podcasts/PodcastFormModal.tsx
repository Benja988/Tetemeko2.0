"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Category } from "@/interfaces/Category";
import { Podcast } from "@/interfaces/podcasts";
import Button from "@/components/ui/Button";
import { getCategories } from "@/services/categories/categoryService";
import { getStations } from "@/services/stations";
import { podcastService } from "@/services/podcasts/podcastsService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  podcast?: Podcast | null;
}

export default function PodcastFormModal({
  open,
  onClose,
  onSuccess,
  podcast,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [station, setStation] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [stations, setStations] = useState<{ _id: string; name: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const data = await getCategories("podcast");
      setCategories(data); 
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  })();

  getStations({ limit: 50, fields: ["_id", "name"] }).then(setStations);

  if (podcast) {
    setTitle(podcast.title || "");
    setDescription(podcast.description || "");
    setCategory(podcast.category?._id || "");
    setStation(podcast.station?._id || "");
    setFile(null);
  } else {
    setTitle("");
    setDescription("");
    setCategory("");
    setStation("");
    setFile(null);
  }
}, [podcast, open]);


  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!description.trim()) {
      alert("Description is required");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    try {
      setLoading(true);

      if (file) {
        // Case 1: Upload file
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("category", category);
        if (station) formData.append("station", station);
        formData.append("coverImage", file);

        if (podcast?._id) {
          await podcastService.update(podcast._id, formData);
          alert("Podcast updated successfully");
        } else {
          await podcastService.create(formData);
          alert("Podcast created successfully");
        }
      } else {
        // Case 2: Send JSON body with coverImage URL
        const payload = {
          title: title.trim(),
          description: description.trim(),
          category,
          station: station || undefined,
          coverImage: podcast?.coverImage ||
            "https://res.cloudinary.com/dd1pvbuyg/image/upload/v1754936808/stations"
        };

        if (podcast?._id) {
          await podcastService.update(podcast._id, payload as any);
          alert("Podcast updated successfully");
        } else {
          await podcastService.create(payload as any);
          alert("Podcast created successfully");
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{podcast ? "Edit Podcast" : "Add Podcast"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <input
            className="border p-2 w-full rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Description"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Category dropdown */}
          <select
            className="border p-2 w-full rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Station dropdown (optional) */}
          <select
            className="border p-2 w-full rounded"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="">-- Select Station (Optional) --</option>
            {stations.map((st) => (
              <option key={st._id} value={st._id}>
                {st.name}
              </option>
            ))}
          </select>

          {/* Cover image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : podcast ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
