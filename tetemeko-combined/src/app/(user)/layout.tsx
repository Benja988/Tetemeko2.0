
import TopNav from '@/components/TopNav';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-grow">{children}</main>
    </>
  );
}
