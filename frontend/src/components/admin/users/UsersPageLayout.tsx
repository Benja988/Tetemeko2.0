'use client';

import { useEffect, useState } from 'react';
import UserFilterBar from '@/components/admin/users/UserFilterBar';
import UserSearchBar from '@/components/admin/users/UserSearchBar';
import UsersTabs from '@/components/admin/users/UsersTabs';
import UserTable from '@/components/admin/users/UserTable';
import UserActions from '@/components/admin/users/UserActions';
import { IUser, UserRole } from '@/types/user';
import {
  getUsers,
  searchUsers,
  deleteUsers,
} from '@/services/users';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportUsersModal } from './ExportUsersModal';

interface UsersPageLayoutProps {
  heading: string;
  defaultFilter?: string;
}

export default function UsersPageLayout({
  heading,
  defaultFilter = '',
}: UsersPageLayoutProps) {
  const [rawUsers, setRawUsers] = useState<IUser[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState(defaultFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [uiFilter, setUiFilter] = useState(''); 

  const applyUiFilter = (users: IUser[], filter: string): IUser[] => {
    switch (filter) {
      case 'pending':
        return users.filter((u) => !u.isVerified);
      case 'invited':
        return users.filter((u) => !u.isVerified); 
      case 'locked':
        return users.filter((u) => u.failedLoginAttempts >= 3);
      case 'inactive':
        return users.filter((u) => !u.isActive);
      case 'admins':
        return users.filter((u) => ['admin', 'manager'].includes(u.role));
      default:
        return users;
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const role = filterOption as UserRole;
      const response = await getUsers(1, 50, role);
      const fetchedUsers = response?.users ?? [];
      setRawUsers(fetchedUsers);
      setUsers(applyUiFilter(fetchedUsers, uiFilter));
      setSelectedUserIds([]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterOption]);

  useEffect(() => {
    setUsers(applyUiFilter(rawUsers, uiFilter));
  }, [uiFilter, rawUsers]);

  useEffect(() => {
  // Find names of selected users from rawUsers
  const names = selectedUserIds.map(id => {
    const user = rawUsers.find(u => u._id === id);
    return user ? user.name : id; // fallback to id if not found
  });
  setSelectedUserNames(names);
}, [selectedUserIds, rawUsers]);


  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchUsers(query);
      const filtered = applyUiFilter(response, uiFilter);
      setUsers(filtered);
      setSelectedUserIds([]);
    } catch (error) {
      console.error('Search error:', error);
      setUsers([]);
      setSelectedUserIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedUserIds.length === 0) return;
      await deleteUsers(selectedUserIds);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete users:', error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedUserIds([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u._id));
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-light)] p-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            {heading}
          </h1>
        </div>
        <div className="mt-4">
          <UsersTabs activeFilter={uiFilter} setFilter={setUiFilter} />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        <UserSearchBar onSearch={handleSearch} />
        <UserFilterBar onFilter={setFilterOption} />
      </div>

      <main>
        <UserActions
          onExport={() => setExportModalOpen(true)}
          onDeleteSelected={() => setDeleteModalOpen(true)}
        />

        <UserTable
          users={users}
          search={searchQuery}
          filter={filterOption}
          onSelectUsers={setSelectedUserIds}
          selectedUserIds={selectedUserIds}
          onToggleSelectAll={toggleSelectAll}
          // isLoading={isLoading}
        />
      </main>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        userIds={selectedUserIds}
        userNames={selectedUserNames}
        onDeleted={handleDeleteConfirm}
        message={`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`}
      />

      <ExportUsersModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        users={users}
      />
    </section>
  );
}
