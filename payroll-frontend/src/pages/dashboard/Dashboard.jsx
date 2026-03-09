import { Link, useNavigate } from 'react-router-dom';
import { EMPLOYEES_ROUTE, PAYROLLS_ROUTE } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canManageEmployees = ['admin', 'superadmin'].includes(user?.role);
  const canManagePayrolls = ['admin', 'contable', 'superadmin'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Sesion iniciada correctamente.</p>
      <p>Usuario: {user?.email}</p>
      <p>Rol: {user?.role}</p>
      {canManageEmployees && <Link to={EMPLOYEES_ROUTE}>Ver empleados</Link>}
      {canManagePayrolls && <Link to={PAYROLLS_ROUTE}>Ver liquidaciones</Link>}
      <button type="button" onClick={handleLogout}>
        Cerrar sesion
      </button>
    </main>
  );
}

export default Dashboard;
