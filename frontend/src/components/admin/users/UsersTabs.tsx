'use client';

import clsx from 'clsx';

const tabs = [
  { name: 'All Users', filter: '' },
  { name: 'Pending Verification', filter: 'pending' },
  // { name: 'Invitations', filter: 'invited' },
  { name: 'Locked Accounts', filter: 'locked' },
  { name: 'Deactivated Users', filter: 'inactive' },
  { name: 'Admins & Managers', filter: 'admins' },
];

interface UsersTabsProps {
  activeFilter: string;
  setFilter: (value: string) => void;
}

export default function UsersTabs({ activeFilter, setFilter }: UsersTabsProps) {
  return (
    <nav aria-label="User tabs" className="border-b mb-4">
      <ul
        className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ WebkitOverflowScrolling: 'touch' }} // smooth scrolling on iOS
      >
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.filter;

          return (
            <li key={tab.name} className="flex-shrink-0">
              <button
                onClick={() => setFilter(tab.filter)}
                className={clsx(
                  'inline-block px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none whitespace-nowrap',
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                )}
              >
                {tab.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
