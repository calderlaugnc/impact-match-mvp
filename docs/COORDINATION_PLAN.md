# IMPACT MATCH MVP — 多 Agent 協作計劃

## 項目概述
- **名稱**: IMPACT MATCH
- **定位**: 香港影響力匹配平台
- **核心功能**: 幫助企業按需求匹配和推薦社企產品/服務/工作坊
- **高頻場景**: 員工福利、企業採購
- **數據化**: 影響力數據追蹤 + 報告生成

## 技術架構
- **前端**: React + Vite + Tailwind CSS
- **後端**: Node.js + Express + SQLite
- **匹配引擎**: 標籤/分類加權算法
- **報告**: 前端生成 PDF

## Agent 分工

### 產品經理 Agent (PM)
- 定義 MVP 範圍與用戶故事
- 設計數據模型與 API 規格
- 輸出 PRD 到 `docs/PRD.md`
- 輸出 API 規格到 `docs/API_SPEC.md`

### 前端開發 Agent (FE)
- 基於 PM 的規格開發 React 前端
- 頁面: 登入/註冊、企業儀表板、社企列表、匹配結果、影響力報告
- 輸出到 `src/frontend/`

### 後端開發 Agent (BE)
- 基於 PM 的規格開發 Node.js API
- 功能: 認證、社企 CRUD、匹配算法、影響力數據、報告數據
- 輸出到 `src/backend/`

## 協作流程
1. PM 先完成 PRD + API 規格
2. FE 和 BE 並行開發
3. 最後整合測試
4. 上傳 GitHub

## 文件結構
```
IMPACT_SAAS/
├── docs/
│   ├── PRD.md
│   ├── API_SPEC.md
│   └── ARCHITECTURE.md
├── src/
│   ├── frontend/
│   └── backend/
├── reports/
│   └── collaboration_log.md
└── README.md
```
