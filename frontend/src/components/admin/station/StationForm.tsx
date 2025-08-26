import React from 'react';
import { StationFormData } from '@/interfaces/Station';

interface StationFormProps {
    formData: StationFormData;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isEditing: boolean;
    loading: boolean;
    onFileChange: (file: File | null) => void; // ✅ new
}

const StationForm: React.FC<StationFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isEditing,
    loading,
    onFileChange,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                    <option value="Radio Station">Radio Station</option>
                    <option value="TV Station">TV Station</option>
                </select>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Genres */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Genres (comma-separated)</label>
                <input
                    type="text"
                    name="genres"
                    value={formData.genres}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Stream URL */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Stream URL</label>
                <input
                    type="url"
                    name="streamUrl"
                    value={formData.streamUrl}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                            // Preview immediately
                            const previewUrl = URL.createObjectURL(file);
                            onFileChange(file);
                            // ⚡ Update formData.imageUrl so preview works
                            onChange({
                                target: { name: "imageUrl", value: previewUrl },
                            } as unknown as React.ChangeEvent<HTMLInputElement>);
                        } else {
                            onFileChange(null);
                        }
                    }}
                    className="mt-1 block w-full text-sm text-gray-500"
                />
                {formData.imageUrl && (
                    <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="mt-2 h-24 w-24 object-cover rounded"
                    />
                )}
            </div>


            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Listeners */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Listeners</label>
                <input
                    type="number"
                    name="listenerz"
                    value={formData.listenerz}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Frequency */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Live Show */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Live Show</label>
                <input
                    type="text"
                    name="liveShow"
                    value={formData.liveShow}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Active */}
            <div>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={onChange}
                        className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default StationForm;
