// components/common/Breadcrumbs.tsx
import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string; // href optional for the current/last item
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="text-sm text-gray-300 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={idx} className="inline-flex items-center">
                            {isLast ? (
                                <span aria-current="page" className="text-gray-100 font-semibold">
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href || '#'} className="hover:text-white">
                                    {item.label}
                                </Link>

                            )}
                            {!isLast && (
                                <svg
                                    className="w-4 h-4 mx-1 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
