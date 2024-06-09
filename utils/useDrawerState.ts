import { useState } from 'react';

type DrawerState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useDrawerState = (): DrawerState => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};

export default useDrawerState;