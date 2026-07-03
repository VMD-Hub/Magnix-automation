import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  robots: { index: true, follow: true },
};

export default function DieuKhoanPage() {
  return (
    <article className="mx-auto max-w-2xl py-10 container-px prose prose-slate">
      <h1>Điều khoản sử dụng</h1>
      <p>Cập nhật lần cuối: 2026</p>
      <h2>1. Phạm vi dịch vụ</h2>
      <p>
        HouseX cung cấp nền tảng đăng tin và tìm kiếm bất động sản. Chúng tôi không
        phải bên mua bán trực tiếp và không đảm bảo giao dịch giữa các bên.
      </p>
      <h2>2. Trách nhiệm người đăng tin</h2>
      <p>
        Môi giới/chủ nhà cam kết thông tin tin đăng trung thực, có quyền đăng tin.
        HouseX có quyền gỡ tin vi phạm hoặc chất lượng không đạt.
      </p>
      <h2>3. Bảo mật liên hệ</h2>
      <p>
        Số điện thoại môi giới được che trên giao diện công khai. Người xem phải đăng
        nhập và xác nhận email trước khi được hiển thị số.
      </p>
      <h2>4. Cộng tác viên (CTV)</h2>
      <p>
        Đăng ký CTV không tự động được duyệt. Ứng viên phải hoàn thành khóa đào tạo
        hội nhập và nắm rõ nguyên tắc vận hành trước khi Admin cấp mã CTV.
      </p>
    </article>
  );
}
