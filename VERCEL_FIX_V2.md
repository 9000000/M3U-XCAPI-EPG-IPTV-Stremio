# ✅ Sửa Lỗi "unmatched-function-pattern"

## Vấn đề
```
Error: The pattern "api/serverless.js" defined in `functions` 
doesn't match any Serverless Functions inside the `api` directory.
```

## Giải pháp đã áp dụng

### 1. Đơn giản hóa `vercel.json` (root)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/serverless" }
  ]
}
```

**Lý do:** Vercel tự động phát hiện tất cả `.js` files trong `api/` như serverless functions.

### 2. Tạo `api/vercel.json` (nếu cần config riêng)
```json
{
  "functions": {
    "serverless.js": {
      "maxDuration": 10,
      "memory": 1024
    }
  }
}
```

**Lưu ý:** Pattern trong `api/vercel.json` chỉ cần tên file, không cần đường dẫn đầy đủ.

## Cấu trúc cuối cùng

```
project/
├── api/
│   ├── serverless.js       ← Serverless function
│   └── vercel.json         ← Config cho api/ (tùy chọn)
├── src/
│   ├── index.html
│   ├── html/
│   ├── js/
│   └── css/
├── vercel.json             ← Config chính (đơn giản)
├── addon.js
├── cryptoConfig.js
└── package.json
```

## Deploy

### Qua GitHub (Khuyến nghị)
```bash
git add .
git commit -m "Fix Vercel function pattern"
git push
```

Vercel sẽ tự động:
1. Phát hiện `api/serverless.js`
2. Build thành serverless function
3. Route tất cả requests qua function này

### Qua CLI
```bash
# Cài Vercel CLI (nếu chưa có)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Test sau khi deploy

```bash
# Thay YOUR_URL bằng URL Vercel của bạn
curl https://YOUR_URL.vercel.app/health
```

Kết quả mong đợi:
```json
{"status":"OK","timestamp":"2024-..."}
```

## Các URL quan trọng

- **Landing**: `https://your-project.vercel.app/`
- **Health**: `https://your-project.vercel.app/health`
- **Configure Direct**: `https://your-project.vercel.app/configure-direct`
- **Configure Xtream**: `https://your-project.vercel.app/configure-xtream`

## Nếu vẫn gặp lỗi

### Lỗi: "Module not found"
→ Đảm bảo `package.json` có đầy đủ dependencies:
```json
{
  "dependencies": {
    "stremio-addon-sdk": "^1.6.10",
    "node-fetch": "^2.6.7",
    "xml2js": "^0.4.23",
    "dotenv": "^17.2.1"
  }
}
```

### Lỗi: "Function timeout"
→ Playlist quá lớn:
1. Giảm số kênh
2. Tắt EPG
3. Upgrade Vercel Pro (60s timeout)

### Lỗi: "Cannot find module '../addon'"
→ Kiểm tra đường dẫn trong `api/serverless.js`:
```javascript
const createAddon = require("../addon");  // ✅ Đúng
const createAddon = require("./addon");   // ❌ Sai
```

## Environment Variables

Thêm trong Vercel Dashboard → Settings → Environment Variables:

```
CONFIG_SECRET=your-secret-key-min-16-chars
OMDB_API_KEY=your-omdb-key
DEBUG_MODE=false
CACHE_ENABLED=true
PREFETCH_ENABLED=true
```

Sau khi thêm, redeploy:
```bash
vercel --prod
```

## Xác nhận thành công

✅ Deployment status = "Ready"  
✅ Không có errors trong logs  
✅ `/health` trả về `{"status":"OK"}`  
✅ `/configure-direct` hiển thị form  
✅ Có thể tạo addon và install vào Stremio  

## Hoàn tất! 🎉

Bây giờ addon của bạn đã sẵn sàng trên Vercel!
