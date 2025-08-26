'use client';

import { useState } from "react";

type Rule = {
  id: number;
  keyword: string;
  action: string;
};

const ACTIONS = ["auto-remove", "flag", "notify", "quarantine"];

export default function SettingsTable() {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, keyword: "spam", action: "auto-remove" },
    { id: 2, keyword: "scam", action: "flag" },
  ]);

  const [newRule, setNewRule] = useState({ keyword: "", action: ACTIONS[0] });

  const handleInputChange = (id: number, field: keyof Rule, value: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  const handleDelete = (id: number) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const handleNewRuleChange = (field: keyof Rule, value: string) => {
    setNewRule((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRule = () => {
    if (!newRule.keyword.trim()) return;
    setRules((prev) => [
      ...prev,
      { id: Date.now(), keyword: newRule.keyword.trim(), action: newRule.action },
    ]);
    setNewRule({ keyword: "", action: ACTIONS[0] });
  };

  return (
    <div className="overflow-x-auto bg-white rounded border p-4 shadow-sm">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Keyword</th>
            <th className="border px-4 py-2 text-left">Action</th>
            <th className="border px-4 py-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(({ id, keyword, action }) => (
            <tr key={id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => handleInputChange(id, "keyword", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  value={action}
                  onChange={(e) => handleInputChange(id, "action", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  {ACTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-600 hover:underline"
                  aria-label={`Delete rule ${keyword}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Add new rule */}
          <tr className="bg-gray-50">
            <td className="border px-4 py-2">
              <input
                type="text"
                placeholder="New keyword"
                value={newRule.keyword}
                onChange={(e) => handleNewRuleChange("keyword", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </td>
            <td className="border px-4 py-2">
              <select
                value={newRule.action}
                onChange={(e) => handleNewRuleChange("action", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </td>
            <td className="border px-4 py-2 text-center">
              <button
                onClick={handleAddRule}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                aria-label="Add new rule"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
