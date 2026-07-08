export function HomePage() {
  return (
    <div>
      <p className="muted">HOUSE X</p>
      <h1 className="brand">House X</h1>
      <p className="lead">
        Tìm nhà ở xã hội, kiểm tra điều kiện vay — trên Zalo, kết nối cùng nền
        tảng timnhaxahoi.com.
      </p>

      <div className="card">
        <h2>Dự án NOXH</h2>
        <p>
          Danh sách dự án sẽ gọi API House X (Phase 1). Hiện scaffold UI.
        </p>
      </div>

      <div className="card">
        <h2>Công cụ nhanh</h2>
        <p>Điều kiện NOXH · Kiểm tra khả năng vay — wire sau khi auth ổn.</p>
      </div>

      <div className="card">
        <h2>Nhận tư vấn</h2>
        <p>Form lead → POST /api/leads (Phase 1).</p>
      </div>
    </div>
  );
}
