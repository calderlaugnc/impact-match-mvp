import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { seAPI } from '../services/api';

export default function SEListPage() {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await seAPI.list();
        setEnterprises(data.data || []);
      } catch (err) {
        console.error('Failed to load enterprises:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">社會企業</h1>
          <p className="text-gray-600 mt-1">探索香港的社會企業及其影響力方案</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="搜索社企..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((se) => (
            <div key={se.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{se.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{se.description}</p>
                
                {se.address && (
                  <p className="text-sm text-gray-500 mb-2">📍 {se.address}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {se.website && (
                    <a href={se.website} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline">
                      官方網站
                    </a>
                  )}
                </div>

                <Link
                  to={`/social-enterprise/${se.id}`}
                  className="mt-4 block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">沒有找到符合條件的社企</p>
          </div>
        )}
      </div>
    </div>
  );
}
