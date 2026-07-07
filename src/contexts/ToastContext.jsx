import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
  }[type] || 'bg-gray-600';

  return (
    <div
      className={`${bgColor} fixed top-24 right-5 px-5 py-3 rounded shadow text-white z-50 cursor-pointer`}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};
