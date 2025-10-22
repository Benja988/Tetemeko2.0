// components/NewsPageBreadcrumbs.tsx
import Link from 'next/link';

interface NewsPageBreadcrumbsProps {
  paths: { label: string; href: string }[];
}

const NewsPageBreadcrumbs = ({ paths }: NewsPageBreadcrumbsProps) => (
  <nav className="text-sm text-blue-400 mb-6 text-left space-x-2">
    {paths.map((path, index) => (
      <span key={index}>
        <Link href={path.href} className="hover:text-blue-600">
          {path.label}
        </Link>
        {index < paths.length - 1 && " > "}
      </span>
    ))}
  </nav>
);

export default NewsPageBreadcrumbs;
