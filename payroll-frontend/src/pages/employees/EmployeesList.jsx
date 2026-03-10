import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);
  const { user } = useAuth();

  const filteredEmployees = employees.filter((employee) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [
      employee.first_name,
      employee.last_name,
      employee.dni,
      employee.position,
      String(employee.id)
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

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
    return <p className="status status--info">Cargando empleados...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Empleados</h1>
        </div>
        <p className="page-copy">Gestion de empleados para rol {user?.role}.</p>
      </section>

      <div className="page-actions">
        <Link className="button-link button-link--ghost" to={DASHBOARD_ROUTE}>Volver al dashboard</Link>
        <Link className="button-link" to={EMPLOYEE_CREATE_ROUTE}>Nuevo empleado</Link>
      </div>

      <div className="surface filter-bar">
        <label className="field field--full">
          <span>Buscar empleado</span>
          <input
            type="search"
            placeholder="Nombre, apellido, DNI, puesto o ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      {error && <p className="status status--error">{error}</p>}
      {actionError && <p className="status status--error">{actionError}</p>}

      {!error && employees.length === 0 && <p className="empty-state">No hay empleados activos registrados.</p>}
      {!error && employees.length > 0 && filteredEmployees.length === 0 && (
        <p className="empty-state">No hay empleados que coincidan con tu busqueda.</p>
      )}

      {filteredEmployees.length > 0 && (
        <section className="card-grid">
          {filteredEmployees.map((employee) => (
            <article className="surface entity-card" key={employee.id}>
              <div className="entity-card__header">
                <div>
                  <p className="entity-card__eyebrow">Empleado #{employee.id}</p>
                  <h2>
                    {employee.first_name} {employee.last_name}
                  </h2>
                </div>
                <span className="pill">{employee.position}</span>
              </div>
              <div className="detail-grid">
                <p><strong>User ID:</strong> {employee.user_id ?? '-'}</p>
                <p><strong>DNI:</strong> {employee.dni}</p>
                <p><strong>Fecha de ingreso:</strong> {formatDate(employee.hire_date)}</p>
                <p><strong>Sueldo base:</strong> {formatCurrency(employee.base_salary)}</p>
              </div>
              <div className="inline-actions">
                <Link className="button-link button-link--ghost" to={getEmployeeEditRoute(employee.id)}>Editar</Link>
                <Link className="button-link button-link--ghost" to={getEmployeePayrollsRoute(employee.id)}>Ver liquidaciones</Link>
                <button
                  className="button-danger"
                  type="button"
                  onClick={() => handleDelete(employee)}
                  disabled={deletingEmployeeId === employee.id}
                >
                  {deletingEmployeeId === employee.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default EmployeesList;
