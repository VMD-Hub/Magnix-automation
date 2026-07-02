import type { Metadata } from "next";
import { getSupportEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
};

export default function BaoMatPage() {
  const supportEmail = getSupportEmail();

  return (
    <article className="mx-auto max-w-2xl py-10 container-px prose prose-slate">
      <h1>Chính sách bảo mật</h1>
      <h2>Dữ liệu thu thập</h2>
      <p>
        Khi đăng ký, chúng tôi lưu họ tên, số điện thoại, email và mật khẩu (đã mã hóa).
        Email dùng để xác nhận tài khoản và liên lạc dịch vụ.
      </p>
      <h2>Sử dụng dữ liệu</h2>
      <ul>
        <li>Xác thực tài khoản và bảo vệ quyền xem thông tin liên hệ.</li>
        <li>Gửi thông báo liên quan dịch vụ (nếu bạn opt-in marketing).</li>
        <li>Phân tích chất lượng tin và chống lạm dụng (rate-limit, log kỹ thuật).</li>
      </ul>
      <h2>Chia sẻ với bên thứ ba</h2>
      <p>
        Chúng tôi không bán dữ liệu cá nhân. Email giao dịch có thể gửi qua nhà cung cấp
        email hoặc webhook n8n theo cấu hình hệ thống.
      </p>
      <h2>Quyền của bạn</h2>
      <p>
        Bạn có thể yêu cầu cập nhật hoặc xóa tài khoản qua email{" "}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>
    </article>
  );
}
