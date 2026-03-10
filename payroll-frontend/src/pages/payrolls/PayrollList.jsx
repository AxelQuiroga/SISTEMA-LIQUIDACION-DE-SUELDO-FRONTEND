import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DASHBOARD_ROUTE,
  PAYROLL_CREATE_ROUTE,
  getPayrollDetailRoute
} from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { getPayrolls } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';

function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const filteredPayrolls = payrolls.filter((payroll) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      [
        payroll.first_name,
        payroll.last_name,
        payroll.position,
        payroll.period,
        String(payroll.id)
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));

    const matchesPeriod = !periodFilter || payroll.period === periodFilter;

    return matchesSearch && matchesPeriod;
  });

  useEffect(() => {
    let isMounted = true;

    const loadPayrolls = async () => {
      try {
        setError('');
        const data = await getPayrolls();

        if (isMounted) {
          setPayrolls(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudieron cargar las liquidaciones');
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
    return <p className="status status--info">Cargando liquidaciones...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Liquidaciones</p>
          <h1>Recibos y periodos</h1>
        </div>
        <p className="page-copy">Gestion de liquidaciones para rol {user?.role}.</p>
      </section>
      <div className="page-actions">
        <Link className="button-link button-link--ghost" to={DASHBOARD_ROUTE}>Volver al dashboard</Link>
        <Link className="button-link" to={PAYROLL_CREATE_ROUTE}>Nueva liquidacion</Link>
      </div>

      <div className="surface filter-bar filter-bar--dual">
        <label className="field">
          <span>Buscar liquidacion</span>
          <input
            type="search"
            placeholder="Empleado, puesto, periodo o ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Filtrar por periodo</span>
          <input
            type="month"
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
          />
        </label>
      </div>

      {error && <p className="status status--error">{error}</p>}

      {!error && payrolls.length === 0 && <p className="empty-state">No hay liquidaciones registradas.</p>}
      {!error && payrolls.length > 0 && filteredPayrolls.length === 0 && (
        <p className="empty-state">No hay liquidaciones que coincidan con tus filtros.</p>
      )}

      {filteredPayrolls.length > 0 && (
        <section className="card-grid">
          {filteredPayrolls.map((payroll) => (
            <article className="surface entity-card" key={payroll.id}>
              <div className="entity-card__header">
                <div>
                  <p className="entity-card__eyebrow">Liquidacion #{payroll.id}</p>
                  <h2>
                    {payroll.first_name} {payroll.last_name}
                  </h2>
                </div>
                <span className="pill">{payroll.period}</span>
              </div>
              <div className="detail-grid">
                <p><strong>Puesto:</strong> {payroll.position}</p>
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

export default PayrollList;
