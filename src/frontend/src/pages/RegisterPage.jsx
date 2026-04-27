import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('密碼不一致');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.register(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || '註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">IMPACT MATCH</h2>
          <p className="mt-2 text-center text-gray-600">企業註冊</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">公司名稱</label>
            <input name="company_name" value={form.company_name} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">聯絡人姓名</label>
            <input name="contact_name" value={form.contact_name} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">電郵</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">密碼</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required minLength={6} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">確認密碼</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? '註冊中...' : '註冊'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          已有帳號？ <Link to="/login" className="text-blue-600 hover:underline">立即登入</Link>
        </p>
      </div>
    </div>
  );
}
