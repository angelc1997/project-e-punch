# [ePunch 點點班](https://next-project-account-app.vercel.app/)

註冊登入帳號密碼，提供個人收入以及支出紀錄。

# 目錄

- [功能說明](#功能說明)
- [技術架構](#技術架構)
- [專案說明](#專案說明)

# 功能說明

- 使用者可創建個人帳號密碼或是選擇使用 Google 帳號進行登入
- 連接資料庫，紀錄保存個人帳號的收入以及支出信息
- 保留使用者登入直到使用者關閉分頁或登出個人帳號

# 技術架構

- 前端框架：React、Next.js、TypeScript、Tailwind
- 後端串接：Firebase
- 資料庫：Firestore
- 部署：Vercel
- 版本控制：GitHub
- 其他套件：react-toastify

# 專案說明

該專案使用 [Next.js](https://nextjs.org/) 框架，並透過 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 快速建立專案架構。

## 專案建置

### 快速開始

需要使用 [Node.js](https://nodejs.org/en) 執行腳本命令，並使用 `npm` 下載及管理所需套件。

同時註記開發時所使用的版本號

➡️ Node.js：v20.11.1

```bash
node -v
```

➡️ git：2.43.0.windows.1

```bash
git -v

```

### 建立專案架構

➡️ 建立 next 專案

```bash
npx create-next-app@latest
```

### GitHub 版本控制

➡️ 連接 Gihub 進行版本控制，同時創建 develop 分支進行開發

以 main 來取代原本的 master

```bash
git branch -M main
```

連接遠端 Github

```bash
git remote add origin https://github.com/angelc1997/bootcamp-next-project.git
```

推送至正式版本

```bash
git push -u origin main
```

以 develop 分支進行程式碼開發與更新

```bash
git branch develop
```

### 啟動伺服器

使用瀏覽器開啟 [`http://localhost:3000`](http://localhost:3000)

```bash
npm run dev
```

### 環境變數設定

➡️ 使用 `.env.local` 設置 Firebase

- API_KEY
- AUTH_DOMAIN

### 安裝其他項目

➡️ firebase

```bash
npm i firebase

```

➡️ react-toastify

```bash
npm i react-toastify
```

### 使用 Vercel 自動部署

- 連接 GitHub 帳戶
- 選擇部署 Repo 以及使用框架
- 添加環境變數
