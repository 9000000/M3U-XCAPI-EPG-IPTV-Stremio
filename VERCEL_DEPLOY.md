# Hướng Dẫn Deploy Lên Vercel

## Bước 1: Chuẩn Bị

### 1.1. Tạo tài khoản Vercel
- Truy cập https://vercel.com
- Đăng ký tài khoản (có thể dùng GitHub, GitLab, hoặc email)

### 1.2. Cài đặt Vercel CLI (Tùy chọn)
```bash
npm install -g vercel
```

## Bước 2: Deploy Qua GitHub (Khuyến nghị)

### 2.1. Push code lên GitHub
```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit for Vercel deployment"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2.2. Import vào Vercel
1. Đăng nhập vào https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Chọn **"Import Git Repository"**
4. Chọn repository của bạn từ GitHub
5. Click **"Import"**

### 2.3. Cấu hình Project
Vercel sẽ tự động phát hiện cấu hình từ `vercel.json`. Bạn chỉ cần:

1. **Project Name**: Đặt tên cho project (ví dụ: `iptv-stremio-addon`)
2. **Framework Preset**: Để là **"Other"**
3. **Root Directory**: Để trống (`.`)
4. **Build Command**: Để trống
5. **Output Directory**: Để trống

### 2.4. Thêm Environment Variables (Tùy chọn)
Click **"Environment Variables"** và thêm:

```
DEBUG_MODE=false
CACHE_ENABLED=true
CACHE_TTL_MS=21600000
MAX_CACHE_ENTRIES=100
PREFETCH_ENABLED=true
PREFETCH_MAX_BYTES=150000000
CONFIG_SECRET=your-secret-key-here-min-16-chars
OMDB_API_KEY=your-omdb-api-key-here
```

**Lưu ý quan trọng:**
- `CONFIG_SECRET`: Dùng để mã hóa cấu hình (tối thiểu 16 ký tự)
- `OMDB_API_KEY`: Để sử dụng tính năng Real-Time Content Matching (lấy tại https://www.omdbapi.com/apikey.aspx)
- Redis không khả dụng trên Vercel Free tier, addon sẽ tự động dùng LRU cache

### 2.5. Deploy
Click **"Deploy"** và đợi vài phút.

## Bước 3: Deploy Qua Vercel CLI

### 3.1. Login
```bash
vercel login
```

### 3.2. Deploy
```bash
# Deploy lần đầu (development)
vercel

# Deploy production
vercel --prod
```

### 3.3. Thêm Environment Variables
```bash
vercel env add DEBUG_MODE
vercel env add CACHE_ENABLED
vercel env add CONFIG_SECRET
vercel env add OMDB_API_KEY
```

## Bước 4: Sử Dụng Addon

### 4.1. URL của addon
Sau khi deploy thành công, bạn sẽ có URL dạng:
```
https://your-project-name.vercel.app
```

### 4.2. Cấu hình addon

#### Với Direct M3U Provider:
1. Truy cập: `https://your-project-name.vercel.app/configure-direct`
2. Nhập **M3U URL** của bạn
3. (Tùy chọn) Nhập **EPG URL**
4. Click **"Generate Addon"**
5. Copy **Manifest URL** hoặc click **"Open in Stremio"**

#### Với Xtream Provider:
1. Truy cập: `https://your-project-name.vercel.app/configure-xtream`
2. Nhập thông tin Xtream API:
   - Server URL
   - Username
   - Password
3. Click **"Generate Addon"**
4. Copy **Manifest URL** hoặc click **"Open in Stremio"**

### 4.3. Thêm vào Stremio
1. Mở Stremio
2. Vào **Settings** → **Addons**
3. Paste **Manifest URL** vào ô **"Addon Repository Url"**
4. Click **"Install"**

## Bước 5: Cập Nhật Addon

### Qua GitHub (Tự động)
```bash
git add .
git commit -m "Update addon"
git push
```
Vercel sẽ tự động deploy lại.

### Qua CLI
```bash
vercel --prod
```

## Lưu Ý Quan Trọng

### Giới hạn của Vercel Free Tier:
- **Function Execution**: 10 giây (có thể timeout với playlist lớn)
- **Function Size**: 50MB
- **Bandwidth**: 100GB/tháng
- **Invocations**: 100,000/tháng
- **No Redis**: Chỉ dùng in-memory cache (mất khi cold start)

### Khuyến nghị:
1. **Playlist nhỏ**: Nên dùng playlist < 5000 kênh để tránh timeout
2. **Cache**: Bật CACHE_ENABLED=true để giảm thời gian xử lý
3. **EPG**: Nếu EPG file quá lớn, có thể bỏ qua hoặc dùng EPG nhỏ hơn
4. **Production**: Nếu cần xử lý playlist lớn, nên deploy lên VPS hoặc dùng Vercel Pro

### Xử lý lỗi timeout:
Nếu gặp lỗi timeout khi tạo addon, có thể:
1. Giảm kích thước playlist
2. Tắt EPG (`enableEpg=false`)
3. Tắt Series support (`includeSeries=false`)
4. Upgrade lên Vercel Pro (60s timeout)

## Troubleshooting

### Lỗi "Direct provider requires m3uUrl"
- Kiểm tra lại M3U URL đã nhập đúng chưa
- Tạo lại configuration token từ trang configure

### Lỗi "Function Execution Timeout"
- Playlist quá lớn, thử giảm kích thước
- Tắt EPG hoặc Series support
- Xem xét deploy lên VPS thay vì Vercel

### Addon không load được
- Kiểm tra logs tại Vercel Dashboard → Project → Functions
- Kiểm tra M3U URL có accessible không
- Thử truy cập manifest URL trực tiếp để xem lỗi

## Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Vercel Dashboard → Project → Deployments → Logs
2. Vercel Dashboard → Project → Functions → Logs
3. Browser Console khi truy cập configure page

## Custom Domain (Tùy chọn)

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn
4. Đợi DNS propagate (vài phút đến vài giờ)
