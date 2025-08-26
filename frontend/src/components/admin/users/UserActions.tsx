'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Download, MoreVertical } from 'lucide-react';
import { IUser } from '@/types/user';

// Button Component (unchanged)
function Button({
  children,
  onClick,
  className = '',
  variant = 'default',
  ariaLabel,
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive';
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) {
  const base =
    'inline-flex items-center px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Define union type for user actions
export type UserAction = 'view' | 'edit' | 'toggleActive' | 'delete';

// Props interface
interface UserActionsProps {
  onExport?: () => void;
  onDeleteSelected?: () => void;
  onSelectAll?: (selectAll: boolean) => void;  // New callback for Select All
  allSelected?: boolean;                        // Prop: whether all users are selected
  user?: IUser;
  onUserAction?: (action: UserAction, user: IUser) => void;
}

export default function UserActions({
  onExport,
  onDeleteSelected,
  onSelectAll,
  allSelected = false,
  user,
  onUserAction,
}: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left?: number; right?: number }>({
    top: 0,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  // Dynamic positioning for dropdown
  useEffect(() => {
    if (open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192;
      const spaceRight = window.innerWidth - buttonRect.left;
      const spaceLeft = buttonRect.right;

      if (spaceRight < dropdownWidth && spaceLeft >= dropdownWidth) {
        setDropdownStyle({
          top: buttonRect.bottom + window.scrollY + 4,
          right: window.innerWidth - buttonRect.right + window.scrollX,
        });
      } else {
        setDropdownStyle({
          top: buttonRect.bottom + window.scrollY + 4,
          left: buttonRect.left + window.scrollX,
        });
      }
    }
  }, [open]);

  // Render select all checkbox + admin buttons
  const renderAdminControls = () => {
    // Show only if any admin actions available
    const showAdminControls = onExport || onDeleteSelected || onSelectAll;
    if (!showAdminControls) return null;

    return (
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {onSelectAll && (
          <label className="inline-flex items-center cursor-pointer select-none text-gray-700">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Select All</span>
          </label>
        )}

        {onExport && (
          <Button onClick={onExport} variant="outline" ariaLabel="Export user list">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        {onDeleteSelected && (
          <Button onClick={onDeleteSelected} variant="destructive" ariaLabel="Delete selected users">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>
    );
  };

  // User dropdown unchanged
  const renderUserDropdown = () => {
    if (!user) return null;

    const actions: { label: string; action: UserAction; destructive?: boolean }[] = [
      { label: 'View', action: 'view' },
      { label: 'Edit', action: 'edit' },
      {
        label: user.isActive ? 'Deactivate' : 'Reactivate',
        action: 'toggleActive',
        destructive: user.isActive,
      },
      {
        label: 'Delete',
        action: 'delete',
        destructive: true,
      },
    ];

    return (
      <>
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-md focus:outline-none focus:ring"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="User actions dropdown"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {open &&
          createPortal(
            <ul
              ref={dropdownRef}
              role="menu"
              className="bg-white border shadow-lg rounded-md w-48 py-1 animate-fadeIn"
              style={{
                position: 'absolute',
                top: dropdownStyle.top,
                left: dropdownStyle.left,
                right: dropdownStyle.right,
                zIndex: 50,
              }}
            >
              {actions.map(({ label, action, destructive }, i) => (
                <li
                  key={i}
                  role="menuitem"
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    destructive ? 'text-red-600' : 'text-gray-800'
                  }`}
                  onClick={() => {
                    onUserAction?.(action, user);
                    setOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>,
            document.body,
          )}
      </>
    );
  };

  return (
    <>
      {renderAdminControls()}
      {renderUserDropdown()}
    </>
  );
}
