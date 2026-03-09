export const LOGIN_ROUTE = '/login';
export const DASHBOARD_ROUTE = '/dashboard';
export const MY_PAYROLLS_ROUTE = '/my-payrolls';
export const EMPLOYEES_ROUTE = '/employees';
export const EMPLOYEE_CREATE_ROUTE = '/employees/new';
export const PAYROLLS_ROUTE = '/payrolls';
export const PAYROLL_CREATE_ROUTE = '/payrolls/new';
export const getEmployeeEditRoute = (employeeId) => `/employees/${employeeId}/edit`;
export const getPayrollDetailRoute = (payrollId) => `/payrolls/${payrollId}`;
export const getEmployeePayrollsRoute = (employeeId) => `/employees/${employeeId}/payrolls`;

export const getDefaultRouteByRole = (role) => {
  if (role === 'user') {
    return MY_PAYROLLS_ROUTE;
  }

  return DASHBOARD_ROUTE;
};
