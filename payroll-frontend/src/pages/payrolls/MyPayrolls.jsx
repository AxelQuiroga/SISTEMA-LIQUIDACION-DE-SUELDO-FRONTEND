import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMyPayrolls } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function MyPayrolls() {
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return <p>Cargando tus liquidaciones...</p>;
  }

  return (
    <main>
      <h1>Mis liquidaciones</h1>
      <p>Usuario: {user?.email}</p>
      <button type="button" onClick={handleLogout}>
        Cerrar sesion
      </button>

      {error && <p>{error}</p>}

      {!error && payrolls.length === 0 && (
        <p>No tenes liquidaciones registradas por el momento.</p>
      )}

      {payrolls.length > 0 && (
        <section>
          {payrolls.map((payroll) => (
            <article key={payroll.id}>
              <h2>Periodo: {payroll.period}</h2>
              <p>Fecha: {formatDate(payroll.created_at)}</p>
              <p>Sueldo bruto: {formatCurrency(payroll.gross_salary)}</p>
              <p>Descuentos: {formatCurrency(payroll.deductions)}</p>
              <p>Sueldo neto: {formatCurrency(payroll.net_salary)}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyPayrolls;
