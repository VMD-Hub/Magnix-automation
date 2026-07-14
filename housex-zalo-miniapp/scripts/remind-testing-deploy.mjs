/**
 * In hướng dẫn deploy Testing — Development chỉ mở được với tài khoản admin.
 */
console.log(`
╔════════════════════════════════════════════════════════════╗
║  KHÔNG dùng Development nếu cần nhiều tài khoản Zalo test ║
╠════════════════════════════════════════════════════════════╣
║  Trên VPS chạy:                                            ║
║    bash scripts/deploy-testing.sh                          ║
║  hoặc:                                                     ║
║    zmp deploy                                              ║
║    → Dist: www                                             ║
║    → Version status: Testing   ← BẮT BUỘC                  ║
║                                                            ║
║  Sau đó: force-stop Zalo → quét QR Testing trên terminal.  ║
║  UI đúng sẽ thấy dòng: House X · hx… (cuối màn hình).      ║
║                                                            ║
║  Development / OA / zalo.me/s/<appId>/ = bản cũ hoặc        ║
║  chỉ tài khoản Developer — dễ tưởng «không cập nhật».      ║
╚════════════════════════════════════════════════════════════╝
`);
