import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PAYROLLS_ROUTE } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { getEmployees } from '../../services/employeeService';
import { createPayroll } from '../../services/payrollService';

const INITIAL_FORM = {
  employee_id: '',
  period: '',
  gross_salary: '',
  deductions: '',
  bonuses: '',
  extra_hours: ''
};

const buildPayrollPayload = (formData) => ({
  employee_id: Number(formData.employee_id),
  period: formData.period,
  gross_salary: Number(formData.gross_salary),
  deductions: Number(formData.deductions || 0),
  bonuses: Number(formData.bonuses || 0),
  extra_hours: Number(formData.extra_hours || 0)
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
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
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
          <label className="field">
            <span>Periodo</span>
            <input name="period" type="month" value={formData.period} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Sueldo bruto</span>
            <input name="gross_salary" type="number" min="0" step="0.01" placeholder="Sueldo bruto" value={formData.gross_salary} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Descuentos</span>
            <input name="deductions" type="number" min="0" step="0.01" placeholder="Descuentos" value={formData.deductions} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Bonificaciones</span>
            <input name="bonuses" type="number" min="0" step="0.01" placeholder="Bonificaciones" value={formData.bonuses} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Horas extra</span>
            <input name="extra_hours" type="number" min="0" step="0.01" placeholder="Horas extra" value={formData.extra_hours} onChange={handleChange} />
          </label>

          <button className="field--full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear liquidacion'}
          </button>
        </form>
      )}
    </main>
  );
}

export default PayrollForm;
