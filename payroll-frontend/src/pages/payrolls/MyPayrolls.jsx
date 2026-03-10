import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMyPayrolls } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function MyPayrolls() {
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadPayrolls = async () => {
      try {
        setError('');
        const data = await getMyPayrolls();

        if (isMounted) {
          setPayrolls(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudieron cargar tus liquidaciones');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPayrolls();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p className="status status--info">Cargando tus liquidaciones...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Portal del empleado</p>
          <h1>Mis liquidaciones</h1>
        </div>
        <p className="page-copy">Usuario: {user?.email}</p>
      </section>

      {error && <p className="status status--error">{error}</p>}

      {!error && payrolls.length === 0 && (
        <p className="empty-state">No tenes liquidaciones registradas por el momento.</p>
      )}

      {payrolls.length > 0 && (
        <section className="card-grid">
          {payrolls.map((payroll) => (
            <article className="surface entity-card" key={payroll.id}>
              <div className="entity-card__header">
                <div>
                  <p className="entity-card__eyebrow">Recibo #{payroll.id}</p>
                  <h2>Periodo {payroll.period}</h2>
                </div>
              </div>
              <div className="detail-grid">
                <p><strong>Fecha:</strong> {formatDate(payroll.created_at)}</p>
                <p><strong>Sueldo bruto:</strong> {formatCurrency(payroll.gross_salary)}</p>
                <p><strong>Descuentos:</strong> {formatCurrency(payroll.deductions)}</p>
                <p><strong>Sueldo neto:</strong> {formatCurrency(payroll.net_salary)}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyPayrolls;
