import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Resumen</p>
          <h1>Dashboard</h1>
        </div>
        <p className="page-copy">Sesion activa para {user?.email}.</p>
      </section>

      <section className="dashboard-grid">
        <article className="surface metric-card">
          <span className="metric-card__label">Rol</span>
          <strong>{user?.role}</strong>
          <p>Los accesos del menu superior se adaptan automaticamente a este perfil.</p>
        </article>
        <article className="surface metric-card">
          <span className="metric-card__label">Estado</span>
          <strong>Operativo</strong>
          <p>El frontend ya consume autenticacion, empleados y liquidaciones del backend.</p>
        </article>
        <article className="surface metric-card">
          <span className="metric-card__label">Siguiente accion</span>
          <strong>Navega por modulos</strong>
          <p>Usa la barra superior para pasar entre empleados, liquidaciones o recibos propios.</p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
