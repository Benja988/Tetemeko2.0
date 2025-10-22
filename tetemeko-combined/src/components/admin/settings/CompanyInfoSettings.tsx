// components/admin/settings/CompanyInfoSettings.tsx

export default function CompanyInfoSettings() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Company Name</label>
        <input type="text" className="w-full px-3 py-2 border rounded-md text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Tagline</label>
        <input type="text" className="w-full px-3 py-2 border rounded-md text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={4} />
      </div>
    </div>
  );
}
