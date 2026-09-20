import axios from 'axios';

const API_BASE = '/api';

export const analyzeIssueApi = async (data) => {
  const response = await axios.post(`${API_BASE}/analyze`, data);
  return response.data;
};

export const submitIssueApi = async (data) => {
  const response = await axios.post(`${API_BASE}/issues`, data);
  return response.data;
};

export const fetchIssuesApi = async (params = {}) => {
  const response = await axios.get(`${API_BASE}/issues`, { params });
  return response.data;
};

export const fetchIssueByIdApi = async (id) => {
  const response = await axios.get(`${API_BASE}/issues/${id}`);
  return response.data;
};

export const updateIssueStatusApi = async (id, status, recommendedDepartment) => {
  const response = await axios.patch(`${API_BASE}/issues/${id}/status`, {
    status,
    recommendedDepartment
  });
  return response.data;
};

export const deleteIssueApi = async (id) => {
  const response = await axios.delete(`${API_BASE}/issues/${id}`);
  return response.data;
};

export const fetchDashboardStatsApi = async () => {
  const response = await axios.get(`${API_BASE}/dashboard/stats`);
  return response.data;
};

export const fetchDashboardInsightsApi = async () => {
  const response = await axios.get(`${API_BASE}/dashboard/insights`);
  return response.data;
};

export const checkDuplicateApi = async (data) => {
  const response = await axios.post(`${API_BASE}/issues/check-duplicate`, data);
  return response.data;
};
