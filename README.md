# IMPACT MATCH MVP

AI-powered social enterprise matching platform for Hong Kong.

## 項目簡介

IMPACT MATCH 幫助企業按需求匹配社企產品/服務/工作坊，應用場景為員工福利和企業採購，並將影響力數據化生成報告。

## 技術棧

- **Backend**: Node.js + Express + SQLite3
- **Frontend**: React + Vite + Tailwind CSS
- **PDF**: PDFKit
- **Auth**: JWT

## 快速開始

### 後端
```bash
cd src/backend
npm install
npm run seed
node server.js
```

### 前端
```bash
cd src/frontend
npm install
npm run dev
```

## API 端點

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | /api/auth/login | 登入 |
| POST | /api/auth/register | 註冊 |
| GET | /api/social-enterprises | 社企列表 |
| GET | /api/products | 產品列表 |
| POST | /api/match | 智能匹配 |
| GET | /api/reports | 報告列表 |
| GET | /api/reports/:id/pdf | 下載 PDF |

## 部署

- 後端: Render (render.yaml)
- 前端: Vercel (vercel.json)

## 作者

CALDER - 社創家，IMPACT MATCH 創辦人
