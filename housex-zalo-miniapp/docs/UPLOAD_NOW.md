# Upload Mini App — khi quét zalo.me/s/... vẫn thấy bản cũ

## Vì sao 1 tài khoản quét nhiều lần vẫn không đổi?

Link / QR **`https://zalo.me/s/1554712272702750699/`** = bản **Live / Production**.

- Sửa code + `git push` **không** đẩy lên Zalo.
- Chỉ khi **upload phiên bản mới** (ZMP CLI hoặc console) + **Phát hành** thì link đó mới đổi.
- Quét lại cùng QR Live = vẫn bản cũ → đăng nhập cũng chạy code auth cũ → dễ “đứng” / không hoàn tất.

## Cách A — Upload ZIP trên developers.zalo.me (không cần VPS)

File đã build sẵn:

`housex-zalo-miniapp/housex-miniapp-upload.zip`

1. Mở [developers.zalo.me](https://developers.zalo.me) → Mini App **House X** (`1554712272702750699`)
2. **Quản lý → Phiên bản → Tạo phiên bản mới**
3. Upload `housex-miniapp-upload.zip`
4. **Phát hành** (Production) — hoặc gán Testing rồi quét **QR Testing** (không dùng QR Live)
5. Trên điện thoại: **vuốt tắt hẳn Zalo** → mở lại bằng QR / link phiên bản vừa phát hành

Nhận biết đúng bản mới (mục **Tài khoản**):

- Có **«1. Khách mua nhà»** và **«2. Cộng đồng môi giới House X»**
- **Không** còn «CTV thử nghiệm» / «House X · hx…»

## Cách B — VPS + ZMP (SSH)

```bash
ssh root@103.72.99.131 -p 24700

cd /opt/housex && git pull origin main

# API đăng nhập (bắt buộc nếu login vẫn treo)
cd Proptech-HouseX
npm run build && pm2 restart housex --update-env

# Mini App
cd ../housex-zalo-miniapp
npm run build:zmp
zmp login          # nếu chưa login / token hết hạn
zmp deploy         # Dist = www · Version status = Testing
# In terminal sẽ có QR Testing — quét QR ĐÓ, không quét danh thiếp / zalo.me/s/...
```

Sau OK trên Testing → trên console **Phát hành Production** nếu muốn `zalo.me/s/...` cập nhật.

## Checklist nhanh

| Bước | Đúng | Sai |
|------|------|-----|
| Nguồn mở app | QR Testing sau `zmp deploy` hoặc bản vừa Phát hành | QR danh thiếp / `zalo.me/s/...` cũ |
| Sau upload | Force-stop Zalo rồi mở lại | Chỉ reload trong Mini App |
| Login | Bản mới: khung vàng «Zalo đã kết nối» + «Hoàn tất đăng nhập» | Form cũ + CTV thử nghiệm |
