/**
 * Seed catalog dịch vụ Agent + quiz hội nhập / pháp lý cơ bản.
 * Usage: npm run db:seed:agent-services
 */
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
