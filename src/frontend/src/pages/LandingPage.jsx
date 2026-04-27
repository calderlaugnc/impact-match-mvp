import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h1 className="text-5xl font-bold mb-6">IMPACT MATCH</h1>
          <p className="text-2xl mb-4 opacity-90">香港影響力匹配平台</p>
          <p className="text-lg opacity-80 max-w-2xl mb-8">
            幫助企業按需求匹配社會企業的產品、服務及工作坊，
            將您的企業預算轉化為真實的社會影響力。
          </p>
          <div className="flex gap-4">
            <Link to="/register"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100">
              立即開始
            </Link>
            <Link to="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10">
              企業登入
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">平台功能</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">智能匹配</h3>
            <p className="text-gray-600">
              根據您的預算、人數和偏好，自動推薦最適合的社企方案
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">影響力追蹤</h3>
            <p className="text-gray-600">
              量化您的社會貢獻：受益人數、就業創造、環境效益
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">報告生成</h3>
            <p className="text-gray-600">
              一鍵生成專業的影響力報告，用於 ESG 披露和內部匯報
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">準備好產生影響力了嗎？</h2>
          <p className="text-gray-600 mb-8">
            加入越來越多選擇「影響力採購」的香港企業
          </p>
          <Link to="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            免費註冊
          </Link>
        </div>
      </div>
    </div>
  );
}
