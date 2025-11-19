# Deploy Nhanh Lên Vercel - 5 Phút

## Cách 1: Deploy Qua GitHub (Dễ nhất)

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Deploy to Vercel"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### Bước 2: Import vào Vercel
1. Vào https://vercel.com/new
2. Chọn repository vừa tạo
3. Click **Deploy** (không cần config gì thêm)
4. Đợi 2-3 phút

### Bước 3: Sử dụng
- URL addon: `https://your-project.vercel.app`
- Cấu hình: `https://your-project.vercel.app/configure-direct`

---

## Cách 2: Deploy Qua CLI (Nhanh hơn)

### Bước 1: Cài Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login và Deploy
```bash
vercel login
vercel --prod
```

### Bước 3: Sử dụng
Vercel sẽ hiển thị URL sau khi deploy xong.

---

## Thêm Environment Variables (Tùy chọn)

Vào Vercel Dashboard → Project → Settings → Environment Variables:

```
CONFIG_SECRET=your-secret-key-min-16-chars
OMDB_API_KEY=your-omdb-key
DEBUG_MODE=false
CACHE_ENABLED=true
```

**Lưu ý:** Sau khi thêm env vars, cần redeploy:
```bash
vercel --prod
```

---

## Cấu Hình Addon

### Direct M3U:
1. Truy cập: `https://your-project.vercel.app/configure-direct`
2. Nhập M3U URL
3. Click "Generate Addon"
4. Copy Manifest URL vào Stremio

### Xtream API:
1. Truy cập: `https://your-project.vercel.app/configure-xtream`
2. Nhập Server URL, Username, Password
3. Click "Generate Addon"
4. Copy Manifest URL vào Stremio

---

## Lỗi Thường Gặp

### "Direct provider requires m3uUrl"
→ Tạo lại config tại `/configure-direct`

### "Function Execution Timeout"
→ Playlist quá lớn, thử:
- Giảm số kênh trong playlist
- Tắt EPG
- Upgrade Vercel Pro

### Addon không load
→ Kiểm tra logs tại Vercel Dashboard → Functions

---

## Cập Nhật Addon

### Qua GitHub:
```bash
git add .
git commit -m "Update"
git push
```
→ Vercel tự động deploy

### Qua CLI:
```bash
vercel --prod
```

---

## Xong! 🎉

Addon của bạn đã sẵn sàng tại:
- **Landing page**: `https://your-project.vercel.app`
- **Configure**: `https://your-project.vercel.app/configure-direct`
- **Health check**: `https://your-project.vercel.app/health`
