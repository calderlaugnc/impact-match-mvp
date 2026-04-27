import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { seAPI } from '../services/api';

export default function SEDetailPage() {
  const { id } = useParams();
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await seAPI.get(id);
        setEnterprise(data);
      } catch (err) {
        console.error('Failed to load enterprise:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  if (!enterprise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">找不到該社企</p>
          <Link to="/social-enterprises" className="text-blue-600 hover:underline mt-2 block">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/social-enterprises" className="text-blue-600 hover:underline mb-4 block">
          ← 返回社企列表
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{enterprise.name}</h1>
          <p className="text-gray-600 mb-6">{enterprise.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {enterprise.contact_email && (
              <div>
                <span className="text-sm text-gray-500">電郵</span>
                <p className="font-medium">{enterprise.contact_email}</p>
              </div>
            )}
            {enterprise.contact_phone && (
              <div>
                <span className="text-sm text-gray-500">電話</span>
                <p className="font-medium">{enterprise.contact_phone}</p>
              </div>
            )}
            {enterprise.address && (
              <div>
                <span className="text-sm text-gray-500">地址</span>
                <p className="font-medium">{enterprise.address}</p>
              </div>
            )}
            {enterprise.website && (
              <div>
                <span className="text-sm text-gray-500">網站</span>
                <a href={enterprise.website} target="_blank" rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline block">
                  {enterprise.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        {enterprise.products && enterprise.products.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">產品與服務</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enterprise.products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.type === 'product' ? 'bg-blue-100 text-blue-700' :
                      product.type === 'service' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.type === 'product' ? '產品' : product.type === 'service' ? '服務' : '工作坊'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <p className="text-sm font-medium">
                    ${product.price_min?.toLocaleString()} - ${product.price_max?.toLocaleString()}
                    {product.unit && ` / ${product.unit}`}
                  </p>
                  {product.duration && (
                    <p className="text-sm text-gray-500 mt-1">⏱ {product.duration}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
