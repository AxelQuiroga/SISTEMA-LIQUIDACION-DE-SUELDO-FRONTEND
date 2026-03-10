import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import {
  DASHBOARD_ROUTE,
  EMPLOYEE_CREATE_ROUTE,
  EMPLOYEES_ROUTE,
  LOGIN_ROUTE,
  PAYROLLS_ROUTE,
  PAYROLL_CREATE_ROUTE,
  MY_PAYROLLS_ROUTE
} from '../constants/routes';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import EmployeeForm from '../pages/employees/EmployeeForm';
import EmployeesList from '../pages/employees/EmployeesList';
import EmployeePayrolls from '../pages/payrolls/EmployeePayrolls';
import MyPayrolls from '../pages/payrolls/MyPayrolls';
import PayrollDetail from '../pages/payrolls/PayrollDetail';
import PayrollForm from '../pages/payrolls/PayrollForm';
import PayrollList from '../pages/payrolls/PayrollList';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={LOGIN_ROUTE} replace />} />
        <Route path={LOGIN_ROUTE} element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'superadmin']} />}>
          <Route path={DASHBOARD_ROUTE} element={<Dashboard />} />
          <Route path={PAYROLLS_ROUTE} element={<PayrollList />} />
          <Route path={PAYROLL_CREATE_ROUTE} element={<PayrollForm />} />
          <Route path="/payrolls/:payrollId" element={<PayrollDetail />} />
          <Route path="/employees/:employeeId/payrolls" element={<EmployeePayrolls />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route path={EMPLOYEES_ROUTE} element={<EmployeesList />} />
          <Route path={EMPLOYEE_CREATE_ROUTE} element={<EmployeeForm />} />
          <Route path="/employees/:employeeId/edit" element={<EmployeeForm />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path={MY_PAYROLLS_ROUTE} element={<MyPayrolls />} />
        </Route>
        <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
