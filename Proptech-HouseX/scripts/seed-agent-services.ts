/**
 * Seed catalog dịch vụ Agent + quiz hội nhập / pháp lý cơ bản.
 * Usage: npm run db:seed:agent-services
 */
import {
  HOUSEX_AGENT_GUIDE_CONTENT_MARKDOWN,
  HOUSEX_AGENT_GUIDE_SERVICE_META,
} from "../lib/content/agent-guides/house-x-agent-guide";
import {
  HOUSEX_INSURANCE_CONTENT_MARKDOWN,
  HOUSEX_INSURANCE_SERVICE_META,
} from "../lib/content/agent-guides/house-x-insurance";
import {
  NGUON_KHACH_VAY_CONTENT_MARKDOWN,
  NGUON_KHACH_VAY_SERVICE_META,
} from "../lib/content/agent-guides/nguon-khach-vay";
import {
  PHAP_LY_BDS_CONTENT_MARKDOWN,
  PHAP_LY_BDS_SERVICE_META,
} from "../lib/content/agent-guides/phap-ly-bds";
import {
  THAM_DINH_BDS_CONTENT_MARKDOWN,
  THAM_DINH_BDS_SERVICE_META,
} from "../lib/content/agent-guides/tham-dinh-bds";
import { prisma } from "../lib/prisma";

type Q = {
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correct: string;
};

async function upsertService(input: {
  code: string;
  category: "TRAINING" | "LEGAL" | "PRODUCT";
  name: string;
  description: string;
  contentMarkdown: string;
  isRequiredForCtv?: boolean;
  requiresCode?: string | null;
  sortOrder: number;
  quiz?: { title: string; passScore: number; questions: Q[] };
}) {
  const service = await prisma.agentService.upsert({
    where: { code: input.code },
    create: {
      code: input.code,
      category: input.category,
      name: input.name,
      description: input.description,
      contentMarkdown: input.contentMarkdown,
      isRequiredForCtv: input.isRequiredForCtv ?? false,
      requiresCode: input.requiresCode ?? null,
      sortOrder: input.sortOrder,
      active: true,
    },
    update: {
      name: input.name,
      description: input.description,
      contentMarkdown: input.contentMarkdown,
      isRequiredForCtv: input.isRequiredForCtv ?? false,
      requiresCode: input.requiresCode ?? null,
      sortOrder: input.sortOrder,
      active: true,
      category: input.category,
    },
  });

  if (input.quiz) {
    const quiz = await prisma.agentQuiz.upsert({
      where: { serviceId: service.id },
      create: {
        serviceId: service.id,
        title: input.quiz.title,
        passScore: input.quiz.passScore,
        version: 1,
        active: true,
      },
      update: {
        title: input.quiz.title,
        passScore: input.quiz.passScore,
        active: true,
      },
    });

    await prisma.agentQuizQuestion.deleteMany({ where: { quizId: quiz.id } });
    await prisma.agentQuizQuestion.createMany({
      data: input.quiz.questions.map((q, i) => ({
        quizId: quiz.id,
        prompt: q.prompt,
        optionsJson: q.options,
        correctOption: q.correct,
        sortOrder: i + 1,
      })),
    });
  }

  return service;
}

async function main() {
  await upsertService({
    code: "CTV_ONBOARDING",
    category: "TRAINING",
    name: "Đào tạo hội nhập CTV",
    description:
      "Khóa bắt buộc trước khi mở dịch vụ thả lead NOXH. Hiểu vai trò CTV và Contact Firewall.",
    isRequiredForCtv: true,
    sortOrder: 10,
    contentMarkdown: `## Vai trò CTV House X

- Bạn **giới thiệu** khách — chuyên viên House X phụ trách tư vấn pháp lý / vay.
- Không hứa "chắc vay được", không thu tiền khách ngoài chính sách sàn.
- SĐT khách được **mask** trên app Agent; mọi nhắc nhở qua hệ thống.

## Contact Firewall

Bạn thấy tiến độ hồ sơ và checklist giấy tờ, không cần gọi khách thay Ops trừ khi Ops hướng dẫn.

## Thả lead minh bạch

Chỉ CTV đã duyệt mới thả lead. Không giới thiệu số của chính mình.
`,
    quiz: {
      title: "Bài kiểm tra hội nhập CTV",
      passScore: 70,
      questions: [
        {
          prompt: "Ai phụ trách tư vấn pháp lý / vay cho khách NOXH?",
          options: [
            { id: "a", label: "CTV tự tư vấn và thu phí khách" },
            { id: "b", label: "Chuyên viên House X" },
            { id: "c", label: "Chủ đầu tư trực tiếp qua CTV" },
          ],
          correct: "b",
        },
        {
          prompt: "Contact Firewall nghĩa là gì?",
          options: [
            { id: "a", label: "CTV luôn gọi khách trước Ops" },
            { id: "b", label: "SĐT khách mask — CTV theo dõi tiến độ, Ops liên hệ chính" },
            { id: "c", label: "Không được xem hồ sơ nào" },
          ],
          correct: "b",
        },
        {
          prompt: "CTV được hứa với khách «chắc chắn vay được» không?",
          options: [
            { id: "a", label: "Được, nếu dự án uy tín" },
            { id: "b", label: "Không — không cam kết duyệt vay" },
            { id: "c", label: "Được nếu khách trả thêm phí" },
          ],
          correct: "b",
        },
      ],
    },
  });

  await upsertService({
    code: "LEGAL_BROKER_BASICS",
    category: "LEGAL",
    name: "Pháp lý môi giới & giao dịch BĐS",
    description:
      "Kiến thức nền: hành nghề môi giới, hợp đồng, giao dịch — không thay thế tư vấn luật sư.",
    sortOrder: 20,
    contentMarkdown: `## Hành nghề môi giới BĐS

- Hoạt động môi giới bất động sản chịu sự điều chỉnh của pháp luật Kinh doanh BĐS.
- Sàn / CTV cần tuân thủ quy định sàn House X và không thay mặt ngân hàng cam kết vay.

## Giao dịch minh bạch

- Không thu tiền «phí giữ chỗ» ngoài quy trình chính thức của dự án / sàn.
- Hồ sơ pháp lý dự án (GPXD, quy hoạch…) do CĐT / sàn công bố — CTV không tự sửa số liệu.

## NOXH

Điều kiện mua NOXH (đối tượng, nhà ở, thu nhập) thay đổi theo văn bản — luôn đối chiếu nguồn chính thức / công cụ House X.
`,
    quiz: {
      title: "Bài kiểm tra pháp lý cơ bản",
      passScore: 70,
      questions: [
        {
          prompt: "CTV có được thu phí giữ chỗ ngoài quy trình sàn không?",
          options: [
            { id: "a", label: "Được nếu khách đồng ý miệng" },
            { id: "b", label: "Không — chỉ theo quy trình chính thức" },
            { id: "c", label: "Được nếu dưới 5 triệu" },
          ],
          correct: "b",
        },
        {
          prompt: "Nguồn nào dùng để đối chiếu điều kiện NOXH?",
          options: [
            { id: "a", label: "Tin nhắn group hoặc tin đồn" },
            { id: "b", label: "Văn bản chính thức / công cụ House X" },
            { id: "c", label: "Chỉ theo lời CĐT tại dự án" },
          ],
          correct: "b",
        },
        {
          prompt: "Cam kết duyệt vay thay ngân hàng là?",
          options: [
            { id: "a", label: "Được khuyến khích để chốt khách" },
            { id: "b", label: "Không được — vượt thẩm quyền CTV/sàn" },
            { id: "c", label: "Được nếu có cọc" },
          ],
          correct: "b",
        },
      ],
    },
  });

  await upsertService({
    code: HOUSEX_AGENT_GUIDE_SERVICE_META.code,
    category: HOUSEX_AGENT_GUIDE_SERVICE_META.category,
    name: HOUSEX_AGENT_GUIDE_SERVICE_META.name,
    description: HOUSEX_AGENT_GUIDE_SERVICE_META.description,
    sortOrder: HOUSEX_AGENT_GUIDE_SERVICE_META.sortOrder,
    contentMarkdown: HOUSEX_AGENT_GUIDE_CONTENT_MARKDOWN,
    quiz: {
      title: "Bài kiểm tra House X Agent & quy trình vay",
      passScore: 70,
      questions: [
        {
          prompt: "Tài khoản Agent mới mặc định được kích hoạt đối tác cho dịch vụ nào?",
          options: [
            { id: "a", label: "Chỉ đăng tin mua bán" },
            { id: "b", label: "Vay thế chấp và Kinh doanh thẩm định" },
            { id: "c", label: "Chỉ Trợ lý AI nâng cao" },
          ],
          correct: "b",
        },
        {
          prompt: "HX-Value trong tra cứu BĐS là gì?",
          options: [
            { id: "a", label: "Số tiền giải ngân thực tế từ ngân hàng" },
            { id: "b", label: "Giá trị ước tính từ AI và lịch sử giao dịch khu vực" },
            { id: "c", label: "Phí thẩm định chứng thư cứng" },
          ],
          correct: "b",
        },
        {
          prompt: "Ở bước 4 quy trình vay, ngân hàng yêu cầu House X làm gì?",
          options: [
            { id: "a", label: "Thu phí Point từ khách hàng" },
            { id: "b", label: "Thẩm định giá hiện trường và xuất chứng thư cứng" },
            { id: "c", label: "Tự giải ngân thay ngân hàng" },
          ],
          correct: "b",
        },
        {
          prompt: "Tích màu vàng trên thông tin tài sản nghĩa là gì?",
          options: [
            { id: "a", label: "Hồ sơ đã được ngân hàng duyệt" },
            { id: "b", label: "Thiếu / chưa đủ thông tin — cần chỉnh sửa, bóc tách VPQH" },
            { id: "c", label: "Đã giải ngân và cộng hoa hồng" },
          ],
          correct: "b",
        },
        {
          prompt: "Hồ sơ bị ngân hàng hủy với lý do «HỒ SƠ RÁC» thì chế tài nào?",
          options: [
            { id: "a", label: "Chỉ cảnh cáo lần đầu" },
            { id: "b", label: "Khóa vĩnh viễn" },
            { id: "c", label: "Chỉ trừ Point khả dụng" },
          ],
          correct: "b",
        },
      ],
    },
  });

  await upsertService({
    code: NGUON_KHACH_VAY_SERVICE_META.code,
    category: NGUON_KHACH_VAY_SERVICE_META.category,
    name: NGUON_KHACH_VAY_SERVICE_META.name,
    description: NGUON_KHACH_VAY_SERVICE_META.description,
    sortOrder: NGUON_KHACH_VAY_SERVICE_META.sortOrder,
    contentMarkdown: NGUON_KHACH_VAY_CONTENT_MARKDOWN,
    quiz: {
      title: "Bài kiểm tra nguồn khách hàng vay",
      passScore: 70,
      questions: [
        {
          prompt: "Ba nhóm nguồn khách vay theo trạng thái giao dịch BĐS là gì?",
          options: [
            { id: "a", label: "Chỉ khách NOXH, khách thương mại, khách thuê" },
            {
              id: "b",
              label:
                "Đang mua bán (vay mới), đã mua bán (vay bù đắp), nguồn khác (tái tài trợ / SXKD…)",
            },
            { id: "c", label: "Chỉ bên mua và bên bán" },
          ],
          correct: "b",
        },
        {
          prompt: "Khách có 3 tỷ, không ưng căn ≤ 3 tỷ — hướng xử lý House X gợi ý?",
          options: [
            { id: "a", label: "Buộc khách mua ngay căn cấp 4 trong ngân sách" },
            {
              id: "b",
              label:
                "Nâng tầm tài sản + vay bù phần thiếu; giữ dự phòng tiền mặt",
            },
            { id: "c", label: "Chỉ tư vấn gửi tiết kiệm, không giới thiệu vay" },
          ],
          correct: "b",
        },
        {
          prompt: "Vay bù đắp thường nhắm đối tượng nào?",
          options: [
            {
              id: "a",
              label: "Đã mua bán/sang tên trong khoảng 2 năm bằng vốn tự có hoặc vay ngoài ngắn hạn",
            },
            { id: "b", label: "Chỉ khách chưa từng sở hữu BĐS" },
            { id: "c", label: "Chỉ doanh nghiệp không có tài sản thế chấp" },
          ],
          correct: "a",
        },
        {
          prompt: "Khi tư vấn chuyển đổi mục đích vay (vd. KD → mua bán BĐS), nguyên tắc nào đúng?",
          options: [
            { id: "a", label: "Luôn kê khai giả mục đích để được kỳ hạn dài" },
            {
              id: "b",
              label:
                "Chỉ khi có giao dịch phù hợp thật; đối chiếu quy định ngân hàng — không giả mục đích",
            },
            { id: "c", label: "Không cần giấy tờ pháp lý tài sản" },
          ],
          correct: "b",
        },
      ],
    },
  });

  await upsertService({
    code: PHAP_LY_BDS_SERVICE_META.code,
    category: PHAP_LY_BDS_SERVICE_META.category,
    name: PHAP_LY_BDS_SERVICE_META.name,
    description: PHAP_LY_BDS_SERVICE_META.description,
    sortOrder: PHAP_LY_BDS_SERVICE_META.sortOrder,
    contentMarkdown: PHAP_LY_BDS_CONTENT_MARKDOWN,
    quiz: {
      title: "Bài kiểm tra phân tích pháp lý BĐS",
      passScore: 70,
      questions: [
        {
          prompt: "«Sổ hồng mẫu mới» tương ứng loại GCN nào?",
          options: [
            { id: "a", label: "Chỉ GCN Quyền sử dụng đất (sổ đỏ)" },
            {
              id: "b",
              label:
                "GCN QSDĐ, quyền sở hữu nhà ở và tài sản khác gắn liền với đất",
            },
            { id: "c", label: "Chỉ Hợp đồng mua bán với chủ đầu tư" },
          ],
          correct: "b",
        },
        {
          prompt: "Thông tin thế chấp / xóa chấp thường nằm ở đâu trên GCN?",
          options: [
            { id: "a", label: "Chỉ trên Trang 01 định danh chủ sở hữu" },
            { id: "b", label: "Trang 04 (biến động pháp lý) và/hoặc trang bổ sung" },
            { id: "c", label: "Chỉ trên bản vẽ vệ tinh, không ghi trên sổ" },
          ],
          correct: "b",
        },
        {
          prompt: "Rủi ro chính của Giấy phép xây dựng tạm (GPXD có thời hạn)?",
          options: [
            {
              id: "a",
              label:
                "Khi thực hiện quy hoạch, chủ TS phải tự tháo dỡ và thường không được đền bù phần xây tạm",
            },
            { id: "b", label: "Luôn được đền bù 100% khi thu hồi đất" },
            { id: "c", label: "Không ảnh hưởng hạn mức vay ngân hàng" },
          ],
          correct: "a",
        },
        {
          prompt: "Khi số tầng trên sổ lệch với thực tế căn hộ, chuyên viên nên làm gì?",
          options: [
            { id: "a", label: "Bỏ qua vì ngân hàng không quan tâm" },
            { id: "b", label: "Ghi nhận rõ lệch số tầng/căn để đánh giá chính xác" },
            { id: "c", label: "Tự sửa số trên ảnh scan sổ hồng" },
          ],
          correct: "b",
        },
      ],
    },
  });

  await upsertService({
    code: HOUSEX_INSURANCE_SERVICE_META.code,
    category: HOUSEX_INSURANCE_SERVICE_META.category,
    name: HOUSEX_INSURANCE_SERVICE_META.name,
    description: HOUSEX_INSURANCE_SERVICE_META.description,
    sortOrder: HOUSEX_INSURANCE_SERVICE_META.sortOrder,
    contentMarkdown: HOUSEX_INSURANCE_CONTENT_MARKDOWN,
    quiz: {
      title: "Bài kiểm tra House X Insurance",
      passScore: 70,
      questions: [
        {
          prompt: "Khi nào hệ thống yêu cầu Agent xác nhận đã tư vấn bảo hiểm?",
          options: [
            { id: "a", label: "Khi rút hoa hồng về tài khoản ngân hàng" },
            {
              id: "b",
              label:
                "Khi nộp đơn vay với gói bắt buộc mua bảo hiểm nhà ở",
            },
            { id: "c", label: "Chỉ khi khách yêu cầu hủy hợp đồng vay" },
          ],
          correct: "b",
        },
        {
          prompt: "Xác nhận «CHƯA tư vấn» bảo hiểm thì hệ quả với Agent?",
          options: [
            { id: "a", label: "Vẫn nhận đủ hoa hồng BH nhà ở 20%" },
            { id: "b", label: "Không được hưởng hoa hồng bảo hiểm cho hồ sơ đó" },
            { id: "c", label: "Bị khóa tài khoản Agent ngay lập tức" },
          ],
          correct: "b",
        },
        {
          prompt: "Tỷ lệ hoa hồng bảo hiểm nhà ở / bảo hiểm vật chất xe?",
          options: [
            { id: "a", label: "Nhà ở 15% · Xe 20%" },
            { id: "b", label: "Nhà ở 20% · Xe 15%" },
            { id: "c", label: "Cả hai đều 25%" },
          ],
          correct: "b",
        },
        {
          prompt: "Phí bảo hiểm trên hệ thống ngay sau khi nộp đơn vay là gì?",
          options: [
            { id: "a", label: "Phí tạm tính — tính lại khi có giá/hạn mức cuối" },
            { id: "b", label: "Phí cuối cùng không bao giờ thay đổi" },
            { id: "c", label: "Chỉ là phí thẩm định chứng thư cứng" },
          ],
          correct: "a",
        },
      ],
    },
  });

  await upsertService({
    code: THAM_DINH_BDS_SERVICE_META.code,
    category: THAM_DINH_BDS_SERVICE_META.category,
    name: THAM_DINH_BDS_SERVICE_META.name,
    description: THAM_DINH_BDS_SERVICE_META.description,
    sortOrder: THAM_DINH_BDS_SERVICE_META.sortOrder,
    contentMarkdown: THAM_DINH_BDS_CONTENT_MARKDOWN,
    quiz: {
      title: "Bài kiểm tra thẩm định khách hàng lẻ",
      passScore: 70,
      questions: [
        {
          prompt: "Khách hàng lẻ trong dịch vụ thẩm định là ai?",
          options: [
            { id: "a", label: "Khách hàng vay ngân hàng mua nhà" },
            { id: "b", label: "Khách hàng không có nhu cầu vay ngân hàng" },
            { id: "c", label: "Chỉ khách hàng doanh nghiệp SME" },
          ],
          correct: "b",
        },
        {
          prompt: "Công thức hoa hồng Agent với hồ sơ thẩm định khách hàng lẻ?",
          options: [
            { id: "a", label: "10% × tổng phí thu (gồm phụ phí)" },
            { id: "b", label: "25% × doanh thu tính hoa hồng chưa VAT (loại trừ phụ phí)" },
            { id: "c", label: "50% × phí chứng thư sau thuế" },
          ],
          correct: "b",
        },
        {
          prompt: "Hoa hồng thẩm định khách hàng lẻ được chi trả khi nào?",
          options: [
            { id: "a", label: "Ngày 05 và 20 hàng tháng" },
            { id: "b", label: "Ngay khi khách nhận chứng thư" },
            { id: "c", label: "Ngày 15 hàng tháng theo đối chiếu hồ sơ tháng đó" },
          ],
          correct: "c",
        },
        {
          prompt: "Sau khi Agent tạo đủ thông tin, vận hành thường làm gì trước khảo sát?",
          options: [
            { id: "a", label: "Báo thu 100% phí hồ sơ và xác nhận lịch khảo sát hiện trạng" },
            { id: "b", label: "Chỉ gửi báo cáo HTML, chưa thu phí" },
            { id: "c", label: "Yêu cầu Agent đi khảo sát thay chuyên viên thẩm định" },
          ],
          correct: "a",
        },
      ],
    },
  });

  await upsertService({
    code: "NOXH_CLAIM",
    category: "PRODUCT",
    name: "Thả lead & theo dõi hồ sơ NOXH",
    description:
      "Mở khi đã hoàn thành đào tạo hội nhập. Cho phép tạo hồ sơ và xem tiến độ.",
    requiresCode: "CTV_ONBOARDING",
    sortOrder: 30,
    contentMarkdown: `## Dịch vụ NOXH Claim

Sau khi đậu khóa hội nhập, bạn có thể:

1. Thả lead (tên + SĐT)
2. Theo dõi mốc hồ sơ
3. Nhắc khách qua hệ thống

Hoa hồng theo chính sách sàn khi hồ sơ đạt mốc ký.
`,
  });

  await upsertService({
    code: "LISTING_POST",
    category: "PRODUCT",
    name: "Đăng tin môi giới",
    description: "Đăng / quản lý tin mua bán — thuê trên nền tảng House X (web).",
    sortOrder: 40,
    contentMarkdown: `## Đăng tin

Dùng web House X mục Môi giới để đăng tin. Trên Mini App Agent giai đoạn này mở dần.
`,
  });

  console.log("OK — seeded agent services + quizzes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
