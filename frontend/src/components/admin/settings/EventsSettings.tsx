// components/admin/settings/EventsSettings.tsx

export default function EventsSettings() {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Upcoming Event</label>
      <input type="text" placeholder="Event Name" className="w-full px-3 py-2 border rounded-md text-sm" />
      <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
      <textarea placeholder="Event Details" className="w-full px-3 py-2 border rounded-md text-sm" rows={3} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Add Event</button>
    </div>
  );
}
