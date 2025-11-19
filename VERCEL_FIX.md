# ✅ Đã Sửa Lỗi Vercel

## Vấn đề đã được giải quyết

Lỗi: `The 'functions' property cannot be used in conjunction with the 'builds' property`

## Thay đổi

### 1. Cấu trúc mới
```
project/
├── api/
│   └── serverless.js    ← Entry point cho Vercel (MỚI)
├── src/
├── addon.js
├── cryptoConfig.js
├── vercel.json          ← Đã cập nhật
└── ...
```

### 2. File `vercel.json` mới
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/serverless" }
  ],
  "functions": {
    "api/serverless.js": {
      "maxDuration": 10
    }
  }
}
```

### 3. File `api/serverless.js`
- Di chuyển từ `serverless.js` sang `api/serverless.js`
- Cập nhật đường dẫn import: `../addon`, `../cryptoConfig`
- Cập nhật đường dẫn file: `path.join(__dirname, '..', 'src', ...)`

## Test Local

```bash
npm run test:serverless
```

Truy cập:
- http://localhost:3000/
- http://localhost:3000/configure-direct
- http://localhost:3000/health

## Deploy Lên Vercel

### Qua GitHub:
```bash
git add .
git commit -m "Fix Vercel config"
git push
```

### Qua CLI:
```bash
vercel --prod
```

## Xác nhận Deploy thành công

1. Không có lỗi về `builds` và `functions`
2. Deployment status = "Ready"
3. Test các URL:
   - `https://your-project.vercel.app/`
   - `https://your-project.vercel.app/health`
   - `https://your-project.vercel.app/configure-direct`

## Lưu ý

- File `serverless.js` ở root không còn được dùng (đã thêm vào `.vercelignore`)
- Vercel sẽ tự động phát hiện `api/serverless.js` và deploy như serverless function
- Timeout mặc định: 10 giây (Free tier)
- Có thể tăng lên 60 giây nếu upgrade Vercel Pro

## Nếu vẫn gặp lỗi

1. Xóa `.vercel` folder (nếu có):
   ```bash
   rm -rf .vercel
   ```

2. Deploy lại:
   ```bash
   vercel --prod
   ```

3. Kiểm tra logs:
   ```bash
   vercel logs
   ```

## Hoàn tất! 🎉

Bây giờ bạn có thể deploy lên Vercel mà không gặp lỗi về `builds` và `functions`.
