import api from '../api/axios';

const ensureArrayResponse = (data, endpointName) => {
  if (!Array.isArray(data)) {
    throw new Error(`Respuesta invalida en ${endpointName}`);
  }

  return data;
};

const ensureObjectResponse = (data, endpointName) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Respuesta invalida en ${endpointName}`);
  }

  return data;
};

export const getMyPayrolls = async () => {
  const response = await api.get('/payrolls/me');
  return ensureArrayResponse(response.data, 'GET /payrolls/me');
};

export const getPayrolls = async () => {
  const response = await api.get('/payrolls');
  return ensureArrayResponse(response.data, 'GET /payrolls');
};

export const getPayrollById = async (payrollId) => {
  const response = await api.get(`/payrolls/${payrollId}`);
  return ensureObjectResponse(response.data, 'GET /payrolls/:id');
};

export const getPayrollsByEmployee = async (employeeId) => {
  const response = await api.get(`/payrolls/employee/${employeeId}`);
  return ensureArrayResponse(response.data, 'GET /payrolls/employee/:employee_id');
};

export const createPayroll = async (payrollData) => {
  const response = await api.post('/payrolls', payrollData);
  return ensureObjectResponse(response.data, 'POST /payrolls');
};

export const updatePayroll = async (payrollId, payrollData) => {
  const response = await api.put(`/payrolls/${payrollId}`, payrollData);
  return ensureObjectResponse(response.data, 'PUT /payrolls/:id');
};

export const deletePayroll = async (payrollId) => {
  const response = await api.delete(`/payrolls/${payrollId}`);
  return ensureObjectResponse(response.data, 'DELETE /payrolls/:id');
};
