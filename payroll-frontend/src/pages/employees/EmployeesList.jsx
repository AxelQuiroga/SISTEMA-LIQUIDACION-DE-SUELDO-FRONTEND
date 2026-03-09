import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DASHBOARD_ROUTE,
  EMPLOYEE_CREATE_ROUTE,
  getEmployeePayrollsRoute,
  getEmployeeEditRoute
} from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { deleteEmployee, getEmployees } from '../../services/employeeService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      try {
        setError('');
        const data = await getEmployees();

        if (isMounted) {
          setEmployees(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudieron cargar los empleados');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDelete = async (employee) => {
    const shouldDelete = window.confirm(
      `Vas a dar de baja a ${employee.first_name} ${employee.last_name}.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setActionError('');
      setDeletingEmployeeId(employee.id);
      await deleteEmployee(employee.id);
      setEmployees((current) => current.filter((item) => item.id !== employee.id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'No se pudo eliminar el empleado');
    } finally {
      setDeletingEmployeeId(null);
    }
  };

  if (isLoading) {
    return <p>Cargando empleados...</p>;
  }

  return (
    <main>
      <h1>Empleados</h1>
      <p>Usuario: {user?.email}</p>
      <p>Rol: {user?.role}</p>
      <Link to={DASHBOARD_ROUTE}>Volver al dashboard</Link>
      <Link to={EMPLOYEE_CREATE_ROUTE}>Nuevo empleado</Link>
      <button type="button" onClick={handleLogout}>
        Cerrar sesion
      </button>

      {error && <p>{error}</p>}
      {actionError && <p>{actionError}</p>}

      {!error && employees.length === 0 && <p>No hay empleados activos registrados.</p>}

      {employees.length > 0 && (
        <section>
          {employees.map((employee) => (
            <article key={employee.id}>
              <h2>
                {employee.first_name} {employee.last_name}
              </h2>
              <p>ID: {employee.id}</p>
              <p>User ID: {employee.user_id ?? '-'}</p>
              <p>DNI: {employee.dni}</p>
              <p>Puesto: {employee.position}</p>
              <p>Fecha de ingreso: {formatDate(employee.hire_date)}</p>
              <p>Sueldo base: {formatCurrency(employee.base_salary)}</p>
              <Link to={getEmployeeEditRoute(employee.id)}>Editar</Link>
              <Link to={getEmployeePayrollsRoute(employee.id)}>Ver liquidaciones</Link>
              <button
                type="button"
                onClick={() => handleDelete(employee)}
                disabled={deletingEmployeeId === employee.id}
              >
                {deletingEmployeeId === employee.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default EmployeesList;
