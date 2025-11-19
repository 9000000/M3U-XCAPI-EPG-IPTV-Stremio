# 🚀 Deploy Ngay Bây Giờ

## ✅ Đã sửa tất cả lỗi

Tất cả lỗi Vercel đã được sửa. Bây giờ chỉ cần deploy!

## Cách 1: Deploy qua GitHub (5 phút)

### Bước 1: Push code
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### Bước 2: Import vào Vercel
1. Vào https://vercel.com/new
2. Chọn repository
3. Click **Deploy**
4. Đợi 2-3 phút

### Bước 3: Xong!
URL của bạn: `https://your-project.vercel.app`

---

## Cách 2: Deploy qua CLI (3 phút)

```bash
# Cài Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Sau khi deploy

### 1. Kiểm tra addon hoạt động
Mở: `https://your-project.vercel.app/health`

Kết quả: `{"status":"OK","timestamp":"..."}`

### 2. Cấu hình addon

**Với Direct M3U:**
1. Mở: `https://your-project.vercel.app/configure-direct`
2. Nhập M3U URL
3. Click "Generate Addon"
4. Copy Manifest URL

**Với Xtream:**
1. Mở: `https://your-project.vercel.app/configure-xtream`
2. Nhập Server URL, Username, Password
3. Click "Generate Addon"
4. Copy Manifest URL

### 3. Thêm vào Stremio
1. Mở Stremio
2. Settings → Addons
3. Paste Manifest URL
4. Click Install

---

## Environment Variables (Tùy chọn)

Vào Vercel Dashboard → Settings → Environment Variables:

```
CONFIG_SECRET=your-secret-key-here
OMDB_API_KEY=your-omdb-key-here
```

Sau đó redeploy:
```bash
vercel --prod
```

---

## Xong! 🎉

Addon của bạn đã live tại:
- **URL**: `https://your-project.vercel.app`
- **Configure**: `https://your-project.vercel.app/configure-direct`

Chia sẻ URL này với bạn bè để họ cũng có thể dùng!

---

## Cần giúp đỡ?

Kiểm tra logs tại:
- Vercel Dashboard → Project → Deployments → View Function Logs

Hoặc đọc:
- `VERCEL_FIX_V2.md` - Chi tiết các lỗi đã sửa
- `VERCEL_DEPLOY.md` - Hướng dẫn đầy đủ
- `CHECKLIST_DEPLOY.md` - Checklist từng bước
