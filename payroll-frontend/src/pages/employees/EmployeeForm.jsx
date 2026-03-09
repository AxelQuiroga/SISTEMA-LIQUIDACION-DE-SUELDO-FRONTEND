import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EMPLOYEES_ROUTE } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import {
  createEmployee,
  getEmployeeById,
  updateEmployee
} from '../../services/employeeService';

const INITIAL_FORM = {
  user_id: '',
  first_name: '',
  last_name: '',
  dni: '',
  hire_date: '',
  position: '',
  base_salary: '',
  active: true
};

const mapEmployeeToForm = (employee) => ({
  user_id: employee.user_id ?? '',
  first_name: employee.first_name ?? '',
  last_name: employee.last_name ?? '',
  dni: employee.dni ?? '',
  hire_date: employee.hire_date ? employee.hire_date.slice(0, 10) : '',
  position: employee.position ?? '',
  base_salary: employee.base_salary ?? '',
  active: Boolean(employee.active)
});

const buildEmployeePayload = (formData, isEditMode) => {
  const payload = {
    user_id: formData.user_id === '' ? null : Number(formData.user_id),
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    dni: formData.dni.trim(),
    hire_date: formData.hire_date,
    position: formData.position.trim(),
    base_salary: Number(formData.base_salary)
  };

  if (isEditMode) {
    payload.active = Boolean(formData.active);
  }

  return payload;
};

function EmployeeForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const isEditMode = Boolean(employeeId);

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    let isMounted = true;

    const loadEmployee = async () => {
      try {
        setError('');
        setIsLoadingEmployee(true);
        const employee = await getEmployeeById(employeeId);

        if (isMounted) {
          setFormData(mapEmployeeToForm(employee));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'No se pudo cargar el empleado');
        }
      } finally {
        if (isMounted) {
          setIsLoadingEmployee(false);
        }
      }
    };

    loadEmployee();

    return () => {
      isMounted = false;
    };
  }, [employeeId, isEditMode]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
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
      const payload = buildEmployeePayload(formData, isEditMode);

      if (isEditMode) {
        await updateEmployee(employeeId, payload);
      } else {
        await createEmployee(payload);
      }

      navigate(EMPLOYEES_ROUTE, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isEditMode ? 'No se pudo actualizar el empleado' : 'No se pudo crear el empleado')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEmployee) {
    return <p>Cargando empleado...</p>;
  }

  return (
    <main>
      <h1>{isEditMode ? 'Editar empleado' : 'Nuevo empleado'}</h1>
      <p>Usuario: {user?.email}</p>
      <p>Rol: {user?.role}</p>
      <Link to={EMPLOYEES_ROUTE}>Volver al listado</Link>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="user_id"
          type="number"
          placeholder="User ID (opcional)"
          value={formData.user_id}
          onChange={handleChange}
        />
        <input
          name="first_name"
          type="text"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          type="text"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="dni"
          type="text"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
          required
        />
        <input
          name="hire_date"
          type="date"
          value={formData.hire_date}
          onChange={handleChange}
          required
        />
        <input
          name="position"
          type="text"
          placeholder="Puesto"
          value={formData.position}
          onChange={handleChange}
          required
        />
        <input
          name="base_salary"
          type="number"
          min="0"
          step="0.01"
          placeholder="Sueldo base"
          value={formData.base_salary}
          onChange={handleChange}
          required
        />

        {isEditMode && (
          <label>
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
            />
            Empleado activo
          </label>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Guardando cambios...'
              : 'Guardando...'
            : isEditMode
              ? 'Actualizar empleado'
              : 'Crear empleado'}
        </button>
      </form>
    </main>
  );
}

export default EmployeeForm;
