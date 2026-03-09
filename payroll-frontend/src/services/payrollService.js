import api from '../api/axios';

export const getMyPayrolls = async () => {
  const response = await api.get('/payrolls/me');
  return response.data;
};

export const getPayrolls = async () => {
  const response = await api.get('/payrolls');
  return response.data;
};

export const getPayrollById = async (payrollId) => {
  const response = await api.get(`/payrolls/${payrollId}`);
  return response.data;
};

export const getPayrollsByEmployee = async (employeeId) => {
  const response = await api.get(`/payrolls/employee/${employeeId}`);
  return response.data;
};

export const createPayroll = async (payrollData) => {
  const response = await api.post('/payrolls', payrollData);
  return response.data;
};

export const updatePayroll = async (payrollId, payrollData) => {
  const response = await api.put(`/payrolls/${payrollId}`, payrollData);
  return response.data;
};

export const deletePayroll = async (payrollId) => {
  const response = await api.delete(`/payrolls/${payrollId}`);
  return response.data;
};
