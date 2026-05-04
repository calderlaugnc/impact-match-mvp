# Impact Match MVP — 靜態 Code Review 報告

**審計日期**: 2026-05-04
**審計範圍**: src/backend/ (全 12 文件) + src/frontend/src/ (全 12 文件)
**總體評估**: 6.5/10 — 後端架構穩健，前端有致命缺陷

---

## 🔴 Critical Issues

### C1 — api.js 靜默降級到 Mock Data（破壞性設計）
**文件**: `src/frontend/src/services/api.js`  
**行號**: L85-L89  
**問題**: `fetchWithAuth` 在**任何 API 錯誤**（包括 400 驗證失敗、404 不存在、500 崩潰）時都靜默返回 mock data。用戶永遠看不到真實錯誤，導致：
- 註冊失敗 → 顯示 mock 社企列表（用戶以為成功了）
- 匹配失敗 → 返回 5 條固定 mock 結果（不是真實匹配）
- 後端下線 → 頁面顯示 mock 數據（用戶不會發現問題）
- Mock 數據格式與真實 API 多處不一致（SE 無 data/total/page/limit 包裝、tags 是 string 不是 array）

**修復建議**: 完全移除 `getMockData` 降級邏輯。改為：
```javascript
} catch (err) {
  // Don't fallback silently
  throw err;
}
```
僅在 `err.message === 'Failed to fetch'` 時顯示「後端無法連接」提示。

### C2 — JWT Secret 硬編碼 Fallback
**文件**: `src/backend/src/middleware/auth.js`  
**行號**: L3  
**問題**: `process.env.JWT_SECRET || 'impactmatch-dev-secret'` — 若 Render 環境變數注入失敗，所有 token 可用此公開字串簽發。  
**緩解**: `render.yaml` 有 `generateValue: true` 自動生成，且 env var 注入失敗概率極低。  
**修復建議**: 改為不提供 fallback，或至少打印 warning：
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required');
  }
  console.warn('⚠️ Using dev JWT secret');
}
```

---

## 🟠 High Issues

### H1 — 無 Rate Limiting
**所有 API routes** — 無 `express-rate-limit`，/auth/login 可被暴力嘗試。  
**修復**: 添加 `express-rate-limit`，auth routes 設 5 req/min，其他 100 req/min。

### H2 — 匹配 Route 無輸入驗證
**文件**: `src/backend/src/routes/matches.js` L12-L18  
**問題**: `req.body` 直接解構無任何驗證。`category` 可為任意值，`budget_min/budget_max` 可非數字，可能導致匹配引擎崩潰或 SQLite 錯誤。  
**修復**: 使用 express-validator 或至少手動校驗：
```javascript
const validCategories = ['employee_benefit', 'procurement', 'workshop', 'esg', 'all'];
if (!validCategories.includes(category)) return res.status(400).json(...);
```

### H3 — 管理員前端頁面完全缺失 (0/3)
**PRD 功能**: 社企 CRUD、標籤管理、用戶需求列表（管理員後台）  
**現狀**: 後端 API 已完整實作（`requireAdmin` middleware + CRUD routes），但前端完全沒有對應頁面。Router 無 `/admin` 路徑。  
**這是最明顯的「未完成」環節。**

### H4 — api.js Mock SE/Product 格式錯誤
**文件**: `src/frontend/src/services/api.js` L4-L40  
**問題**: MOCK_DATA 格式與真實 API 不一致：
- 真實 SE API 返回 `{ data: [...], total, page, limit }`，mock 雖有包裝但 tags 字段缺失
- 真實 Product API 返回 tags 為 `JSON.parse()` 後的 array，mock 中 tags 為 string
- MOCK matches 返回 results 為 string（未 parse），前端 MatchResultsPage 會崩潰

### H5 — Matching 引擎 JSON.parse 無保護
**文件**: `src/backend/src/services/matching.js` L22-L23  
**問題**: `JSON.parse(product.tags || '[]')` 在 callback 內無 try-catch。若數據庫中 tags 為非標準 JSON，整個 matching 流程崩潰且不會返回錯誤（因在 `db.all` callback 內）。

---

## 🟡 Medium Issues

### M1 — 影響力儀表板頁面不存在
`ImpactPage.jsx` 不存在。router 無 `/impact` 路徑。但 `impactAPI` service 已定義。PRD 頁面流程中包含 `/impact`。

### M2 — ReportsPage 有 Dead Link
`/reports` 頁面的「生成新報告」按鈕指向 `/reports/new`，但此路由不存在。`reports.js` route 只實作 `GET /`、`GET /:id`、`POST /`（API），無前端新建頁面。

### M3 — Dashboard 硬編碼平台社企數為 "5+"
**文件**: `DashboardPage.jsx` L51  
應從 API 動態獲取（`GET /api/impact/summary` 已返回 `social_enterprises` 計數）。

### M4 — SE 刪除不級聯產品
**文件**: `socialEnterprises.js` DELETE route  
`DELETE FROM social_enterprises WHERE id = ?` — products 表有 `FOREIGN KEY (se_id) REFERENCES social_enterprises(id)` 但無 `ON DELETE CASCADE`。刪除 SE 後 orphan products 殘留，查 product by se_id 仍返回（但 JOIN 會失敗）。

### M5 — errorHandler Stack Trace 暴露
**文件**: `errorHandler.js` L12  
NODE_ENV === 'development' 時返回 stack trace。確保 Production 設為非 'development'。

### M6 — Seed Data SQLITE_PATH 硬編碼
`seed.js` 和 `database.js` 都使用 `path.join(__dirname, '../../data/impactmatch.db')`，與 Render 磁盤路徑 `/opt/render/project/src/src/backend/data/` 不完全一致。Server.js 通過 env var 覆寫，但 seed script 需要確保也讀取 env var。

### M7 — 後端 Auth Route 使用 Callback 而非 Promise
`auth.js` 中同時使用 callbacks (`db.get/db.run`) 和 `async/await` (bcrypt)，混合模式增加維護難度。

---

## 🟢 Low Issues

- **L1**: Dashboard 快速操作按鈕無 loading state
- **L2**: MatchResultsPage impact_metrics 只顯示 beneficiaries 和 jobs_created（忽略其他指標）
- **L3**: Landing Page 無 footer
- **L4**: LoginPage / RegisterPage 未讀取（推測有 table 樣式但無驗證問題）
- **L5**: 無 TypeScript（MVP 合理省略）

---

## 部署就緒度評估

| 維度 | 狀態 | 備註 |
|------|------|------|
| render.yaml | ✅ 就緒 | 含 disk + JWT_SECRET 自動生成 |
| vercel.json | ✅ 就緒 | VITE_API_URL 正確指向 Render |
| Health check | ✅ | GET /health |
| 冷啟動 | ⚠️ | Render free plan 30-60s 延遲，前端需處理 |
| 種子數據 | ⚠️ | 僅 5 SE / 10 products，需擴充 |
| 數據持久化 | ✅ | Render 磁盤已配置 |

## 功能完成度 vs PRD 對照

| PRD 功能 | 後端 | 前端 | 完成度 |
|----------|------|------|--------|
| US-001 用戶註冊 | ✅ | ✅ | 100% |
| US-002 用戶登入 | ✅ | ✅ | 100% |
| US-003 需求表單 | ✅ | ✅ | 85%* |
| US-004 匹配推薦 | ✅ | ✅ | 80%** |
| US-005 社企詳情 | ✅ | ✅ | 100% |
| US-006 影響力追蹤 | ✅ | ❌ | 40% |
| US-007 報告 PDF | ✅ | ✅ | 70%*** |
| US-101 添加社企 | ✅ | ❌ | 50% |
| US-102 編輯社企 | ✅ | ❌ | 50% |
| US-103 需求列表 | ❌ | ❌ | 0% |
| **總體** | **85%** | **55%** | **70%** |

\* 缺輸入驗證  
\** Mock fallback 破壞真實功能  
\*** 缺新建報告頁面 + PDF 中文方框

---

## 優先修復順序

1. 🔴 **修復 api.js 靜默降級**（單文件改動，最高影響）
2. 🔴 **添加 JWT_SECRET production guard**
3. 🟠 **添加 admin 前端頁面**（3 頁：SE 列表管理 / 新增編輯 / 需求總覽）
4. 🟠 **添加 rate limiting**
5. 🟠 **修復 matching.js JSON.parse 保護**
6. 🟡 **創建 Impact Dashboard 頁面**（`/impact`）
7. 🟡 **修復 ReportsPage new report link**
8. 🟡 **擴充種子數據至 15+ SE / 30+ products**
9. 🟢 **PDF 中文支援**（Sprint 2）
