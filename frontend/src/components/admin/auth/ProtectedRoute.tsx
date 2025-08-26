// import { useAdminAuth } from '@/context/AdminAuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { admin, loading } = useAdminAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !admin) {
//       router.push('/admin/login');
//     }
//   }, [loading, admin, router]);

//   if (loading || !admin) return null;

//   return <>{children}</>;
// }
