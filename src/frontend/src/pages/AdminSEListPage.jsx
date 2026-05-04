import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { seAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminSEListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const data = await seAPI.list({ limit: 100 });
      setEnterprises(data.data || []);
    } catch (err) {
      console.error('Failed to load enterprises:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`確定要刪除「${name}」嗎？此操作不可復原。`)) return;
    try {
      await seAPI.delete(id);
      setMessage(`已刪除「${name}」`);
      loadData();
    } catch (err) {
      alert('刪除失敗：' + err.message);
    }
  }

  const filtered = enterprises.filter(se =>
    se.name?.toLowerCase().includes(search.toLowerCase()) ||
    se.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理社企列表</h1>
            <p className="text-gray-600 mt-1">新增、編輯或刪除社會企業資料</p>
          </div>
          <Link to="/admin/social-enterprises/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            + 新增社企
          </Link>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="搜尋社企名稱或描述..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名稱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">聯絡電郵</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">電話</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((se) => (
                <tr key={se.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{se.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{se.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{se.contact_email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{se.contact_phone || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/admin/social-enterprises/${se.id}`}
                      className="text-blue-600 hover:underline text-sm">編輯</Link>
                    <button onClick={() => handleDelete(se.id, se.name)}
                      className="text-red-600 hover:underline text-sm">刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">沒有找到符合的社企</div>
          )}
        </div>
      </div>
    </div>
  );
}
