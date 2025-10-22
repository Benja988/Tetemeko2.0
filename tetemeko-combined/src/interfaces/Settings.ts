// interfaces/Settings.ts

// export interface Setting {
//   id: string;
//   label: string;
//   type: string;
//   value: string | number | boolean;
//   category: string; // <-- required
//   description?: string;
//   options?: string[]; // maybe optional for select type
// }

export interface SettingItem {
  id: string;
  section: string;
  title: string;
  description?: string;
  type: "upload" | "notification" | "action" | "table";
}



