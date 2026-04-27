import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';

const CATEGORIES = [
  { value: 'employee_benefit', label: '員工福利' },
  { value: 'procurement', label: '企業採購' },
  { value: 'workshop', label: '工作坊' }
];

const TAGS = [
  '環保', '殘疾人士', '長者', '青年', '少數族裔',
  '婦女', '健康', '教育', '藝術', '文化', '共融', '食品'
];

export default function MatchRequestPage() {
  const [form, setForm] = useState({
    category: 'employee_benefit',
    budget_min: '',
    budget_max: '',
    people_count: '',
    preferred_tags: [],
    timeframe: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTagToggle = (tag) => {
    setForm(prev => ({
      ...prev,
      preferred_tags: prev.preferred_tags.includes(tag)
        ? prev.preferred_tags.filter(t => t !== tag)
        : [...prev.preferred_tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await matchAPI.create({
        ...form,
        budget_min: parseInt(form.budget_min),
        budget_max: parseInt(form.budget_max),
        people_count: parseInt(form.people_count) || undefined
      });
      navigate(`/match/results/${result.match_id}`, { state: result });
    } catch (err) {
      setError(err.message || '提交失敗');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">填寫匹配需求</h1>
        <p className="text-gray-600 mb-8">告訴我們您的需求，我們會為您找到最適合的社企方案</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">需求類別</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`py-2 px-4 rounded-lg border text-center ${
                    form.category === cat.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">預算範圍（HKD）</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="最低"
                value={form.budget_min}
                onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg"
                required
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="最高"
                value={form.budget_max}
                onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* People Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">參與人數</label>
            <input
              type="number"
              placeholder="例如：50"
              value={form.people_count}
              onChange={(e) => setForm({ ...form, people_count: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">偏好標籤（可多選）</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`py-1 px-3 rounded-full text-sm border ${
                    form.preferred_tags.includes(tag)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">期望時間</label>
            <input
              type="text"
              placeholder="例如：2026年6月"
              value={form.timeframe}
              onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? '匹配中...' : '開始匹配'}
          </button>
        </form>
      </div>
    </div>
  );
}
