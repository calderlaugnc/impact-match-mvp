import { useLocation, Link } from 'react-router-dom';

export default function MatchResultsPage() {
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">沒有匹配結果</p>
          <Link to="/match" className="text-blue-600 hover:underline">返回重新匹配</Link>
        </div>
      </div>
    );
  }

  const { results, request } = result;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">匹配結果</h1>
          <p className="text-gray-600 mt-1">
            為您的{request.category === 'employee_benefit' ? '員工福利' : request.category === 'procurement' ? '企業採購' : '工作坊'}需求找到 {results.length} 個推薦方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div key={item.product_id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.type === 'product' ? 'bg-blue-100 text-blue-700' :
                    item.type === 'service' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.type === 'product' ? '產品' : item.type === 'service' ? '服務' : '工作坊'}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">{item.match_percentage}%</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.se_name}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    ${item.price_min?.toLocaleString()} - ${item.price_max?.toLocaleString()}
                    {item.unit && ` / ${item.unit}`}
                  </span>
                </div>

                {item.impact_metrics && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">影響力指標</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {item.impact_metrics.beneficiaries && (
                        <div className="text-green-600">
                          受益人數: {item.impact_metrics.beneficiaries}
                        </div>
                      )}
                      {item.impact_metrics.jobs_created && (
                        <div className="text-blue-600">
                          創造就業: {item.impact_metrics.jobs_created}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Link
                  to={`/social-enterprise/${item.se_id}`}
                  className="mt-4 block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
