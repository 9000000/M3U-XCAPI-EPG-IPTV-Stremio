# ✅ Checklist Deploy Vercel

## Trước Khi Deploy

### 1. Kiểm tra files cần thiết
- [x] `vercel.json` - Cấu hình Vercel
- [x] `serverless.js` - Entry point cho Vercel
- [x] `.vercelignore` - Files không cần deploy
- [x] `package.json` - Dependencies
- [x] `addon.js` - Core addon logic
- [x] `cryptoConfig.js` - Config encryption
- [x] `src/` folder - Static files

### 2. Test local
```bash
# Test serverless function
npm run test:serverless

# Hoặc test với Vercel CLI
npm run vercel:dev
```

Truy cập:
- http://localhost:3000/
- http://localhost:3000/configure-direct
- http://localhost:3000/health

### 3. Kiểm tra dependencies
```bash
npm install
```

Đảm bảo tất cả packages trong `package.json` đã được cài:
- ✅ stremio-addon-sdk
- ✅ express (không dùng trên Vercel nhưng cần cho local)
- ✅ node-fetch
- ✅ xml2js
- ✅ dotenv

### 4. Kiểm tra .gitignore
Đảm bảo không commit:
- ❌ `node_modules/`
- ❌ `.env`
- ❌ `*.log`

---

## Deploy Lên Vercel

### Phương án A: Qua GitHub (Khuyến nghị)

```bash
# 1. Commit code
git add .
git commit -m "Ready for Vercel deployment"

# 2. Push lên GitHub
git push origin main

# 3. Import vào Vercel
# Vào https://vercel.com/new và chọn repo
```

### Phương án B: Qua CLI

```bash
# 1. Login
vercel login

# 2. Deploy
vercel --prod
```

---

## Sau Khi Deploy

### 1. Kiểm tra deployment
- [ ] Deployment status = "Ready"
- [ ] Không có errors trong logs
- [ ] URL được tạo thành công

### 2. Test các endpoints

```bash
# Thay YOUR_URL bằng URL Vercel của bạn
curl https://YOUR_URL.vercel.app/health
curl https://YOUR_URL.vercel.app/
```

Hoặc mở trình duyệt:
- [ ] `https://YOUR_URL.vercel.app/` - Landing page
- [ ] `https://YOUR_URL.vercel.app/configure-direct` - Config page
- [ ] `https://YOUR_URL.vercel.app/health` - Health check

### 3. Tạo addon config
1. Truy cập `/configure-direct` hoặc `/configure-xtream`
2. Nhập thông tin M3U/Xtream
3. Click "Generate Addon"
4. Kiểm tra manifest URL có load được không

### 4. Test trong Stremio
1. Mở Stremio
2. Settings → Addons
3. Paste manifest URL
4. Install addon
5. Kiểm tra catalog có hiển thị không

---

## Environment Variables (Tùy chọn)

Vào Vercel Dashboard → Settings → Environment Variables:

### Bắt buộc (nếu dùng encryption):
- [ ] `CONFIG_SECRET` - Min 16 chars

### Tùy chọn:
- [ ] `OMDB_API_KEY` - Cho Real-Time Content Matching
- [ ] `DEBUG_MODE` - Set `false` cho production
- [ ] `CACHE_ENABLED` - Set `true`
- [ ] `CACHE_TTL_MS` - Default: 21600000 (6 hours)
- [ ] `PREFETCH_ENABLED` - Set `true`

**Sau khi thêm env vars:**
```bash
vercel --prod
```

---

## Troubleshooting

### Deploy failed
1. Kiểm tra logs tại Vercel Dashboard
2. Đảm bảo `vercel.json` đúng format
3. Kiểm tra `package.json` có đầy đủ dependencies

### Function timeout
1. Giảm kích thước playlist
2. Tắt EPG hoặc Series
3. Xem xét upgrade Vercel Pro

### Config không hoạt động
1. Kiểm tra `serverless.js` có import đúng `tryParseConfigToken`
2. Test config token bằng cách decode base64
3. Tạo lại config từ configure page

### Static files không load
1. Kiểm tra `src/` folder có trong deployment
2. Kiểm tra routes trong `vercel.json`
3. Xem logs để biết file path

---

## Monitoring

### Kiểm tra logs
```bash
vercel logs YOUR_URL.vercel.app
```

Hoặc vào Dashboard:
- Vercel Dashboard → Project → Deployments → View Function Logs

### Metrics
- Invocations count
- Bandwidth usage
- Error rate

---

## Cập Nhật

### Qua GitHub:
```bash
git add .
git commit -m "Update addon"
git push
```
→ Auto deploy

### Qua CLI:
```bash
vercel --prod
```

---

## ✅ Hoàn Thành!

Addon của bạn đã sẵn sàng tại:
- **URL**: `https://YOUR_PROJECT.vercel.app`
- **Configure**: `https://YOUR_PROJECT.vercel.app/configure-direct`
- **Manifest**: `https://YOUR_PROJECT.vercel.app/{token}/manifest.json`

Chia sẻ URL với người khác để họ cũng có thể sử dụng!
