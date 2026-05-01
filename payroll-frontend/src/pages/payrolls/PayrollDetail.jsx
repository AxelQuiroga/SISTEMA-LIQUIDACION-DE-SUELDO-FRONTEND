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
          <div className="detail-grid" style={{marginBottom: '2rem'}}>
            <p><strong>ID:</strong> {payroll.id}</p>
            <p><strong>Empleado:</strong> {payroll.employee_name || payroll.employee_id}</p>
            <p><strong>Periodo:</strong> {payroll.period}</p>
            <p><strong>Creado el:</strong> {formatDate(payroll.created_at)}</p>
          </div>

          <h3 style={{marginBottom: '1rem'}}>Detalle de Liquidación</h3>
          <table className="data-table" style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                <th style={{padding: '10px'}}>Concepto</th>
                <th style={{padding: '10px'}}>Base</th>
                <th style={{padding: '10px', textAlign: 'right'}}>Haberes</th>
                <th style={{padding: '10px', textAlign: 'right'}}>Deducciones</th>
              </tr>
            </thead>
            <tbody>
              {payroll.items && payroll.items.map((item, index) => (
                <tr key={index} style={{borderBottom: '1px solid #f9f9f9'}}>
                  <td style={{padding: '10px'}}>
                    {item.name}
                    <br />
                    <small style={{color: '#666', fontSize: '0.8rem'}}>{item.category === 'remunerative' ? 'Remunerativo' : item.category === 'non_remunerative' ? 'No Remunerativo' : 'Deducción'}</small>
                  </td>
                  <td style={{padding: '10px'}}>
                    {item.base_amount ? formatCurrency(item.base_amount) : '-'}
                  </td>
                  <td style={{padding: '10px', textAlign: 'right', color: item.category === 'deduction' ? 'inherit' : '#2e7d32'}}>
                    {item.category !== 'deduction' ? formatCurrency(item.amount) : ''}
                  </td>
                  <td style={{padding: '10px', textAlign: 'right', color: '#c62828'}}>
                    {item.category === 'deduction' ? formatCurrency(item.amount) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{borderTop: '2px solid #eee', fontWeight: 'bold'}}>
                <td colSpan="2" style={{padding: '10px', textAlign: 'right'}}>Subtotales:</td>
                <td style={{padding: '10px', textAlign: 'right', color: '#2e7d32'}}>{formatCurrency(Number(payroll.gross_salary) + Number(payroll.total_non_remunerative))}</td>
                <td style={{padding: '10px', textAlign: 'right', color: '#c62828'}}>{formatCurrency(payroll.total_deductions)}</td>
              </tr>
              <tr style={{backgroundColor: '#f5f5f5', fontSize: '1.2rem'}}>
                <td colSpan="3" style={{padding: '15px', textAlign: 'right'}}>NETO A COBRAR:</td>
                <td style={{padding: '15px', textAlign: 'right', color: '#1a237e'}}>{formatCurrency(payroll.net_salary)}</td>
              </tr>
            </tfoot>
          </table>
        </section>
      )}
    </main>
  );
}

export default PayrollDetail;
