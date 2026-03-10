import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getDefaultRouteByRole } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await login({ email, password });
      navigate(redirectTo || getDefaultRouteByRole(session.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteByRole(user?.role)} replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-panel__intro">
          <p className="eyebrow">Gestion empresarial</p>
          <h1>Liquidacion de sueldos</h1>
          <p>
            Accede al panel para administrar empleados, liquidaciones y recibos en una interfaz
            limpia, clara y lista para escritorio y mobile.
          </p>
        </div>

        <div className="surface auth-card">
          <div className="page-header page-header--compact">
            <div>
              <p className="eyebrow">Ingreso</p>
              <h2>Iniciar sesion</h2>
            </div>
          </div>

          {error && <p className="status status--error">{error}</p>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field field--full">
              <span>Email</span>
              <input
                type="email"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="field field--full">
              <span>Contrasena</span>
              <input
                type="password"
                placeholder="Tu contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="field--full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
