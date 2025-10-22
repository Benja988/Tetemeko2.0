// utils/exportToCSV.ts
import { IUser } from '@/types/user';

export function exportToCSV(users: IUser[]) {
  const headers = ['Name', 'Email', 'Role', 'Status'];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.role,
    u.isVerified ? 'Verified' : 'Unverified',
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows].map((row) => row.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'users_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
