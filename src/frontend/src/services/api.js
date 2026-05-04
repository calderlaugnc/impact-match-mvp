const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('token');
}

async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error('無法連接伺服器，請檢查網絡或稍後再試');
    }
    throw err;
  }
}

export const authAPI = {
  login: (email, password) => fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (data) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const seAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/social-enterprises?${query}`);
  },
  get: (id) => fetchWithAuth(`/social-enterprises/${id}`),
  create: (data) => fetchWithAuth('/social-enterprises', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchWithAuth(`/social-enterprises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchWithAuth(`/social-enterprises/${id}`, {
    method: 'DELETE'
  })
};

export const productAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/products?${query}`);
  },
  get: (id) => fetchWithAuth(`/products/${id}`)
};

export const matchAPI = {
  create: (data) => fetchWithAuth('/match', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  list: () => fetchWithAuth('/matches'),
  get: (id) => fetchWithAuth(`/matches/${id}`),
  listAll: () => fetchWithAuth('/matches/admin/all')
};

export const reportAPI = {
  list: () => fetchWithAuth('/reports'),
  get: (id) => fetchWithAuth(`/reports/${id}`),
  create: (data) => fetchWithAuth('/reports', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const impactAPI = {
  summary: () => fetchWithAuth('/impact/summary'),
  userImpact: (userId) => fetchWithAuth(`/impact/user/${userId}`),
  adminSummary: () => fetchWithAuth('/impact/admin/summary')
};
