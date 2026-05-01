import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PAYROLLS_ROUTE } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { getEmployees } from '../../services/employeeService';
import { createPayroll } from '../../services/payrollService';

const INITIAL_FORM = {
  employee_id: '',
  period: '',
  extra_hours_amount: '',
  has_absences: false,
  via: ''
};

const buildPayrollPayload = (formData) => ({
  employee_id: Number(formData.employee_id),
  period: formData.period,
  news: {
    extra_hours_amount: Number(formData.extra_hours_amount || 0),
    has_absences: formData.has_absences,
    via: Number(formData.via || 0)
  }
});

function PayrollForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
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
          setIsLoadingEmployees(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createPayroll(buildPayrollPayload(formData));
      navigate(PAYROLLS_ROUTE, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la liquidacion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEmployees) {
    return <p className="status status--info">Cargando empleados...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Liquidaciones</p>
          <h1>Nueva liquidacion</h1>
        </div>
        <p className="page-copy">Operacion disponible para rol {user?.role}.</p>
      </section>
      <div className="page-actions">
        <Link className="button-link button-link--ghost" to={PAYROLLS_ROUTE}>Volver al listado</Link>
      </div>

      {error && <p className="status status--error">{error}</p>}

      {employees.length === 0 ? (
        <p className="empty-state">No hay empleados activos disponibles para liquidar.</p>
      ) : (
        <form className="surface form-shell form-grid" onSubmit={handleSubmit}>
          <label className="field field--full">
            <span>Empleado</span>
            <select name="employee_id" value={formData.employee_id} onChange={handleChange} required>
              <option value="">Seleccionar empleado</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} - DNI {employee.dni}
                </option>
              ))}
            </select>
          </label>
          <label className="field field--full">
            <span>Periodo</span>
            <input name="period" type="month" value={formData.period} onChange={handleChange} required />
          </label>
          
          <h3 className="field--full" style={{marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>Novedades del Mes</h3>
          
          <label className="field">
            <span>Monto Horas Extra</span>
            <input name="extra_hours_amount" type="number" min="0" step="0.01" placeholder="0.00" value={formData.extra_hours_amount} onChange={handleChange} />
          </label>

          <label className="field">
            <span>Viáticos (No Rem.)</span>
            <input name="via" type="number" min="0" step="0.01" placeholder="0.00" value={formData.via} onChange={handleChange} />
          </label>

          <label className="field field--row field--full" style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
            <input name="has_absences" type="checkbox" checked={formData.has_absences} onChange={handleChange} style={{width: 'auto'}} />
            <span>¿Tuvo inasistencias? (Pierde presentismo)</span>
          </label>

          <button className="field--full" type="submit" disabled={isSubmitting} style={{marginTop: '1rem'}}>
            {isSubmitting ? 'Calculando y Guardando...' : 'Liquidar Sueldo'}
          </button>
        </form>
      )}
    </main>
  );
}

export default PayrollForm;
