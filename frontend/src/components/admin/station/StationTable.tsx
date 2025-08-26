import React from 'react';
import { Station } from '@/interfaces/Station';
import { deleteStation, toggleStationStatus } from '@/services/stations';

interface StationTableProps {
  stations: Station[];
  loading: boolean;
  onEdit: (station: Station) => void;
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
}

const StationTable: React.FC<StationTableProps> = ({ stations, loading, onEdit, setStations }) => {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this station?')) {
      const success = await deleteStation(id);
      if (success) {
        setStations(stations.filter((s) => s._id !== id));
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const updated = await toggleStationStatus(id);
    if (updated) {
      setStations(stations.map((s) => (s._id === updated._id ? updated : s)));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listeners</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center">Loading...</td>
            </tr>
          ) : stations.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center">No stations found</td>
            </tr>
          ) : (
            stations.map((station) => (
              <tr key={station._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={station.imageUrl || '/placeholder.png'}
                    alt={station.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{station.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{station.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{station.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {station.genre?.length ? station.genre.join(', ') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{station.listenerz ?? 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(station._id)}
                    className={`px-2 py-1 rounded ${
                      station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {station.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => onEdit(station)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(station._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StationTable;
