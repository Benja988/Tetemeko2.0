import { useState } from 'react';

export function useModal<T = any>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = (modalData?: T) => {
    setOpen(true);
    if (modalData) setData(modalData);
  };

  const closeModal = () => {
    setOpen(false);
    setData(null);
  };

  return { open, data, openModal, closeModal };
}
