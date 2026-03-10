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

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return ensureArrayResponse(response.data, 'GET /employees');
};

export const getEmployeeById = async (employeeId) => {
  const response = await api.get(`/employees/${employeeId}`);
  return ensureObjectResponse(response.data, 'GET /employees/:id');
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return ensureObjectResponse(response.data, 'POST /employees');
};

export const updateEmployee = async (employeeId, employeeData) => {
  const response = await api.put(`/employees/${employeeId}`, employeeData);
  return ensureObjectResponse(response.data, 'PUT /employees/:id');
};

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/employees/${employeeId}`);
  return ensureObjectResponse(response.data, 'DELETE /employees/:id');
};
