// components/admin/settings/SocialLinksSettings.tsx

export default function SocialLinksSettings() {
  return (
    <div className="space-y-4">
      {["Facebook", "Twitter", "Instagram", "YouTube"].map((platform) => (
        <div key={platform}>
          <label className="block text-sm font-medium">{platform} URL</label>
          <input
            type="url"
            placeholder={`Enter ${platform} link`}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      ))}
    </div>
  );
}
