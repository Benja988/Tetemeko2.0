

'use client';

import { News } from '@/interfaces/News';
import Modal from './Modal';
import NewsArticleForm from './create/NewsArticleForm';
import { useState } from 'react';

interface Props {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditNewsModal({ news, isOpen, onClose, onSuccess }: Props) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!news) return null;

  const handleClose = () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit News Article"
    >
      <NewsArticleForm
        existingNews={news}
        onSuccess={() => {
          setHasUnsavedChanges(false);
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
}
