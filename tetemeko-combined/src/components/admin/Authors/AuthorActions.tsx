'use client';

import { useMemo } from 'react';
import { FiPlus, FiEdit2, FiCheck, FiDownload, FiTrash2 } from 'react-icons/fi';

interface AuthorActionsProps {
  onCreate: () => void;
  onExport: () => void;
  onUpdateSelected: () => void;
  onVerifySelected: () => void;
  onDeleteSelected: () => void;
  disableUpdate?: boolean;
  disableVerify?: boolean;
  disableDelete?: boolean;
  selectedCount?: number;
  isLoading?: boolean;
}

type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

const ButtonClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  info: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
};

export default function AuthorActions({
  onCreate,
  onExport,
  onUpdateSelected,
  onVerifySelected,
  onDeleteSelected,
  disableUpdate = false,
  disableVerify = false,
  disableDelete = false,
  selectedCount = 0,
  isLoading = false,
}: AuthorActionsProps) {
  const baseClasses = useMemo(() => 
    `flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75
     disabled:opacity-60 disabled:cursor-not-allowed
     w-full sm:w-auto`, 
  []);

  const getButtonClasses = (variant: ButtonVariant, disabled?: boolean) => 
    `${baseClasses} ${ButtonClasses[variant]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`;

  const buttonLabels = useMemo(() => ({
    create: selectedCount > 0 ? `Create (${selectedCount} selected)` : 'Create',
    update: selectedCount > 1 ? `Update ${selectedCount}` : 'Update Selected',
    verify: selectedCount > 1 ? `Verify ${selectedCount}` : 'Verify Selected',
    delete: selectedCount > 1 ? `Delete ${selectedCount}` : 'Delete Selected',
    export: 'Export',
  }), [selectedCount]);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <button
        onClick={onCreate}
        disabled={isLoading}
        className={getButtonClasses('success')}
        aria-label="Create new author"
      >
        <FiPlus className="w-4 h-4" />
        {buttonLabels.create}
      </button>

      <button
        onClick={onUpdateSelected}
        disabled={disableUpdate || isLoading}
        className={getButtonClasses('warning', disableUpdate)}
        aria-label={disableUpdate ? "No author selected to update" : "Update selected author"}
      >
        <FiEdit2 className="w-4 h-4" />
        {buttonLabels.update}
      </button>

      <button
        onClick={onVerifySelected}
        disabled={disableVerify || isLoading}
        className={getButtonClasses('info', disableVerify)}
        aria-label={disableVerify ? "No author selected to verify" : "Verify selected author"}
      >
        <FiCheck className="w-4 h-4" />
        {buttonLabels.verify}
      </button>

      <button
        onClick={onExport}
        disabled={isLoading}
        className={getButtonClasses('primary')}
        aria-label="Export authors data"
      >
        <FiDownload className="w-4 h-4" />
        {buttonLabels.export}
      </button>

      <button
        onClick={onDeleteSelected}
        disabled={disableDelete || isLoading}
        className={getButtonClasses('danger', disableDelete)}
        aria-label={disableDelete ? "No author selected to delete" : "Delete selected author"}
      >
        <FiTrash2 className="w-4 h-4" />
        {buttonLabels.delete}
      </button>
    </div>
  );
}