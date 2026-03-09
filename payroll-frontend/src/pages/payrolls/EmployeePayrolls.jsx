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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { employeeId } = useParams();

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
    return <p>Cargando liquidaciones del empleado...</p>;
  }

  return (
    <main>
      <h1>Liquidaciones por empleado</h1>
      <Link to={EMPLOYEES_ROUTE}>Volver a empleados</Link>

      {error && <p>{error}</p>}

      {employee && (
        <section>
          <p>
            Empleado: {employee.first_name} {employee.last_name}
          </p>
          <p>DNI: {employee.dni}</p>
          <p>Puesto: {employee.position}</p>
        </section>
      )}

      {!error && payrolls.length === 0 && <p>Este empleado no tiene liquidaciones registradas.</p>}

      {payrolls.length > 0 && (
        <section>
          {payrolls.map((payroll) => (
            <article key={payroll.id}>
              <p>ID: {payroll.id}</p>
              <p>Periodo: {payroll.period}</p>
              <p>Fecha: {formatDate(payroll.created_at)}</p>
              <p>Bruto: {formatCurrency(payroll.gross_salary)}</p>
              <p>Descuentos: {formatCurrency(payroll.deductions)}</p>
              <p>Neto: {formatCurrency(payroll.net_salary)}</p>
              <Link to={getPayrollDetailRoute(payroll.id)}>Ver detalle</Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default EmployeePayrolls;
