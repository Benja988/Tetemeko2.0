// 'use client';

// import { useState, useEffect } from 'react';
// import { IUser, UserRole } from '@/types/user';

// interface AddUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAdd: (user: IUser) => void;  // renamed here
// }

// export default function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState<UserRole>(UserRole.WEB_USER);
//   const [isActive, setIsActive] = useState(true);

//   useEffect(() => {
//     if (isOpen) {
//       setName('');
//       setEmail('');
//       setRole(UserRole.WEB_USER);
//       setIsActive(true);
//     }
//   }, [isOpen]);

//   const handleSubmit = () => {
//     const newUser: IUser = {
//       _id: '', // placeholder for backend-generated ID
//       name,
//       email,
//       role,
//       isActive,
//       isVerified: false,
//       failedLoginAttempts: 0,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     onAdd(newUser);  // call onAdd here
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Add New User</h2>

//         <label className="block mb-2">
//           Name
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 w-full border rounded px-3 py-2"
//             placeholder="Enter name"
//           />
//         </label>

//         <label className="block mb-2">
//           Email
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 w-full border rounded px-3 py-2"
//             placeholder="Enter email"
//           />
//         </label>

//         <label className="block mb-2">
//           Role
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value as UserRole)}
//             className="mt-1 w-full border rounded px-3 py-2"
//           >
//             <option value={UserRole.ADMIN}>Admin</option>
//             <option value={UserRole.MANAGER}>Manager</option>
//             <option value={UserRole.WEB_USER}>Web User</option>
//           </select>
//         </label>

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//           />
//           Active
//         </label>

//         <div className="flex justify-end gap-2">
//           <button
//             className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//             onClick={handleSubmit}
//             disabled={!name || !email}
//           >
//             Add User
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
