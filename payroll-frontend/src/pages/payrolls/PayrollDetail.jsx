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
    return <p className="status status--info">Cargando detalle de liquidacion...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Liquidaciones</p>
          <h1>Detalle de liquidacion</h1>
        </div>
      </section>
      <div className="page-actions">
        <Link className="button-link button-link--ghost" to={PAYROLLS_ROUTE}>Volver al listado</Link>
      </div>

      {error && <p className="status status--error">{error}</p>}

      {payroll && (
        <section className="surface detail-panel">
          <div className="detail-grid">
            <p><strong>ID:</strong> {payroll.id}</p>
            <p><strong>Empleado ID:</strong> {payroll.employee_id}</p>
            <p><strong>Periodo:</strong> {payroll.period}</p>
            <p><strong>Sueldo bruto:</strong> {formatCurrency(payroll.gross_salary)}</p>
            <p><strong>Descuentos:</strong> {formatCurrency(payroll.deductions)}</p>
            <p><strong>Sueldo neto:</strong> {formatCurrency(payroll.net_salary)}</p>
            <p><strong>Creado por usuario ID:</strong> {payroll.created_by}</p>
            <p><strong>Fecha de creacion:</strong> {formatDate(payroll.created_at)}</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default PayrollDetail;
