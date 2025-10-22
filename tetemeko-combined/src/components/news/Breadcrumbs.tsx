'use client';
import { FC } from 'react';

const Breadcrumbs: FC = () => {
    return (
        <nav className="text-sm text-gray-600 mb-4">
            <ol className="list-reset flex space-x-2">
                <li><a href="/" className="hover:underline text-blue-600">Home</a></li>
                <li>/</li>
                <li><a href="/news" className="hover:underline text-blue-400">News</a></li>
                
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
