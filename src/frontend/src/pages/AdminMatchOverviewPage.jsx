import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryLabels = {
  employee_benefit: '員工福利',
  procurement: '企業採購',
  workshop: '工作坊 / 活動',
  other: '其他'
};

export default function AdminMatchOverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, thisWeek: 0 });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const data = await matchAPI.listAll();
      setMatches(data || []);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStats({
        total: data.length,
        thisWeek: data.filter(m => new Date(m.created_at) >= weekAgo).length
      });
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = matches.filter(m => {
    const q = search.toLowerCase();
    return (
      m.company_name?.toLowerCase().includes(q) ||
      m.contact_name?.toLowerCase().includes(q) ||
      m.user_email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">配對需求總覽</h1>
          <p className="text-gray-600 mt-1">檢視所有企業客戶提交的社企配對需求</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">總配對次數</div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">本週新增</div>
            <div className="text-3xl font-bold text-green-600">{stats.thisWeek}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">參與企業</div>
            <div className="text-3xl font-bold text-purple-600">
              {new Set(matches.map(m => m.user_id)).size}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="搜尋公司名稱或聯絡人..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">企業客戶</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">需求類別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">預算範圍</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">人數</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{match.company_name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{match.contact_name}</div>
                    <div className="text-xs text-gray-400">{match.user_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {categoryLabels[match.request_data?.category] || '其他'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {match.request_data?.budget_min ? (
                      <>HK${match.request_data.budget_min.toLocaleString()} - ${match.request_data.budget_max?.toLocaleString()}</>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {match.request_data?.people_count || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(match.created_at).toLocaleDateString('zh-HK')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">沒有找到符合的配對記錄</div>
          )}
        </div>
      </div>
    </div>
  );
}
