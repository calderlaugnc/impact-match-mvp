const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 模擬數據（開發測試用，當後端不可用時返回）
const MOCK_DATA = {
  socialEnterprises: {
    data: [
      { id: 6, name: '綠點環保', description: '專注於環保產品和回收服務的社會企業，致力減少廢物並創造就業機會予弱勢社群。', website: 'https://greenpoint.hk', contact_email: 'info@greenpoint.hk', contact_phone: '2345-6789', address: '九龍灣宏開道15號' },
      { id: 7, name: '手作傳情', description: '培訓殘疾人士製作手工藝品，透過藝術表達促進社會共融。', website: 'https://handmade-care.hk', contact_email: 'hello@handmade-care.hk', contact_phone: '2893-4567', address: '灣仔軒尼詩道120號' },
      { id: 8, name: '銀齡樂活', description: '為長者提供健康食品和活動策劃服務，推動積極老齡化。', website: 'https://silverwell.hk', contact_email: 'contact@silverwell.hk', contact_phone: '3102-4567', address: '沙田石門安耀街3號' },
      { id: 9, name: '青年動力', description: '為青少年提供職業培訓和就業機會，專注於餐飲和活動服務。', website: 'https://youthpower.hk', contact_email: 'info@youthpower.hk', contact_phone: '2712-3456', address: '觀塘鴻圖道52號' },
      { id: 10, name: '共融廚房', description: '少數族裔婦女經營的餐飲服務，提供多元文化美食體驗。', website: 'https://inclusive-kitchen.hk', contact_email: 'order@inclusive-kitchen.hk', contact_phone: '2887-1234', address: '油麻地上海街45號' }
    ],
    total: 5, page: 1, limit: 20
  },
  products: {
    data: [
      { id: 1, se_id: 6, name: '環保禮品套裝', type: 'product', description: '由回收材料製作的精美禮品套裝', price_min: 50, price_max: 200, unit: '套', tags: '環保,禮品,企業' },
      { id: 2, se_id: 6, name: '辦公室回收計劃', type: 'service', description: '定期上門回收辦公室廢紙和塑料', price_min: 500, price_max: 2000, unit: '月', tags: '環保,回收,辦公室' },
      { id: 3, se_id: 7, name: '手工藝工作坊', type: 'workshop', description: '學習製作手工藝品，體驗共融文化', price_min: 150, price_max: 300, unit: '人', duration: '2小時', tags: '手工,工作坊,共融' },
      { id: 4, se_id: 8, name: '長者健康食品盒', type: 'product', description: '營養均衡的健康食品禮盒', price_min: 100, price_max: 400, unit: '盒', tags: '健康,長者,食品' },
      { id: 5, se_id: 9, name: '青年餐飲服務', type: 'service', description: '由培訓青年提供的餐飲到會服務', price_min: 80, price_max: 150, unit: '人', tags: '餐飲,青年,到會' }
    ],
    total: 5, page: 1, limit: 20
  },
  matches: {
    data: [
      { id: 1, request_data: '{"type":"workshop","budget":500}', results: '[{"product_id":3,"score":85}]', created_at: '2026-04-27 14:10:00' }
    ]
  },
  reports: {
    data: [
      { id: 1, title: '2026 Q1 影響力報告', period_start: '2026-01-01', period_end: '2026-03-31', total_beneficiaries: 120, total_spending: 15000, created_at: '2026-04-27 14:15:00' }
    ]
  },
  impact: {
    totalMatches: 15,
    totalSpending: 45000,
    totalBeneficiaries: 350,
    topCategories: ['工作坊', '環保產品', '餐飲服務']
  }
};

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
    // 如果後端不可用，返回模擬數據
    console.warn('API unavailable, using mock data:', err.message);
    return getMockData(url);
  }
}

function getMockData(url) {
  if (url.includes('/social-enterprises')) return MOCK_DATA.socialEnterprises;
  if (url.includes('/products')) return MOCK_DATA.products;
  if (url.includes('/matches')) return MOCK_DATA.matches;
  if (url.includes('/reports')) return MOCK_DATA.reports;
  if (url.includes('/impact')) return MOCK_DATA.impact;
  return { data: [] };
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
  get: (id) => fetchWithAuth(`/social-enterprises/${id}`)
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
  get: (id) => fetchWithAuth(`/matches/${id}`)
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
  userImpact: (userId) => fetchWithAuth(`/impact/user/${userId}`)
};
