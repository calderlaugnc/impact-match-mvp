# IMPACT MATCH 部署指南

## 已完成的部署

### 前端（Vercel）
- **URL**: https://frontend-liart-three-59.vercel.app
- **狀態**: ✅ 已上線
- **自動部署**: 每次推送到 GitHub 自動重新部署

### 後端（Render）
- **預期 URL**: https://impact-match-api.onrender.com
- **狀態**: ⏳ 待手動設置

## Render 部署步驟

1. 訪問 https://dashboard.render.com
2. 點擊 "New +" → "Web Service"
3. 連接 GitHub 倉庫：`calderlaugnc/impact-match-mvp`
4. 配置：
   - **Name**: impact-match-api
   - **Environment**: Node
   - **Build Command**: `cd src/backend && npm install`
   - **Start Command**: `cd src/backend && node server.js`
   - **Plan**: Free
5. 添加環境變數：
   - `NODE_ENV`: production
   - `JWT_SECRET`: [生成隨機字符串]
   - `FRONTEND_URL`: https://frontend-liart-three-59.vercel.app
   - `SQLITE_PATH`: ./data/impactmatch.db
6. 添加磁盤：
   - **Name**: sqlite-data
   - **Mount Path**: /opt/render/project/src/src/backend/data
   - **Size**: 1 GB
7. 點擊 "Create Web Service"

## 部署後驗證

### 測試 API
```bash
curl https://impact-match-api.onrender.com/health
```

### 測試前端
1. 訪問 https://frontend-liart-three-59.vercel.app
2. 註冊新賬號
3. 登入
4. 測試匹配功能

## 故障排除

### 後端 CORS 錯誤
檢查 `FRONTEND_URL` 環境變數是否正確設置為 Vercel URL。

### 數據庫丟失
Render 免費方案重啟後數據會丟失，除非配置磁盤。確保已添加磁盤並設置 `SQLITE_PATH`。

### 前端無法連接 API
檢查 `vercel.json` 中的 `VITE_API_URL` 是否指向正確的 Render URL。
