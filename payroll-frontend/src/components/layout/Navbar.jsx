import { NavLink, useNavigate } from 'react-router-dom';
import {
  DASHBOARD_ROUTE,
  EMPLOYEES_ROUTE,
  LOGIN_ROUTE,
  MY_PAYROLLS_ROUTE,
  PAYROLLS_ROUTE
} from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const showDashboard = ['admin', 'accountant', 'superadmin'].includes(user?.role);
  const showEmployees = ['admin', 'superadmin'].includes(user?.role);
  const showPayrolls = ['admin', 'accountant', 'superadmin'].includes(user?.role);
  const showMyPayrolls = user?.role === 'user';

  const handleLogout = () => {
    logout();
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <nav className="topbar">
      <div className="topbar__brand">
        <span className="topbar__eyebrow">Payroll Suite</span>
        <strong>Sistema de Liquidacion</strong>
      </div>

      <div className="topbar__nav">
        {showDashboard && <NavLink to={DASHBOARD_ROUTE}>Dashboard</NavLink>}
        {showEmployees && <NavLink to={EMPLOYEES_ROUTE}>Empleados</NavLink>}
        {showPayrolls && <NavLink to={PAYROLLS_ROUTE}>Liquidaciones</NavLink>}
        {showMyPayrolls && <NavLink to={MY_PAYROLLS_ROUTE}>Mis liquidaciones</NavLink>}
      </div>

      <div className="topbar__session">
        <div className="topbar__identity">
          <span className="topbar__user">{user?.email}</span>
          <span className="topbar__role">{user?.role}</span>
        </div>
        <button type="button" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
