import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDefaultRouteByRole, LOGIN_ROUTE } from '../../constants/routes';
import AppLayout from '../layout/AppLayout';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Cargando sesion...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDefaultRouteByRole(user?.role)} replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default ProtectedRoute;
