import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  EMPLOYEES_ROUTE,
  getPayrollDetailRoute
} from '../../constants/routes';
import { getEmployeeById } from '../../services/employeeService';
import { getPayrollsByEmployee } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function EmployeePayrolls() {
  const [employee, setEmployee] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [periodFilter, setPeriodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { employeeId } = useParams();

  const filteredPayrolls = payrolls.filter((payroll) => {
    if (!periodFilter) {
      return true;
    }

    return payroll.period === periodFilter;
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setError('');
        const [employeeData, payrollData] = await Promise.all([
          getEmployeeById(employeeId),
          getPayrollsByEmployee(employeeId)
        ]);

        if (isMounted) {
          setEmployee(employeeData);
          setPayrolls(payrollData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudieron cargar las liquidaciones del empleado');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  if (isLoading) {
    return <p className="status status--info">Cargando liquidaciones del empleado...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Historial</p>
          <h1>Liquidaciones por empleado</h1>
        </div>
      </section>
      <div className="page-actions">
        <Link className="button-link button-link--ghost" to={EMPLOYEES_ROUTE}>Volver a empleados</Link>
      </div>

      {error && <p className="status status--error">{error}</p>}

      {employee && (
        <section className="surface detail-panel">
          <div className="detail-grid">
            <p><strong>Empleado:</strong> {employee.first_name} {employee.last_name}</p>
            <p><strong>DNI:</strong> {employee.dni}</p>
            <p><strong>Puesto:</strong> {employee.position}</p>
          </div>
        </section>
      )}

      {payrolls.length > 0 && (
        <div className="surface filter-bar">
          <label className="field">
            <span>Filtrar por periodo</span>
            <input
              type="month"
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
            />
          </label>
        </div>
      )}

      {!error && payrolls.length === 0 && <p className="empty-state">Este empleado no tiene liquidaciones registradas.</p>}
      {!error && payrolls.length > 0 && filteredPayrolls.length === 0 && (
        <p className="empty-state">No hay liquidaciones para el periodo seleccionado.</p>
      )}

      {filteredPayrolls.length > 0 && (
        <section className="card-grid">
          {filteredPayrolls.map((payroll) => (
            <article className="surface entity-card" key={payroll.id}>
              <div className="entity-card__header">
                <div>
                  <p className="entity-card__eyebrow">Liquidacion #{payroll.id}</p>
                  <h2>Periodo {payroll.period}</h2>
                </div>
              </div>
              <div className="detail-grid">
                <p><strong>Fecha:</strong> {formatDate(payroll.created_at)}</p>
                <p><strong>Bruto:</strong> {formatCurrency(payroll.gross_salary)}</p>
                <p><strong>Descuentos:</strong> {formatCurrency(payroll.deductions)}</p>
                <p><strong>Neto:</strong> {formatCurrency(payroll.net_salary)}</p>
              </div>
              <div className="inline-actions">
                <Link className="button-link button-link--ghost" to={getPayrollDetailRoute(payroll.id)}>Ver detalle</Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default EmployeePayrolls;
