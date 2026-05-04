import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { seAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminSEEditPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState({
    name: '', description: '', logo_url: '', website: '',
    contact_email: '', contact_phone: '', address: ''
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    if (!isNew) {
      loadSE();
    }
  }, [id, user]);

  async function loadSE() {
    try {
      const data = await seAPI.get(id);
      setForm({
        name: data.name || '',
        description: data.description || '',
        logo_url: data.logo_url || '',
        website: data.website || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        address: data.address || ''
      });
    } catch (err) {
      setError('無法載入社企資料');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await seAPI.create(form);
      } else {
        await seAPI.update(id, form);
      }
      navigate('/admin/social-enterprises');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? '新增社企' : '編輯社企'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNew ? '填寫社會企業資料以加入平台' : '修改現有社企資料'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名稱 *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">網站</label>
              <input name="website" value={form.website} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input name="logo_url" value={form.logo_url} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電郵</label>
              <input name="contact_email" type="email" value={form.contact_email} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
              {saving ? '儲存中...' : '儲存'}
            </button>
            <button type="button" onClick={() => navigate('/admin/social-enterprises')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
