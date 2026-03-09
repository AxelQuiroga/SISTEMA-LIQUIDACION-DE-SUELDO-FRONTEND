import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PAYROLLS_ROUTE } from '../../constants/routes';
import { getPayrollById } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function PayrollDetail() {
  const [payroll, setPayroll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { payrollId } = useParams();

  useEffect(() => {
    let isMounted = true;

    const loadPayroll = async () => {
      try {
        setError('');
        const data = await getPayrollById(payrollId);

        if (isMounted) {
          setPayroll(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudo cargar la liquidacion');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPayroll();

    return () => {
      isMounted = false;
    };
  }, [payrollId]);

  if (isLoading) {
    return <p>Cargando detalle de liquidacion...</p>;
  }

  return (
    <main>
      <h1>Detalle de liquidacion</h1>
      <Link to={PAYROLLS_ROUTE}>Volver al listado</Link>

      {error && <p>{error}</p>}

      {payroll && (
        <section>
          <p>ID: {payroll.id}</p>
          <p>Empleado ID: {payroll.employee_id}</p>
          <p>Periodo: {payroll.period}</p>
          <p>Sueldo bruto: {formatCurrency(payroll.gross_salary)}</p>
          <p>Descuentos: {formatCurrency(payroll.deductions)}</p>
          <p>Sueldo neto: {formatCurrency(payroll.net_salary)}</p>
          <p>Creado por usuario ID: {payroll.created_by}</p>
          <p>Fecha de creacion: {formatDate(payroll.created_at)}</p>
        </section>
      )}
    </main>
  );
}

export default PayrollDetail;
