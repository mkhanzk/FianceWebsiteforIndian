import { createContext, ReactNode, useContext, useState } from 'react';
import RequestDetailsModal from './RequestDetailsModal';

type RequestModalContextValue = {
  open: () => void;
};

const RequestModalContext = createContext<RequestModalContextValue>({
  open: () => undefined
});

export const useRequestModal = (): RequestModalContextValue => {
  return useContext(RequestModalContext);
};

export const RequestModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RequestModalContext.Provider value={{ open: handleOpen }}>
      {children}
      <RequestDetailsModal open={open} onClose={handleClose} />
    </RequestModalContext.Provider>
  );
};

