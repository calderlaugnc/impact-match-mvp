import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// 模擬用戶數據（開發測試用）
const MOCK_USER = {
  id: 1,
  company_name: '測試企業有限公司',
  contact_name: '陳先生',
  email: 'admin@impactmatch.hk',
  role: 'user'
};

const MOCK_TOKEN = 'mock-jwt-token-for-development';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 開發用：一鍵模擬登入
  const devLogin = () => {
    localStorage.setItem('token', MOCK_TOKEN);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, devLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
