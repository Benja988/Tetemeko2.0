'use client';

import { useState } from "react";
import { settingsData } from "@/data/settings";
import { SettingItem } from "@/interfaces/Settings";

import FileUpload from "./FileUpload";
import Notification from "./Notification";
import SettingsActions from "./SettingsActions";
import SettingsTable from "./SettingsTable";
import CollapsibleSections from "./CollapsibleSections";
import SettingsTab from "./SettingsTab";

import SocialLinksSettings from "./SocialLinksSettings";
import CompanyInfoSettings from "./CompanyInfoSettings";
import FeaturedWorksSettings from "./FeaturedWorksSettings";
import EventsSettings from "./EventsSettings";

interface Props {
  heading: string;
}

export default function SettingsPageLayout({ heading }: Props) {
  const [activeTab, setActiveTab] = useState("General");

  const tabSectionMap: Record<string, string[]> = {
    General: ["Appearance", "Notifications", "System"],
    Social: ["Social Links"],
    Company: ["Company Info"],
    "Featured Works": ["Featured Works"],
    Events: ["Events"]
  };

  const filteredSections = tabSectionMap[activeTab] || [];

  const getComponent = (setting: SettingItem) => {
    switch (setting.type) {
      case "upload":
        return <FileUpload key={setting.id} />;
      case "notification":
        return <Notification key={setting.id} />;
      case "action":
        return <SettingsActions key={setting.id} />;
      case "table":
        return <SettingsTable key={setting.id} />;
      default:
        return null;
    }
  };

  const renderCustomTabComponent = () => {
    switch (activeTab) {
      case "Social":
        return <SocialLinksSettings />;
      case "Company":
        return <CompanyInfoSettings />;
      case "Featured Works":
        return <FeaturedWorksSettings />;
      case "Events":
        return <EventsSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{heading}</h1>

      <SettingsTab
        currentTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "General", label: "General" },
          { id: "Social", label: "Social Links" },
          { id: "Company", label: "Company Info" },
          { id: "Featured Works", label: "Featured Works" },
          { id: "Events", label: "Events" },
        ]}
      />

      {/* Render section-based settings if available */}
      {filteredSections.length > 0 &&
        filteredSections.map((section) => (
          <CollapsibleSections key={section} title={section}>
            {settingsData
              .filter((item) => item.section === section)
              .map((setting) => (
                <div
                  key={setting.id}
                  className="border rounded-md shadow-sm mb-4 p-4 bg-white"
                >
                  <h2 className="text-lg font-semibold">{setting.title}</h2>
                  {setting.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {setting.description}
                    </p>
                  )}
                  {getComponent(setting)}
                </div>
              ))}
          </CollapsibleSections>
        ))}

      {/* Render custom tab component if tab has no section-based settings */}
      {filteredSections.length === 0 && renderCustomTabComponent()}
    </div>
  );
}
