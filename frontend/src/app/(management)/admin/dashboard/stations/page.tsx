'use client';

import React, { useState, useEffect } from 'react';
import { Station, StationFormData } from '@/interfaces/Station';
import { getStations } from '@/services/stations';
import StationTable from '@/components/admin/station/StationTable';
import StationModal from '@/components/admin/station/StationModal';


const StationsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch stations on mount
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    const data = await getStations({ limit: 100, fields: [] });
    setStations(data);
    setLoading(false);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stations Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Station
        </button>
      </div>

      <StationTable
        stations={stations}
        loading={loading}
        onEdit={handleEdit}
        setStations={setStations}
      />

      <StationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingStation={editingStation}
        setStations={setStations}
        stations={stations}
      />
    </div>
  );
};

export default StationsPage;