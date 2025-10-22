import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from './Modal';
import { IUser, UserRole } from '@/types/user';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { updateUser } from '@/services/users';
import Image from 'next/image';

interface EditUserModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: IUser) => void;
}

const roles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER, UserRole.WEB_USER];

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: UserRole.WEB_USER,
    isActive: true,
    isVerified: false,
    profilePictureUrl: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        profilePictureUrl: user.profilePictureUrl || '',
      });
      setError(null);
    }
  }, [user]);

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('profilePictureUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedUser = await updateUser(user._id, formState);

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      onSave(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit User: ${user?.name || ''}`}
      className="max-w-lg w-full p-4 sm:p-6 rounded-lg shadow-xl bg-white backdrop-blur-md mx-3 sm:mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-28 h-28 rounded-full border border-gray-300 shadow-md overflow-hidden bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center">
            {formState.profilePictureUrl ? (
              <Image
                src={formState.profilePictureUrl}
                alt="Profile"
                onError={(e) => ((e.target as HTMLImageElement).src = '/default-profile.png')}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="text-gray-400 text-lg select-none font-semibold">No Image</div>
            )}
          </div>
          <label
            htmlFor="profilePictureFile"
            className="inline-block cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-blue-400 transition text-sm sm:text-base"
          >
            Upload New Picture
          </label>
          <input
            id="profilePictureFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={formState.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Enter full name"
            required
            minLength={2}
            maxLength={50}
            aria-required="true"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Enter email address"
            required
            aria-required="true"
          />
        </div>

        {/* Profile Picture URL (readonly) */}
        <div>
          <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture URL
          </label>
          <input
            id="profilePictureUrl"
            name="profilePictureUrl"
            type="url"
            value={formState.profilePictureUrl}
            readOnly
            className="block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 text-sm text-gray-600 cursor-not-allowed shadow-sm"
            placeholder="Uploaded image URL will appear here"
            aria-readonly="true"
          />
        </div>

        {/* Role (readonly) */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formState.role}
            disabled
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700 text-sm cursor-not-allowed shadow-sm"
            aria-disabled="true"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">User roles are not editable here.</p>
        </div>

        {/* Switches for Active and Verified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Active Switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 select-none">Active</span>
            <Switch
              checked={formState.isActive}
              onChange={(val) => handleChange('isActive', val)}
              className={cn(
                'relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                formState.isActive ? 'bg-green-500' : 'bg-gray-300'
              )}
              aria-checked={formState.isActive}
              aria-label="Active status"
            >
              <span
                className={cn(
                  'inline-block h-5 w-5 transform bg-white rounded-full shadow-md transition-transform',
                  formState.isActive ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </Switch>
          </div>

          {/* Verified (readonly) */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700 select-none">Verified</label>
            <div
              className="flex items-center gap-3"
              aria-readonly="true"
              aria-label="Verified status"
              role="switch"
              aria-checked={formState.isVerified}
              tabIndex={0}
            >
              <div
                className={cn(
                  'inline-flex h-7 w-14 items-center rounded-full bg-gray-300',
                  formState.isVerified && 'bg-blue-600'
                )}
              >
                <div
                  className={cn(
                    'inline-block h-5 w-5 transform bg-white rounded-full shadow-md transition-transform duration-300',
                    formState.isVerified ? 'translate-x-7' : 'translate-x-1'
                  )}
                />
              </div>
              <span className="text-sm text-gray-600 select-none">{formState.isVerified ? 'Yes' : 'No'}</span>
            </div>
            <p className="text-xs text-gray-400">Verification status cannot be changed manually.</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p role="alert" className="text-red-600 text-sm mt-2 font-medium select-none">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 flex-wrap pt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>

  );
}
