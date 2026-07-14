/**
 * In hướng dẫn deploy Testing — Development chỉ mở được với tài khoản admin.
 */
console.log(`
╔════════════════════════════════════════════════════════════╗
║  Code đã build xong — PHẢI deploy Testing mới thấy UI mới ║
╠════════════════════════════════════════════════════════════╣
║  Trên máy có ZMP CLI (thường là VPS):                      ║
║    cd /opt/housex/housex-zalo-miniapp                      ║
║    git pull                                                ║
║    bash scripts/deploy-testing.sh                          ║
║  hoặc:                                                     ║
║    npm run build:zmp                                       ║
║    zmp deploy                                              ║
║    → Dist: www                                             ║
║    → Version status: Testing   ← BẮT BUỘC                  ║
║                                                            ║
║  Sau đó: force-stop Zalo → quét QR Testing trên terminal.  ║
║                                                            ║
║  Cách nhận biết ĐÚNG bản mới (mục Tài khoản):              ║
║    • Có mục «1. Khách mua nhà»                             ║
║    • Có mục «2. Cộng đồng môi giới House X»                ║
║    • KHÔNG còn «CTV thử nghiệm» / «House X · hx…»          ║
║                                                            ║
║  Development / OA / zalo.me/s/<appId>/ = bản cũ hoặc        ║
║  chỉ tài khoản Developer — dễ tưởng «không cập nhật».      ║
╚════════════════════════════════════════════════════════════╝
`);
