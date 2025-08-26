'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Author } from '@/types/author';
import {
  deleteAuthor,
  getAuthors,
  searchAuthors,
  updateAuthor,
  verifyAuthor,

  createAuthor
} from '@/services/authors';

// Components
import AuthorTabs from './AuthorTabs';
import AuthorSearchBar from './AuthorSearchBar';
import AuthorFilterBar from './AuthorFilterBar';
import AuthorActions from './AuthorActions';
import AuthorTable from './AuthorTable';
import { CreateAuthorModal } from './CreateAuthorModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportAuthorsModal } from './ExportAuthorsModal';
import { AuthorStats } from './AuthorStats';
import { UpdateAuthorModal } from './UpdateAuthorModal';
// import { BatchVerifyModal } from './BatchVerifyModal';

interface AuthorsPageLayoutProps {
  heading: string;
  defaultFilter?: string;
}

// 🔥 Unified filter type
export type AuthorFilter =
  | ''
  | 'unverified'
  | 'verified'
  | 'author'
  | 'contributor'
  | 'editor';

export default function AuthorsPageLayout({
  heading,
  defaultFilter = '',
}: AuthorsPageLayoutProps) {
  // State management
  const [rawAuthors, setRawAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<AuthorFilter>('');
  const [uiFilter, setUiFilter] = useState<AuthorFilter>(
    defaultFilter as AuthorFilter
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [authorToUpdate, setAuthorToUpdate] = useState<Author | null>(null);

  // Modal states
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  // const [isBatchVerifyModalOpen, setBatchVerifyModalOpen] = useState(false);

  // Derived state
  const selectedAuthors = useMemo(() => {
    return rawAuthors.filter((author) =>
      selectedAuthorIds.includes(author._id)
    );
  }, [rawAuthors, selectedAuthorIds]);

  const stats = useMemo(() => {
    return {
      total: rawAuthors.length,
      verified: rawAuthors.filter((a) => a.isVerified).length,
      unverified: rawAuthors.filter((a) => !a.isVerified).length,
    };
  }, [rawAuthors]);

  // Data filtering logic
  const applyFilters = useCallback(
    (authors: Author[], filter: AuthorFilter, search: string) => {
      let result = [...authors];

      if (search) {
        const query = search.toLowerCase();
        result = result.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            (a.email && a.email.toLowerCase().includes(query)) ||
            (a.bio && a.bio.toLowerCase().includes(query))
        );
      }

      if (filter === 'unverified') return result.filter((a) => !a.isVerified);
      if (filter === 'verified') return result.filter((a) => a.isVerified);

      // role filters (optional if your Author has a `role`)
      if (['author', 'contributor', 'editor'].includes(filter)) {
        return result.filter((a) => a.role === filter);
      }

      return result;
    },
    []
  );

  // Data fetching
  const fetchAuthors = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetched = await getAuthors();
      setRawAuthors(fetched);
      setFilteredAuthors(applyFilters(fetched, uiFilter, searchQuery));
      setSelectedAuthorIds([]);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setIsLoading(false);
    }
  }, [uiFilter, searchQuery, applyFilters]);

  // Effects
  useEffect(() => {
    fetchAuthors();
  }, [filterOption, fetchAuthors]);

  useEffect(() => {
    setFilteredAuthors(applyFilters(rawAuthors, uiFilter, searchQuery));
  }, [uiFilter, rawAuthors, searchQuery, applyFilters]);

  // Event handlers
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        await fetchAuthors();
        return;
      }
      try {
        setIsLoading(true);
        const results = await searchAuthors(query);
        setFilteredAuthors(applyFilters(results, uiFilter, query));
      } catch (error) {
        console.error('Search failed:', error);
        setFilteredAuthors([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAuthors, uiFilter, applyFilters]
  );

  const handleDeleteAuthors = useCallback(async () => {
    try {
      await Promise.all(selectedAuthorIds.map((id) => deleteAuthor(id)));
      await fetchAuthors();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteModalOpen(false);
    }
  }, [selectedAuthorIds, fetchAuthors]);

  const handleVerify = useCallback(async () => {
    if (selectedAuthorIds.length === 1) {
      try {
        setIsLoading(true);
        await verifyAuthor(selectedAuthorIds[0]);
        await fetchAuthors();
      } catch (error) {
        console.error('Verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (selectedAuthorIds.length > 1) {
      // setBatchVerifyModalOpen(true);
    }
  }, [selectedAuthorIds, fetchAuthors]);

  const handleOpenUpdateModal = useCallback(() => {
    if (selectedAuthorIds.length !== 1) return;
    const selected = rawAuthors.find((a) => a._id === selectedAuthorIds[0]);
    if (selected) {
      setAuthorToUpdate(selected);
      setUpdateModalOpen(true);
    }
  }, [selectedAuthorIds, rawAuthors]);

  const handleUpdateSubmit = useCallback(
    async (data: Partial<Author>) => {
      if (!authorToUpdate) return;
      try {
        setIsLoading(true);
        await updateAuthor(authorToUpdate._id, data);
        await fetchAuthors();
        setUpdateModalOpen(false);
      } catch (error) {
        console.error('Update failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [authorToUpdate, fetchAuthors]
  );

  const toggleSelectAll = useCallback(() => {
    setSelectedAuthorIds((prev) =>
      prev.length === filteredAuthors.length
        ? []
        : filteredAuthors.map((a) => a._id)
    );
  }, [filteredAuthors]);

  const toggleAuthorSelection = useCallback((id: string) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  }, []);

  const handleCreateSubmit = useCallback(
  async (data: Partial<Author>) => {
    try {
      setIsLoading(true);
      await createAuthor(data);   
      await fetchAuthors();      
      setCreateModalOpen(false);  
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setIsLoading(false);
    }
  },
  [fetchAuthors]
);


  return (
    <section className="min-h-screen bg-gray-50 px-4 py-6">
      <header className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {heading}
          </h1>
          <AuthorStats
            total={stats.total}
            verified={stats.verified}
            unverified={stats.unverified}
          />
        </div>
        <AuthorTabs activeFilter={uiFilter} setFilter={setUiFilter} />
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <AuthorSearchBar onSearch={handleSearch} isLoading={isLoading} />
        <AuthorFilterBar
          onFilter={setFilterOption}
          currentFilter={filterOption}
        />
      </div>

      <div className="mb-4">
        <AuthorActions
          onCreate={() => setCreateModalOpen(true)}
          onExport={() => setExportModalOpen(true)}
          onUpdateSelected={handleOpenUpdateModal}
          onVerifySelected={handleVerify}
          onDeleteSelected={() => setDeleteModalOpen(true)}
          disableUpdate={selectedAuthorIds.length !== 1}
          disableDelete={selectedAuthorIds.length === 0}
          selectedCount={selectedAuthorIds.length}
        />
      </div>

      <AuthorTable
        authors={filteredAuthors}
        isLoading={isLoading}
        selectedAuthorIds={selectedAuthorIds}
        onSelectAuthor={toggleAuthorSelection}
        onToggleSelectAll={toggleSelectAll}
      />

      {/* Modals */}
      <CreateAuthorModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateSubmit}
      />

      <UpdateAuthorModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        author={authorToUpdate}
        onUpdate={handleUpdateSubmit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        authors={selectedAuthors.map(a => ({ id: a._id, name: a.name }))}
        onConfirm={handleDeleteAuthors}   // delete logic
        onDeleted={fetchAuthors}          // refetch list after delete
      />

      <ExportAuthorsModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        authors={filteredAuthors}
      />

      {/*<BatchVerifyModal
        isOpen={isBatchVerifyModalOpen}
        onClose={() => setBatchVerifyModalOpen(false)}
        count={selectedAuthorIds.length}
        onConfirm={() => {
          // TODO: implement batch verify later
          setBatchVerifyModalOpen(false);
        }}
      />*/}
    </section>
  );
}
