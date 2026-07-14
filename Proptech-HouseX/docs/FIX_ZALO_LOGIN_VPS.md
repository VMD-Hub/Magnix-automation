# Sửa login Zalo fail trên VPS (cả nút Zalo lẫn đăng ký SĐT)

## Nguyên nhân hay gặp

Nếu `.env` production còn:

```env
ZALO_AUTH_DEV_BYPASS=true
```

thì API chặn đăng nhập (cũ) — **cả Zalo lẫn SĐT** đều fail vì 2 đường đều gọi `/api/auth/zalo`.

## Trên VPS — chạy ngay

```bash
cd /opt/housex/Proptech-HouseX

# Xem giá trị hiện tại
grep ZALO_AUTH_DEV_BYPASS .env || echo "(chua co dong nay)"

# Tắt bypass (sửa bằng tay hoặc sed)
sed -i 's/^ZALO_AUTH_DEV_BYPASS=.*/ZALO_AUTH_DEV_BYPASS=false/' .env
# Nếu chưa có dòng:
grep -q '^ZALO_AUTH_DEV_BYPASS=' .env || echo 'ZALO_AUTH_DEV_BYPASS=false' >> .env

grep ZALO_APP_ID .env
grep ZALO_APP_SECRET .env | sed 's/=.*/=***/'

cd /opt/housex && git pull origin main
cd Proptech-HouseX
npm run build && pm2 restart housex --update-env

# Kiểm tra log khi thử login
pm2 logs housex --lines 50
```

`ZALO_APP_ID` / `ZALO_APP_SECRET` phải là **Zalo App** cha của Mini App House X (app `183736…` trong docs — không nhầm với Mini App ID `155471…`).

## Mini App

Sau khi API OK, vẫn cần bản Mini App mới (upload ZIP hoặc `zmp deploy` Testing).
