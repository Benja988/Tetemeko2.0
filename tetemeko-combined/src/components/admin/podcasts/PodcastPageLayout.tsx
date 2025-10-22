// src/components/podcasts/PodcastPageLayout.tsx
"use client";
import { useEffect, useState } from "react";
import { Podcast, Episode } from "@/interfaces/podcasts";
import PodcastTable from "./PodcastTable";
import { podcastService } from "@/services/podcasts/podcastsService";
import { episodeService } from "@/services/episodes/episodeServices";
import Loader from "@/components/Loader";
import Button from "@/components/ui/Button";
import EpisodeTable from "./EpisodeTable";
import PodcastFormModal from "./PodcastFormModal";
import EpisodeFormModal from "./EpisodeFormModal";
import ConfirmDialog from "./ConfirmDialog";

export default function PodcastPageLayout() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modals
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);

  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; type: "podcast" | "episode" | null }>({
    open: false,
    id: null,
    type: null,
  });

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const data = await podcastService.getAll();
      setPodcasts(data.podcasts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async (podcastId: string) => {
    const data = await episodeService.getAll(podcastId);
    setEpisodes(data.episodes);
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  // CRUD podcast
  const handleSavePodcast = async (formData: FormData, id?: string) => {
    if (id) await podcastService.update(id, formData);
    else await podcastService.create(formData);
    setShowPodcastModal(false);
    fetchPodcasts();
  };

  const handleDeletePodcast = async (id: string) => {
    await podcastService.delete(id);
    fetchPodcasts();
  };

  // CRUD episode
  const handleSaveEpisode = async (formData: FormData, id?: string) => {
    if (!selectedPodcast) return;
    if (id) await episodeService.update(selectedPodcast._id, id, formData);
    else await episodeService.create(selectedPodcast._id, formData);
    setShowEpisodeModal(false);
    fetchEpisodes(selectedPodcast._id);
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!selectedPodcast) return;
    await episodeService.delete(selectedPodcast._id, id);
    fetchEpisodes(selectedPodcast._id);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Podcasts</h1>
        <Button onClick={() => { setEditingPodcast(null); setShowPodcastModal(true); }}>+ Add Podcast</Button>
      </div>

      <PodcastTable
        podcasts={podcasts}
        onEdit={(p) => { setEditingPodcast(p); setShowPodcastModal(true); }}
        onDelete={(id) => setConfirmDelete({ open: true, id, type: "podcast" })}
        onToggle={async (id) => { await podcastService.toggleStatus(id); fetchPodcasts(); }}
        onSelect={(p) => { 
    setSelectedPodcast(p); 
    fetchEpisodes(p._id); 
  }}
      />

      {selectedPodcast && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Episodes of {selectedPodcast.title}</h2>
            <Button onClick={() => { setEditingEpisode(null); setShowEpisodeModal(true); }}>+ Add Episode</Button>
          </div>
          <EpisodeTable
            episodes={episodes}
            onEdit={(e) => { setEditingEpisode(e); setShowEpisodeModal(true); }}
            onDelete={(id) => setConfirmDelete({ open: true, id, type: "episode" })}
          />
        </div>
      )}

      {/* Modals */}
      <PodcastFormModal
        open={showPodcastModal}
        onClose={() => setShowPodcastModal(false)}
        onSuccess={fetchPodcasts}
        podcast={editingPodcast}
      />
      <EpisodeFormModal
        open={showEpisodeModal}
        onClose={() => setShowEpisodeModal(false)}
        onSave={handleSaveEpisode}
        episode={editingEpisode}
      />

      {/* Delete dialog */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Confirm Delete"
        message="Are you sure you want to delete this?"
        onConfirm={() => {
          if (confirmDelete.type === "podcast" && confirmDelete.id) handleDeletePodcast(confirmDelete.id);
          if (confirmDelete.type === "episode" && confirmDelete.id) handleDeleteEpisode(confirmDelete.id);
          setConfirmDelete({ open: false, id: null, type: null });
        }}
        onClose={() => setConfirmDelete({ open: false, id: null, type: null })}
      />
    </div>
  );
}
