'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { IUser } from '@/types/user';
import UserActions from '@/components/admin/users/UserActions';
import { EditUserModal } from './EditUserModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ToggleActiveStatusModal } from './ToggleActiveStatusModal';
import { ViewUserModal } from './ViewUserModal';
import { deleteUser, updateUser } from '@/services/users';
import Image from 'next/image';

type UserAction =
  | 'edit'
  | 'delete'
  | 'toggleActive'
  | 'view';

interface UserRowProps {
  user: IUser;
  isSelected: boolean;
  onCheckboxChange: (userId: string, checked: boolean) => void;
  rowClassName?: string;
  onUserUpdated?: (updatedUser: IUser) => void;
  onUserDeleted?: (userId: string) => void;

  // Optional search highlight term
  highlight?: string;
  dangerouslySetInnerHTML?: { __html: string };

}

export default function UserRow({
  user,
  isSelected,
  onCheckboxChange,
  rowClassName = '',
  onUserUpdated,
  onUserDeleted,
  highlight = '',
}: UserRowProps) {
  const [openModal, setOpenModal] = useState<UserAction | null>(null);

  const isLocked = user.lockUntil && dayjs(user.lockUntil).isAfter(dayjs());

  const handleUserAction = (action: UserAction) => {
    setOpenModal(action);
  };

  const closeModal = () => setOpenModal(null);

  const handleEditSave = async (updatedUserData: Partial<IUser>) => {
    try {
      const updatedUser = await updateUser(user._id, updatedUserData);
      if (updatedUser) {
        onUserUpdated?.(updatedUser);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const success = await deleteUser(user._id);
      if (success) {
        onUserDeleted?.(user._id);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async () => {
    try {
      const updatedUser = await updateUser(user._id, { isActive: !user.isActive });
      if (updatedUser) {
        onUserUpdated?.(updatedUser);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const renderBadge = (status: boolean, type: 'active' | 'verified') => {
    const baseClasses =
      'inline-block px-2 py-0.5 rounded-full text-xs font-semibold select-none';
    const config = {
      active: status
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800',
      verified: status
        ? 'bg-blue-100 text-blue-800'
        : 'bg-yellow-100 text-yellow-800',
    };
    const label = {
      active: status ? 'Active' : 'Inactive',
      verified: status ? 'Verified' : 'Unverified',
    };

    return <span className={`${baseClasses} ${config[type]}`}>{label[type]}</span>;
  };

  // Highlight user name with <mark> around matched terms safely
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;

    // Escape RegExp special chars in highlight string
    const escaped = highlight.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // Clicking row toggles checkbox, except if clicking inside checkbox or actions
  const onRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    // Prevent toggle if clicking input checkbox or buttons inside row
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('button') ||
      target.closest('a')
    ) {
      return;
    }
    onCheckboxChange(user._id, !isSelected);
  };

  return (
    <>
      <tr
        className={`${rowClassName} bg-white border-b hover:bg-gray-100 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''
          }`}
        tabIndex={0}
        aria-selected={isSelected}
        onClick={onRowClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCheckboxChange(user._id, !isSelected);
          }
        }}
      >
        <td className="bg-white p-3 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onCheckboxChange(user._id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="custom-checkbox"
            aria-label={`Select user ${user.name}`}
          />

        </td>
        <td className="p-3">
          <Image
            src={user.profilePictureUrl || '/avatar.jpg'}
            alt={`${user.name}'s profile`}
            width={40}
            height={40}
            className="h-8 w-8 rounded-full object-cover border border-gray-200"
            loading="lazy"
            decoding="async"
          />
        </td>
        <td
          className="p-3 max-w-[150px] truncate"
          title={user.name}
        >
          {highlightText(user.name, highlight)}
        </td>
        <td
          className="p-3 max-w-[200px] truncate hidden sm:table-cell"
          title={user.email}
        >
          {user.email}
        </td>
        <td className="p-3 capitalize hidden md:table-cell">{user.role}</td>
        <td className="p-3 hidden md:table-cell">{renderBadge(user.isActive, 'active')}</td>
        <td className="p-3 hidden lg:table-cell">{renderBadge(user.isVerified, 'verified')}</td>
        <td
          className="p-3 hidden lg:table-cell max-w-[140px] truncate"
          title={isLocked ? `Locked until ${dayjs(user.lockUntil).format('MMMM D, YYYY h:mm A')}` : 'Not Locked'}
        >
          {isLocked ? (
            <span className="text-red-700 text-xs font-semibold">
              Locked until {dayjs(user.lockUntil).format('MMM D, YYYY h:mm A')}
            </span>
          ) : (
            <span className="text-green-700 text-xs font-semibold">Not Locked</span>
          )}
        </td>
        <td className="p-3 hidden xl:table-cell whitespace-nowrap">
          {user.createdAt ? dayjs(user.createdAt).format('MMM D, YYYY') : 'N/A'}
        </td>
        <td className="p-3 flex items-center space-x-2 justify-start min-w-[120px]">
          <UserActions user={user} onUserAction={handleUserAction} />
        </td>
      </tr>

      <EditUserModal
        isOpen={openModal === 'edit'}
        onClose={closeModal}
        user={user}
        onSave={handleEditSave}
      />

      <ConfirmDeleteModal
        isOpen={openModal === 'delete'}
        onClose={closeModal}
        userIds={[user._id]}
        userNames={[user.name]}
        onDeleted={handleDelete}
        message={`Are you sure you want to delete ${user.name}?`}
      />

      <ToggleActiveStatusModal
        isOpen={openModal === 'toggleActive'}
        onClose={closeModal}
        user={user}
        onToggle={handleToggleActive}
      />

      <ViewUserModal
        isOpen={openModal === 'view'}
        onClose={closeModal}
        user={user}
      />
    </>
  );
}
