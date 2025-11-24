// 전역 토스트 상태
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/Toast';
import { setGlobalToast } from '../utils/globalToast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const hideToast = () => setToast(null);

  // 글로벌 토스트 등록
  useEffect(() => {
    setGlobalToast(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <Toast message={toast} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);