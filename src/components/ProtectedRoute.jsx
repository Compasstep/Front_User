import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../store/userStore.js';

function ProtectedRoute() {
  const { isLoggedIn } = useUserStore();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;