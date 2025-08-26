import React, { useState, useEffect } from 'react';
import { Station, StationFormData } from '@/interfaces/Station';
import StationForm from './StationForm';
import { createStation, updateStation } from '@/services/stations';

const StationModal = ({ isOpen, onClose, editingStation, setStations, stations }: any) => {
  const [formData, setFormData] = useState<StationFormData>({
    name: '',
    description: '',
    streamUrl: '',
    imageUrl: '',
    location: '',
    genres: '',
    isActive: true,
    type: 'Radio Station',
    liveShow: '',
    listenerz: '0',
    frequency: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStation) {
      setFormData({
        name: editingStation.name,
        description: editingStation.description,
        streamUrl: editingStation.streamUrl,
        imageUrl: editingStation.imageUrl, // keep original url
        location: editingStation.location,
        genres: editingStation.genre?.join(', ') || '',
        isActive: editingStation.isActive,
        type: editingStation.type,
        liveShow: editingStation.liveShow,
        listenerz: editingStation.listenerz?.toString() || '0',
        frequency: editingStation.frequency,
      });
      setImageFile(null); // reset imageFile
    }
  }, [editingStation]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
  };

  // helper: convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // if a new file is selected, convert to base64 for backend
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      const stationData = {
        ...formData,
        genre: formData.genres
          .split(',')
          .map((g) => g.trim().toLowerCase())
          .filter(Boolean),
        listenerz: parseInt(formData.listenerz) || 0,
        imageUrl, // base64 if new file, old url otherwise
      };

      if (editingStation) {
        const updated = await updateStation(editingStation._id, stationData);
        if (updated) {
          setStations(
            stations.map((s: Station) => (s._id === updated._id ? updated : s))
          );
        }
      } else {
        const created = await createStation(stationData);
        if (created) {
          setStations([...stations, created]);
        }
      }
      onClose();
    } catch (err) {
      console.error('Error saving station:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingStation ? 'Edit Station' : 'Create Station'}
        </h2>
        <StationForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isEditing={!!editingStation}
          loading={loading}
          onFileChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default StationModal;
