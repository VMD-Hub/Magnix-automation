# Chương trình Affiliate NOXH — Kịch bản vận hành (SoT)

> **Nguyên tắc:** Hệ thống theo thực tế chương trình — không bắt thực tế chạy theo UI/schema có sẵn.  
> **Nguồn:** Project Brief Affiliate NOXH · Kịch bản tiếp cận đa kênh · Slide webinar (PDF 2026).  
> **Đồng hành:** Liên Đoàn Lao Động TP.HCM · House X chủ trì.  
> **Thông điệp:** «Đồng hành cùng chương trình nhà ở quốc gia» · «An cư - Vì bạn xứng đáng».  
> **Liên quan:** ADR-014 Mini App · [`AGENT_MINIAPP_UI_APPROVED.md`](./AGENT_MINIAPP_UI_APPROVED.md) (UI đã duyệt) · [`AGENT_AFFILIATE_IMPLEMENTATION_PLAN.md`](./AGENT_AFFILIATE_IMPLEMENTATION_PLAN.md) (kế hoạch P0) · `/affiliate-bat-dong-san` · Ops console web.

---

## 1. Thực tế chương trình (4 cấp = 4 chế độ trên từng giao dịch)

Bảng dưới mô tả **vai trò khi chọn cấp đó cho một deal / sản phẩm** — không phải bốn loại tài khoản khóa cứng.

| Cấp | Tên gói | Ai hay chọn (gợi ý) | Việc trên **deal đó** | House X trên **deal đó** |
|-----|---------|---------------------|------------------------|---------------------------|
| **1** | Connector — CTV Giới thiệu | Có quan hệ nhưng ngại bán kiểu MG | Chỉ chuyển lead / kết nối | **Toàn bộ** tư vấn + chốt + hồ sơ |
| **2** | Consultant — CV Tư vấn đồng hành | Muốn tư vấn đầu, chưa ôm hết HS | Tư vấn nhu cầu ban đầu + phối hợp | Pháp lý sâu, QA, hỗ trợ chốt |
| **3** | Developer Partner — ĐT Phát triển DA | Làm sâu HS / mua cho mình / chưa CCHN | Đồng hành hoàn tất HS NOXH | Đào tạo, cấp phép đại diện theo quy định |
| **4** | Master Broker — Tổng đại lý liên kết | Có CCHN, muốn A–Z | Độc lập quy trình trên deal | Đối soát, HH/chiết khấu theo deal cấp 4 |

### 1.1 Cấp theo sản phẩm / giao dịch (ý đồ — bắt buộc)

| Ví dụ thực tế | Chọn cấp trên deal | Hệ thống |
|---------------|-------------------|----------|
| Bán/giới thiệu cho người quen — ngại, chậm, không muốn kiểu môi giới | **Cấp 1** | Lead → Ops tư vấn–chốt; đối tác theo dõi + HH; không ép UI MG |
| Muốn mua cho bản thân / làm sâu hồ sơ | **Cấp 3** (hoặc cấp phù hợp) | Mở flow HS theo deal; không đổi cả account thành “chỉ cấp 3” |
| Cùng một cộng tác viên, deal A cấp 1, deal B cấp 3 | Hai `dealTier` khác nhau | HH & quyền theo từng deal |

**Nguyên tắc:** đa dạng lựa chọn, linh hoạt **từng giao dịch**. Account có thể có cấp mặc định / đã duyệt khung; **deal thắng** khi tính quyền & HH.

### 1.1b Thông điệp về cấp độ (bắt buộc nói rõ khi công bố)

Mọi kênh **chính sách chung** (LP, webinar, Fanpage B2B, Media Kit, FAQ đối tác) phải giải thích cùng một ý — tránh hiểu nhầm “đăng ký xong bị khóa một cấp”:

| Nói rõ | Không để hiểu nhầm |
|--------|-------------------|
| **4 cấp = 4 cách hợp tác trên từng giao dịch / sản phẩm** | 4 loại tài khoản cứng; hoặc “bậc thăng tiến một chiều” |
| **Đối tác được chọn cấp cho mỗi giao dịch** theo tình huống bán | Một người chỉ được đứng một cấp mãi mãi |
| Ví dụ: người quen → cấp 1 (House X tư vấn–chốt); mua cho mình / làm sâu HS → cấp 3 | “Cấp 1 không được làm cấp 3” |
| Hoa hồng / quyền lợi áp theo **cấp của giao dịch đó** (chi tiết số: in-app) | Bảng số HH trên Fanpage/web |

**Câu chuẩn (public / slide / LP) — dùng hoặc biến thể L3:**

> Chương trình có **4 cấp độ hợp tác**. Bạn **không bị gắn một cấp cố định**: với **mỗi giao dịch / sản phẩm**, bạn chọn cấp phù hợp — ví dụ chỉ giới thiệu lead để House X tư vấn và chốt, hoặc đồng hành sâu hồ sơ. Chính sách chung công khai để mọi người hiểu và phấn đấu; mức hoa hồng chi tiết xem trong tài khoản đối tác sau khi tham gia.

**Câu ngắn (hook / bullet):**

> Tùy chọn cấp độ cho **mỗi giao dịch** — linh hoạt theo cách bạn muốn bán.

### 1.2 «Giấu hoa hồng» — hiểu đúng (chốt)

| Đúng | Sai |
|------|-----|
| **Không** công bố **mức / bảng HH chi tiết** trên Fanpage, web SEO | Không nói gì về thu nhập trên public |
| HH chi tiết: **in-app + admin** cho người đã tham gia | Mỗi nhóm đối tượng = một chính sách HH public khác nhau |
| **Chính sách chung** (4 chế độ, vai trò, đối soát, thi đua…) vẫn public để phấn đấu | Giấu khung 4 cấp |
| Chọn cấp **theo từng deal / sản phẩm** | Cấp gắn chết account; cấp 1 không bao giờ được chọn 3 ở deal khác |

**Tóm lại:** Public = khung + chính sách chung. Nội bộ = số HH. Cấp = **chế độ hợp tác trên giao dịch**, không phải bậc tài khoản một chiều.

### 1.3 Hoa hồng & thưởng (lớp nội bộ — không đăng Fanpage/web)

> Số liệu dưới đây chỉ trong SoT ops / in-app / admin sau khi đối tác tham gia. **Không** hardcode vào bài SEO, Fanpage, LP public.

#### Căn cứ tính hoa hồng (chốt theo thực tế MG căn hộ dự án)

Hoa hồng môi giới tính trên **giá trị thực tế của HĐMB** ký giữa khách hàng và chủ đầu tư (CĐT).

| Thành phần | Cách hiểu |
|------------|-----------|
| **Cơ sở chuẩn** | Giá trị căn hộ **ghi trên HĐMB chính thức** (giá thực thu / theo chính sách CĐT hoặc sàn F1). |
| **Giá gốc trên HĐMB** | Giá bán căn hộ **chưa bao gồm VAT**; đồng thời là mức **chưa trừ** chiết khấu, ưu đãi, quà tặng hay phí bảo trì khi xác định base (theo mô tả chính sách chương trình). |
| **Phí bảo trì 2%** | **Không** đưa vào doanh thu tính hoa hồng (thường không tính). |
| **VAT** | **Không** tính HH trên phần VAT. |
| **Ngoại lệ** | Nếu CĐT / F1 quy định base khác trên từng dự án — ghi trên deal / bảng chính sách dự án (admin); không mâu thuẫn copy public. |

#### Thời điểm & ai nhập base HH (chốt)

| Thời điểm | Có giá HĐMB / tính HH? | Việc trên hệ thống |
|-----------|------------------------|---------------------|
| Mới khai báo lead (A+B+C), xác định nhu cầu | **Chưa** — chưa chốt giá, chưa có giá chính xác | Không bắt nhập giá căn; không tính HH |
| Trong quá trình chăm sóc | **Chưa tính HH** | Cập nhật CS + **tiến độ / kết quả làm việc** — đối tác **xem được** timeline |
| **Sau khi ký HĐMB** | **Mới** nhập giá căn (base § trên) và **tính HH** (+ thưởng 500k nếu đủ điều kiện) | Nhập giá → hệ thống tính % theo `dealTier` |

**Ai nhập giá căn HĐMB (chưa VAT, không KTBT 2%):**

- **Ops / Super** nhập (hoặc xác nhận) khi đã có HĐMB — nguồn sự thật sau ký.  
- Đối tác **không** tự chốt số HH bằng cách nhập giá sớm; đối tác theo dõi tiến độ/kết quả và thấy HH **sau khi** giá được ghi nhận sau ký.  
- Không lấy giá ảo từ booking/unit lúc mở lead (chưa đủ chính xác / chưa HĐMB).

**Hiển thị cho đối tác:** suốt vòng đời lead thấy tiến độ & kết quả cập nhật; số HH / thưởng hiện khi đã có HĐMB + base đã nhập.

| Cấp deal (`dealTier`) | % hoa hồng |
|----------------------|------------|
| 1 — Connector | **0,5%** |
| 2 — Consultant | **1%** |
| 3 — Developer Partner | **1,5%** |
| 4 — Master Broker | **2%** |

**Thưởng thêm — đưa khách thăm dự án (mọi cấp):**

| Điều kiện | Mức | Thời điểm nhận |
|-----------|-----|----------------|
| Deal có bước **Thăm dự án** trong hành trình CS (đã lưu) + **Admin xác minh** với CĐT (NV trực dự án nếu cần) + sau đó **ký HĐMB** | **+500.000 đ** / deal | Chi thưởng sau khi Admin xác nhận đủ điều kiện (thường gắn mốc HĐMB) |

**Hành trình chăm sóc khách (CRM) — chốt**

1. **Tạo / dùng một hành trình CS trên deal** (module CRM mới nếu chưa có) — không tách “SiteVisit” ngoài hành trình.  
2. Hành trình có thể do **đối tác làm trọn** hoặc **ghép với House X** (Ops hỗ trợ từng bước) — mọi trường hợp đều **lưu từng bước**.  
3. Ví dụ bước (enum tiến độ / milestone, bổ sung L3 được): gặp khách → chat/gọi → **thăm dự án** → ký cọc → … → ký HĐMB. Mỗi bước = log + note + ảnh (như §5.2) khi là hoạt động CS.  
4. **Đăng ký / ghi nhận lịch thăm** nằm trong bước thăm DA của hành trình (SoR House X).  
5. **Xác nhận để tính thưởng +500k:** chỉ **Admin (Super)** sau khi **xác minh nguồn** với chủ đầu tư / nhân viên trực dự án (nếu cần) — **không** tự động chỉ vì đối tác upload ảnh, **không** để CĐT tự bấm trên Mini đối tác.  
6. Thưởng cộng thêm trên HH %; mọi cấp deal.

---

### 1.4 E-contract khung hợp tác (chốt — tự build, đơn giản)

| Quyết định | Nội dung |
|------------|----------|
| **Vendor** | **Không** bắt buộc DocuSign / vendor ngoài. House X **tự build** luồng xác thực tương đối. |
| **Trải nghiệm** | Cảm nhận rõ là hợp đồng điện tử: xem điều khoản → xác nhận → ký → lưu hồ sơ — gọn trên mobile. |
| **Cách ký (chọn 1 hoặc kết hợp P0)** | (A) **Ký tay trên màn hình điện thoại** (canvas chữ ký), và/hoặc (B) **OTP** + tạo **chuỗi chữ ký số** (hash nội dung HĐ + timestamp + userId + OTP proof) lưu SoR. |
| **Chặn active?** | Có thể cho đăng ký account trước; **khung hợp tác / quyền khai báo deal đầy đủ** sau khi e-contract đã ký (hoặc trạng thái `contract_pending` rõ trên UI). Không làm phức tạp vendor. |
| **Lưu trữ** | Bản đã ký + metadata chữ ký nằm trong **hồ sơ tài khoản đối tác** — đối tác (và Admin) **xem / kiểm tra bất cứ lúc nào**. |

**P0 tối giản đề xuất:** OTP xác minh SĐT + hiển thị điều khoản + nút đồng ý + (tuỳ chọn) chữ ký tay mobile → lưu PDF/HTML snapshot + chuỗi ký trong account. Nâng cấp chữ ký số đủ pháp lý sau nếu L3 yêu cầu.

### 1.5 Mini App vs Web (P0 campaign — chốt)

| Kênh | Vai trò |
|------|---------|
| **Cả hai** | P0 ship **Mini Agent + web** — không bỏ một bên. |
| **Web** | Phiên bản **đầy đủ** (đối tác / hồ sơ / hành trình / Admin). |
| **Mini App** | **Ưu tiên chiến lược trải nghiệm** — nâng cảm nhận chuyên nghiệp và năng lực House X; field CTV trong Zalo. |

**Thứ tự gợi ý:** API/SoR chung → luồng nóng trên **Mini trước (cảm nhận)** → web đủ chức năng sâu / Admin — Mini không được là “bản cắt” nhìn nghèo hơn web.

### 1.6 Help FAB (P0 — chốt)

| Quyết định | Nội dung |
|------------|----------|
| **P0** | FAB icon đầy đủ trên các màn Agent chính → modal **Cần trợ giúp?** chỉ kênh người: **SĐT / Zalo / email** (site-config). |
| **AI** | **Sau** P0 — bổ sung vào cùng modal/FAB (không redesign icon). |
| **UI** | Làm **shell icon + modal** hoàn chỉnh từ đầu; Phase sau chỉ gắn entry «AI trợ lý Agent». |

---

## 2. Phễu thực tế → trạng thái hệ thống

```
SEO / Fanpage / Outreach Zalo-LinkedIn
        ↓
Landing đăng ký đối tác
  (nhân văn + pháp lý + 4 chế độ + chính sách chung;
   không bảng HH số chi tiết)
        ↓
Form đăng ký / kích hoạt (có thể có cấp mặc định gợi ý)
        ↓
Webinar / Media Kit (HH chi tiết lớp nội bộ nếu cần)
        ↓
E-contract tự build (OTP ± ký tay mobile) — lưu hồ sơ account
        ↓
Kích hoạt đủ quyền khai báo deal (sau khi đã ký)
        ↓
**Mỗi deal / sản phẩm:** đối tác chọn cấp 1–4 cho giao dịch đó
  → Cấp 1: lead → Ops tư vấn–chốt
  → Cấp 2–4: tool / HS / độc lập theo cấp deal
        ↓
Đối soát HH theo **cấp của deal** (realtime in-app / admin)
```

| Bước thực tế | Hệ thống phải có | Không làm ngược |
|--------------|------------------|-----------------|
| Traffic TOFU nhân văn | Content Magnix + SEO hub NOXH | Không đăng **số HH / bảng chiết khấu** lên Fanpage·web |
| LP + đăng ký | LP + chính sách chung + account đối tác | Không bắt chọn một cấp cho cả đời account |
| Mỗi deal mới | Form khai báo: **Khách (A) + Dự án (B) + Tư cách C (dealTier 1–4)** do đối tác chọn | Không auto-gán tier theo region; không Super chọn hộ C |
| Sau khi có A+B+C | House X bố trí nhân sự hỗ trợ & theo dõi (Ops khi C=1, …) | Phân người hỗ trợ ≠ chọn cấp giúp đối tác |
| Đổi `dealTier` | Tự đổi chỉ khi **chưa** có CS của bộ phận tiếp theo; sau đó khóa · request Admin hạn chế (được từ chối) | Không đổi tự do suốt vòng đời |
| Deal Cấp 1 | Lead vào hỗ trợ Ops theo B; đối tác theo dõi + HH | Không đẩy UI môi giới / chốt lên đối tác trên deal đó |
| Deal Cấp 3 (vd. mua cho mình / làm sâu HS) | Mở flow HS / entitlement đủ cho deal đó | Không yêu cầu account phải “là” Developer Partner mãi |
| HH | Tính / hiển thị theo **dealTier** | Không gộp một mức HH account-level che deal |

---

## 3. Kịch bản theo cấp **của deal** (sau khi account đã active)

Mỗi lần tạo giới thiệu / nhận sản phẩm / mở hồ sơ: UI hỏi **«Bạn muốn hợp tác deal này theo cấp nào?»** (có thể prefill cấp mặc định).

### 3.0 Khai báo lead = đối tác chọn bộ ba (A / B / C) — chốt hiểu

Khi đối tác **muốn khai báo lead**, họ tự chọn trên form (không phải hệ thống gán tự động theo region, cũng không phải Super “phân tay” cấp deal):

| Thành phần | Ý nghĩa | Ví dụ |
|------------|---------|--------|
| **A — Khách** | Người được giới thiệu / cần mua | Khách A |
| **B — Sản phẩm / dự án** | Căn / dự án quan tâm | Dự án B |
| **C — Tư cách hợp tác trên deal** | `dealTier` 1–4 do đối tác chọn | Cấp C (vd. Connector) |

**Hệ quả vận hành**

1. Admin / House X **biết A+B+C** → bố trí nhân sự hỗ trợ & theo dõi lead (Ops tư vấn–chốt khi C = cấp 1; phối hợp sâu hơn khi C = 2–4).  
2. **Không** hiểu nhầm: queue Ops “auto-assign theo dự án/region” hay Super chọn hộ cấp độ. Cấp do đối tác chọn lúc khai báo.  
3. Bố trí nhân sự hỗ trợ (ai gọi, ai theo HS) là **bước sau** — dựa trên A+B+C đã khai; có thể phân tay Ops theo tải, nhưng **không thay** việc đối tác chọn C.  
4. HH 0,5% (cấp 1) tính khi deal đủ điều kiện HĐMB theo §1.3 — gắn đối tác khai báo + `dealTier = 1`; “chốt” nghiệp vụ buyer do House X/Ops thực hiện trên deal cấp 1, attribution HH vẫn về đối tác đã khai.

---

### 3.0b Đổi `dealTier` sau khi tạo (chốt)

| Giai đoạn lead | Đổi tier? | Ai |
|----------------|-----------|-----|
| **Mới tạo**, chưa có bước chăm sóc của **bộ phận tiếp theo** trong quy trình (vd. cấp 1: chưa bàn giao / chưa Ops gọi·tư vấn·gặp) | **Được tự đổi** trên deal | Đối tác |
| Đã có can thiệp bên tiếp theo (House X gọi, tư vấn, gặp, hoặc bước CS của bên nhận bàn giao) | **Không tự đổi** | — |
| Nhu cầu đổi sau khi đã khóa (trường hợp ngoại lệ) | Chỉ **request** nêu rõ lý do → **Admin xét duyệt**; House X **được từ chối** nếu không thỏa đáng | Đối tác xin · Super quyết |

**Tinh thần**

1. Mặc định: **không đổi** suốt quá trình — tránh lạm dụng và chiếm công sức đội House X.  
2. Cửa sổ tự đổi = **trước khi** khách đã được bộ phận tiếp theo chăm sóc. Ví dụ chọn cấp 1 nhưng lead vừa tạo, chưa ai gọi → đối tác vẫn tự đổi được.  
3. Khi đã có can thiệp bên khác (Ops/House X) → tier **khóa**; không mở lại tự do.  
4. Request đổi sau khóa là **việc hạn chế**, không khuyến khích; Admin từ chối được.

---

### 3.0c Gate cấp 3–4 (LMS / CCHN) — chốt

| Việc | Rule |
|------|------|
| **Chọn** mức Developer Partner / Master Broker trên deal (A+B+C) | **Được chọn** trên form — không bắt buộc đậu LMS / có CCHN *trước* khi chọn. |
| Tính năng sâu của mức đó (HS trọn, A–Z, …) | **Khóa** đến khi đủ điều kiện (LMS unlock / `licenseVerified` hoặc duyệt Admin). UI hiện pill «chờ đủ điều kiện». |
| **Đổi** sang/khỏi mức 3–4 sau khi tạo | **Cùng §3.0b**: tự đổi chỉ khi chưa có can thiệp bộ phận tiếp theo; sau khi House X (hoặc bên nhận) đã gọi / tư vấn / gặp / CS → **không đổi nữa** (request Admin hạn chế, được từ chối). |

**Tinh thần:** không siết cửa chọn ban đầu; siết **năng lực thật** bằng khóa tính năng; siết **đổi mức** bằng rule can thiệp bên khác (như đã chốt).

---

### 3.1 Deal Cấp 1 — “chỉ nối” (vd. người quen, ngại bán)

1. Chọn Connector cho deal → nhập/share lead.  
2. Lead vào **Ops House X** (telesales / tư vấn–chốt).  
3. Đối tác theo dõi trạng thái tối thiểu + HH khi đủ điều kiện deal cấp 1.

**UI deal:** form mỏng · trạng thái · không ép tư vấn/chốt.  
**Cấm trên deal này:** claim HS như MG; queue Ops công ty.

### 3.2 Deal Cấp 2 — tư vấn đầu + phối hợp

1. Tool nhu cầu / ghi chú tư vấn trên deal.  
2. Phối hợp Ops/pháp lý cho bước HS.  
3. Theo dõi milestone (read + nudge theo rule).

### 3.3 Deal Cấp 3 — làm sâu HS (vd. mua cho mình / trọn gói chưa CCHN)

1. Nếu SOP yêu cầu: đủ LMS unlock trước khi mở HS cấp 3.  
2. Đồng hành M1–M5 trên **deal đó** (fairplay).  
3. House X QA / cấp phép đại diện theo quy định.  
4. HH theo milestone / chốt **theo dealTier = 3**.

### 3.4 Deal Cấp 4 — A–Z (có CCHN trên deal / account đủ điều kiện)

1. Gate: `licenseVerified` (hoặc duyệt deal cấp 4).  
2. Độc lập quy trình; HH/chiết khấu theo chính sách cấp 4 (nội bộ).  
3. Attribution + conflict vs Ops vẫn áp dụng.

---

## 4. Kịch bản tiếp cận & nội dung (trước kích hoạt)

### 4.1 Outreach (không đăng số HH)

| Nhóm | Hook thực tế | CTA | Gói gợi ý khi bán |
|------|--------------|-----|-------------------|
| NH / BH / KT / HR | Tệp vàng an cư, e ngại thủ tục → thu nhập 2 hợp pháp | Vé webinar / đăng ký | Thường chọn deal 1–2 |
| Sales ô tô / MG tự do | Cross-sale khách xe / hụt TM | Link đăng ký + hướng dẫn | Deal 2–3 (hoặc 4 nếu có CCHN) |
| Cán bộ CĐ KCX–KCN | An sinh đoàn viên + thu nhập chính đáng | Zoom trao đổi | Thường deal 1–2 |

**Hệ thống:** lead/partner source theo nhóm; outreach **không** kèm bảng số HH chi tiết (chính sách chung / vé webinar / link đăng ký thì được).

### 4.2 Đa kênh

| Kênh | Việc | Hệ thống |
|------|------|----------|
| SEO dự án/chính sách | Traffic buyer + uy tín | Hub/bài NOXH hiện có |
| SEO / LP đối tác | TOFU→BOFU; chính sách chung; không bảng số HH | LP chương trình + đăng ký account |
| Fanpage 3 dạng | Story nhân văn · B2B đối tác · Webinar khan hiếm | Magnix content queue L3 + CTA LP |
| Webinar | 4 chế độ **chọn theo từng giao dịch** + QR đăng ký | Slide SoT: 1 slide/ý giải thích linh hoạt deal; QR → form account |

Hotline đối tác (brief): **0826600800** — cấu hình support partner, tách hotline buyer nếu cần.

---

## 5. Giữ khách / độc quyền lead (fairplay chăm sóc)

> Hiểu đúng theo ý chương trình — hệ thống phải bám nhịp **chăm sóc thật**, không chỉ “khai báo xong ngồi giữ 60 ngày”.

### 5.1 Luật khung

| Luật | Nội dung |
|------|----------|
| **Độc quyền mặc định** | Đối tác giữ lead đã khai báo **tối đa 60 ngày** — trong thời gian này khóa không cho môi giới / đối tác khác “giật khách”. |
| **Bắt buộc cập nhật chăm sóc** | Phải ghi nhận tiến độ / hoạt động chăm sóc (đi xem dự án, chat, gặp mặt, gọi tư vấn, …) để **xác minh** đang tư vấn thật. |
| **Ngắt sớm nếu im** | Im lặng **quá 30 ngày** không có cập nhật chăm sóc hợp lệ → **hết độc quyền ngay** (không chờ đủ 60 ngày). Lead mở cho môi giới khác. |
| **Đủ 60 ngày + vẫn đang chăm** | Nếu cập nhật thường xuyên và tới ngày 60 vẫn còn làm việc với lead → được **request admin** gia hạn, **tối đa +15 ngày** (không tự động). |
| **Đang được chăm thì khóa** | Lead đã có đối tác đang chăm sóc hợp lệ (trong cửa sổ độc quyền + chưa vi phạm 30 ngày im) → đối tác khác không nhận / không giật. |

### 5.2 Cập nhật chăm sóc (CS) hợp lệ — bắt buộc có bằng chứng

Mỗi lần cập nhật CS (để reset đồng hồ im 30 ngày / chứng minh đang tư vấn) phải có:

| Bắt buộc | Chi tiết |
|----------|----------|
| **Loại hoạt động** (enum) | Xem bảng dưới |
| **Thời điểm** | Thời gian thực hiện (mặc định = lúc ghi; cho phép chỉnh trong SOP) |
| **Ghi chú (note)** | Mô tả ngắn nội dung CS — bắt buộc, không để trống |
| **Đính kèm ảnh** | Ít nhất **1 ảnh** làm bằng chứng (screenshot chat, ảnh gặp/thăm DA, …) — bắt buộc |

**Mục đích:** tránh lạm dụng chính sách giữ khách (tick CS ảo không chăm thật).

**Enum loại CS (P0 — có thể bổ sung L3 sau, không xóa mã đã dùng):**

| Code | Nhãn | Gợi ý bằng chứng |
|------|------|------------------|
| `CALL` | Gọi điện | Screenshot nhật ký gọi / ghi chú nội dung gọi + ảnh liên quan nếu có |
| `CHAT` | Chat (Zalo/SMS/…) | Screenshot đoạn chat |
| `MEET` | Gặp mặt | Ảnh buổi gặp / địa điểm (không bắt buộc lộ mặt khách nếu nhạy cảm — SOP L3) |
| `SITE_VISIT` | Thăm dự án | Ảnh + bước trong hành trình CS; thưởng 500k chỉ sau **Admin xác minh CĐT** |
| `DOCUMENT` | Trao đổi / nhận hồ sơ giấy tờ | Ảnh phiếu / checklist (che PII thừa) |
| `OTHER` | Khác | Note rõ lý do + ảnh liên quan |

**Không hợp lệ (không reset đồng hồ 30 ngày):**

- Chỉ chọn loại + thời điểm, **thiếu note hoặc thiếu ảnh**  
- Note vô nghĩa / ảnh không liên quan (Ops/Super có quyền **từ chối CS** → không tính)  
- `SITE_VISIT` đòi thưởng 500k nhưng **Admin chưa xác minh** với CĐT / NV trực dự án  

**Quyền:** Đối tác tạo CS trên lead/deal của mình · Ops/Super xem timeline · Super có thể reject CS gian dối.

---

### 5.3 Đồng hồ chạy thế nào

```
Lead vào hệ thống + gán đối tác (độc quyền bắt đầu)
        │
        ├─ Có cập nhật CS hợp lệ (loại + thời điểm + note + ảnh, chưa bị reject)
        │     → reset / duy trì “đồng hồ im lặng 30 ngày”
        │     → độc quyền tiếp tục tới trần 60 ngày (hoặc +15 nếu admin duyệt)
        │
        └─ Không có CS hợp lệ ≥ 30 ngày liên tục
              → Độc quyền DỪNG sớm → lead mở cho MG khác
```

**Không hiểu nhầm**

| Đúng | Sai |
|------|-----|
| 60 ngày = trần độc quyền **khi còn chăm sóc có bằng chứng** | Khai báo lead xong được giữ đủ 60 ngày dù không làm gì |
| 30 ngày = hạn **im lặng** (không CS hợp lệ) | Tick loại không ảnh/note vẫn tính |
| +15 ngày = **xin admin**, chỉ khi đã sát 60 và còn CS thật | Tự gia hạn / gia hạn nhiều lần vô hạn |
| CS = loại + thời điểm + **note + ảnh** | Chỉ đổi status “đang chăm” |

### 5.4 Hệ thống cần (map sản phẩm)

| Nhu cầu | Surface |
|---------|---------|
| Log CS: enum + thời điểm + note + **upload ảnh** (≥1) | Mini Agent trên lead/deal + Ops thấy timeline |
| Reject CS / không tính vào đồng hồ | Admin Super |
| Đếm ngày từ **CS hợp lệ cuối** (30) và từ **bắt đầu độc quyền** (60) | Rule engine / job hàng ngày |
| Trạng thái: `exclusive` · `released_silent` · `released_expired` · `extend_requested` · `extended` | Lead / case field |
| Khóa giật khách khi `exclusive` / `extended` | Attribution + claim gate |
| Request +15 · Super duyệt | Admin web |
| Đồng hồ **chỉ 60/30/+15** | Thay 20 ngày LV — không song song |

**Lưu ý kỹ thuật (chốt):** Đồng hồ độc quyền **thống nhất 60 / 30 / +15** (thay ~20 ngày LV). **Không** chạy song song. CS chỉ reset đồng hồ 30 ngày khi **hợp lệ** (enum + note + ảnh, chưa reject). Implement: cập nhật rule/playbook/cron cũ → SoT này.

---

### 5.5 Xung đột referral đối tác vs Ops (chốt)

| Nguyên tắc | Ý nghĩa |
|------------|---------|
| **Một lead — một bên đang chăm sóc** | Đã có người/bộ phận CS thì **chặn từ đầu** — không để bên khác chen ngang “giật khách”. |
| **Lead vào House X phải lên tới bước gọi** | Khi lead vào pipeline nội bộ, cập nhật trạng thái rõ (lead mới → sẵn sàng / đã vào bước gọi). Thao tác **gọi / đã bắt đầu CS** được **ưu tiên** ghi nhận exclusive. |
| **In-house cũng tuân 60/30/+15** | Ops House X đang chăm sóc **không** đứng ngoài fairplay: vẫn độc quyền theo đồng hồ thống nhất, vẫn cần CS hợp lệ / im 30 ngày → nhả, vẫn +15 xin Admin. Không “Ops thì giữ vô hạn không bằng chứng”. |
| **Referral đối tác + Ops đã gọi** | Ưu tiên bên **đã can thiệp CS** (gọi/tư vấn/gặp). Partner khai báo sau hoặc trùng SĐT khi Ops đã CS → **chặn claim / chặn giật**; attribution HH đối tác chỉ khi deal/referral hợp lệ *trước* hoặc theo rule Admin (không phá exclusive đang chạy). |

**Map chỉnh so với `LEAD_ATTRIBUTION_CONFLICT_RULES.md` hiện tại**

- Giữ tinh thần R4 (Ops đã CONTACTED+ → chặn CTV claim).  
- Thay cửa sổ **20 ngày LV** bằng **60/30/+15** (§5) — **một** đồng hồ cho cả Ops in-house và affiliate.  
- “Đã chăm sóc” = có bước CS / gọi trong hành trình (không chỉ gán `assignedBrokerId`).  
- Implement: cập nhật conflict + claim gate + playbook cho khớp SoT này.

---

## 6. Map sang bề mặt House X (ai dùng gì)

| Việc | Mini App Agent | Web public | Ops / Admin web |
|------|----------------|------------|-----------------|
| Đăng ký account đối tác | Deep-link sau duyệt | **LP + form** (GĐ1) | Duyệt hồ sơ |
| **Chọn cấp cho deal** | P0: mỗi giới thiệu/HS chọn 1–4 | — | Thấy `dealTier` trên lead/case |
| Webinar / kit / **E-contract** | Xem HĐ · OTP/ký tay · trạng thái đã ký | — | Super xem hồ sơ HĐ đã lưu |
| Hồ sơ HĐ đã ký | **Trong tài khoản đối tác** — xem lại mọi lúc | — | Audit Admin |
| Share mã / giới thiệu | **P0 campaign** | Referral cookie/link | — |
| Deal cấp 1 → tư vấn buyer | Không chốt | Form khách | **Ops telesales** |
| Deal cấp 3–4 → HS NOXH | Cases theo deal | — | Conflict / QA · **§5.5** exclusive 60/30/+15 cả Ops |
| **Cập nhật chăm sóc lead** | Log: enum + note + **ảnh ≥1** | — | Timeline; reject CS ảo; duyệt +15 |
| Hoa hồng % theo dealTier | Xem sau khi có HĐMB + giá nhập | Không bảng % public | Ops/Super nhập giá sau ký → tính HH |
| Tiến độ / kết quả lead | Đối tác xem timeline | — | Ops cập nhật + CS |
| **Hành trình CS (CRM)** | Đối tác và/hoặc Ops ghi từng bước | — | Admin xem; xác minh thăm DA với CĐT → thưởng 500k |
| Thưởng thăm DA +500k | Thấy trạng thái sau Admin duyệt | Khung public tùy L3 | Super xác minh nguồn CĐT rồi chi |
| Help | FAB P0: SĐT/Zalo/email (shell đủ); AI bổ sung sau | — | Playbook |

---

## 7. Gap hiện tại → ưu tiên (để hệ thống bám chương trình)

| # | Thực tế chương trình cần | Hiện trạng gần đúng | Việc cần |
|---|--------------------------|---------------------|----------|
| 1 | Cấp theo **deal** (`dealTier` 1–4) | CTV/broker account-level | Schema + UI chọn cấp mỗi giao dịch; HH theo deal |
| 2 | LP + form đăng ký — **giữ** `/affiliate-bat-dong-san` + CTA CTV hiện có | LP đã thiết kế; thông điệp chưa khớp SoT chương trình | **Sửa copy in-place** (không tạo LP mới): 4 chế độ theo deal, NOXH quốc gia + LĐLĐ, giấu bảng % |
| 3 | E-contract **tự build** (OTP ± ký tay mobile) + lưu hồ sơ account | Duyệt CTV admin | Không vendor; ký xong mới full quyền deal; xem lại trong tài khoản bất cứ lúc nào |
| 4 | Khai báo lead **A+B+C** (đối tác chọn) | Form CTV/lead mỏng | UI: khách + dự án + dealTier; rồi Ops bố trí hỗ trợ theo C |
| 5 | HH: **% × giá căn HĐMB** — nhập **sau ký HĐMB** (Ops/Super) | Commissions API | Không nhập giá lúc mở lead; đối tác xem tiến độ suốt deal; HH hiện sau khi có base |
| 5b | **Hành trình CS (CRM)** trên deal + thưởng thăm DA +500k | Conversion/appointment mỏng | Module hành trình mới (nếu thiếu): bước gặp/thăm/cọc/HĐMB; đối tác trọn hoặc ghép HX; Admin xác minh CĐT rồi chi 500k |
| 6 | **Giữ khách 60/30/+15** (thống nhất, thay 20 ngày LV) | Lock ~20 ngày LV hiện có | Thay rule cũ; **không** song song; UI log CS + admin +15 |
| 7 | Media kit / outreach | Playbook Magnix | Kit theo nhóm đối tượng (L3) |
| 8 | Mini tin cậy kiểu Citics + **parity web đầy đủ** | Agent stack · admin web | P0 **cả hai**; **UI Mini khóa:** [`AGENT_MINIAPP_UI_APPROVED.md`](./AGENT_MINIAPP_UI_APPROVED.md); web = bản đủ |
| 9 | Thi đua / vinh danh tháng | Chưa | P2 sau khi phễu ổn |

---

## 8. Nguyên tắc vận hành (không đàm phán)

1. **Cấp theo giao dịch / sản phẩm** — cùng người, deal khác nhau chọn cấp khác nhau. **Đổi tier:** tự đổi chỉ trước khi bộ phận tiếp theo chăm sóc; sau đó khóa · request Admin hạn chế (House X được từ chối).  
2. **HH số chi tiết ≠ public** — Fanpage/web không đăng bảng % (0,5–2%) trừ khi L3 cho phép một phần thưởng thăm DA; mặc định số chỉ in-app + admin. Chính sách chung (4 chế độ, chọn theo deal, giữ khách…) vẫn public.  
2b. **HH** sau ký HĐMB (Ops/Super nhập giá). **Hành trình CS (CRM)** trên deal — đối tác trọn hoặc ghép House X; mọi bước lưu lại. **Thưởng +500k** thăm DA: Admin xác minh với CĐT rồi chi (không tự động).  
3. **Thông điệp cấp độ phải nói rõ** — đối tác chọn cấp cho mỗi giao dịch; không copy kiểu “bậc tài khoản khóa”.  
4. **Gate 3–4:** chọn mức được ngay; LMS/CCHN khóa tính năng đến khi đủ. Đổi tier = §3.0b (khóa sau can thiệp bộ phận khác).  
5. **Buyer ≠ Partner** — lane/form tách. **Xung đột:** đã có bên CS (kể cả Ops in-house) → chặn giật từ đầu; gọi/CS ưu tiên; exclusive **cùng 60/30/+15**.  
6. **Deal cấp 1 → Ops tư vấn–chốt** — đối tác không bị ép bán kiểu MG.  
7. **Giữ khách theo chăm sóc thật** — trần 60 ngày; im ≥30 ngày không CS **hợp lệ** (thiếu note/ảnh hoặc bị reject) → mất độc quyền sớm; sát 60 + còn CS → xin admin tối đa +15; đang exclusive thì không giật. **Một đồng hồ 60/30/+15** — thay 20 ngày LV, không song song. CS bắt buộc **bằng chứng** để chống lạm dụng.  
8. **Mini + web** — P0 cả hai; web = phiên bản đầy đủ; **Mini ưu tiên cảm nhận** chuyên nghiệp / năng lực House X.  
9. **Value-first** — kit, SOP; Help FAB P0 kênh người (AI sau). Không spam.  

---

*Cập nhật: % HH + thưởng 500k thăm DA. **Căn cứ HH = giá căn trên HĐMB** (chưa VAT; không gồm phí bảo trì 2%; chiết khấu/ưu đãi/quà theo §1.3). Đồng hồ độc quyền **chỉ 60/30/+15** — thay 20 ngày LV, không song song. Không hardcode bảng % vào Fanpage/SEO.*
