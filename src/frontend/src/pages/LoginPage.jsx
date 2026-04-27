import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.login(email, password);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || '登入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    devLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">IMPACT MATCH</h2>
          <p className="mt-2 text-center text-gray-600">企業登入</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">電郵</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div className="border-t pt-4">
          <button
            onClick={handleDevLogin}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            ⚡ 開發者快速登入（跳過驗證）
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">本地測試專用，一鍵進入系統</p>
        </div>
        
        <p className="text-center text-sm text-gray-600">
          還沒有帳號？ <Link to="/register" className="text-blue-600 hover:underline">立即註冊</Link>
        </p>
      </div>
    </div>
  );
}
