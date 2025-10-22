// components/admin/settings/SettingsTab.tsx

interface Tab {
  id: string;
  label: string;
}

interface SettingsTabProps {
  tabs: Tab[];
  currentTab: string;
  onTabChange: (id: string) => void;
}

export default function SettingsTab({ tabs, currentTab, onTabChange }: SettingsTabProps) {
  return (
    <div className="flex space-x-4 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium ${
            currentTab === tab.id
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
