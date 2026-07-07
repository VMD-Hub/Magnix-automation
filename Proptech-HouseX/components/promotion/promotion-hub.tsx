"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { LuckyWheel } from "@/components/promotion/lucky-wheel";
import { PromotionTermsSection } from "@/components/promotion/promotion-terms-section";
import { PROMOTION_SPIN_CONSENT_LINE } from "@/lib/content/promotion-terms";
import { cn } from "@/lib/ui/cn";
import type {
  ParticipantState,
  PromotionCampaignPublic,
  WinnerBoardItem,
} from "@/lib/data/promotion";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import { getSiteUrl } from "@/lib/site-config";

type CampaignPayload = {
  campaign: PromotionCampaignPublic;
  live: boolean;
  winners: WinnerBoardItem[];
  participant: ParticipantState | null;
  auth: {
    loggedIn: boolean;
    emailVerified: boolean;
    name?: string;
  };
  isDemo?: boolean;
};

type PromotionHubProps = {
  slug?: string;
  preview?: boolean;
};

export function PromotionHub({ slug = DEFAULT_PROMOTION_SLUG, preview = false }: PromotionHubProps) {
  const [data, setData] = useState<CampaignPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    label: string;
    won: boolean;
    code: string | null;
  } | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  async function loadCampaign(opts?: { silent?: boolean }) {
    if (!opts?.silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const previewQ = preview ? "&preview=1" : "";
      const res = await fetch(`/api/promotions/campaign?slug=${slug}${previewQ}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Không tải được chương trình.");
      setData(json.data);
    } catch (e) {
      if (!opts?.silent) {
        setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu.");
      }
    } finally {
      if (!opts?.silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void loadCampaign();
    const previewQ = preview ? "&preview=1" : "";
    const id = window.setInterval(() => {
      void fetch(`/api/promotions/winners?slug=${slug}${previewQ}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.data?.winners) {
            setData((prev) => (prev ? { ...prev, winners: j.data.winners } : prev));
          }
        })
        .catch(() => undefined);
    }, 30000);
    return () => window.clearInterval(id);
  }, [slug, preview]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/khuyen-mai?ref=${slug}`
      : `${getSiteUrl()}/khuyen-mai`;

  async function requestSpin() {
    const res = await fetch("/api/promotions/spin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, preview: preview || data?.isDemo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message ?? "Không quay được.");
    return {
      segmentIndex: json.data.segmentIndex as number,
      prize: { label: json.data.prize.label as string },
      won: json.data.won as boolean,
      redemptionCode: json.data.redemptionCode as string | null,
    };
  }

  async function grantShareBonus() {
    setShareMsg(null);
    const res = await fetch("/api/promotions/share-bonus", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const json = await res.json();
    if (!res.ok) {
      setShareMsg(json.error?.message ?? "Không cộng lượt.");
      return;
    }
    setShareMsg(json.data.granted ? "Đã cộng thêm 1 lượt quay!" : json.data.message);
    setShareOpen(false);
    await loadCampaign();
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-slate-500">
        Đang tải chương trình…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
        <p>{error ?? "Không tìm thấy chương trình."}</p>
        {!preview ? (
          <p className="mt-3 text-sm text-red-700">
            Chương trình chưa được kích hoạt trên server. Admin chạy{" "}
            <code className="rounded bg-white px-1">npm run db:seed</code> trong thư mục app,
            hoặc xem thử tại{" "}
            <Link href="/preview/khuyen-mai" className="font-semibold underline">
              /preview/khuyen-mai
            </Link>
            .
          </p>
        ) : null}
      </div>
    );
  }

  const { campaign, live, winners, participant, auth } = data;
  const gate = resolveGate({ preview, live, auth, participant, isDemo: data.isDemo });

  return (
    <div className="space-y-10">
      {preview ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Chế độ preview</strong> — vòng quay mô phỏng, không ghi nhận kết quả thật.
        </div>
      ) : null}
      {data.isDemo && !preview ? (
        <div className="rounded-xl border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <strong>Dữ liệu mô phỏng.</strong> Chương trình chưa có trong database — bạn vẫn
          quay thử được. Admin chạy <code className="rounded bg-white px-1">npm run db:seed</code>{" "}
          trên server để bật chế độ thật.
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Vòng quay may mắn
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{campaign.name}</h1>
          {campaign.description ? (
            <p className="text-slate-600 leading-relaxed">{campaign.description}</p>
          ) : null}

          {participant?.win ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-900">Phần quà của bạn</p>
              <p className="mt-1 text-lg font-extrabold text-emerald-800">
                {participant.win.prizeLabel}
              </p>
              <p className="mt-2 text-sm text-emerald-700">
                Mã: <strong>{participant.win.redemptionCode}</strong>
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                Trạng thái: {fulfillmentLabel(participant.win.fulfillmentStatus)} — quà có giá trị
                sau khi ký HĐMB NOXH qua HouseX.
              </p>
            </div>
          ) : null}

          {gate.message ? (
            <div
              className={cn(
                "rounded-2xl border p-4 text-sm",
                gate.canSpin
                  ? "border-brand-200 bg-brand-50 text-brand-900"
                  : "border-slate-200 bg-slate-50 text-slate-700",
              )}
            >
              {gate.message}
              {gate.cta ? (
                <div className="mt-3">
                  <ButtonLink href={gate.cta.href} size="sm">
                    {gate.cta.label}
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          ) : null}

          {participant && !participant.hasWon && auth.loggedIn ? (
            <p className="text-sm text-slate-500">
              Còn <strong>{participant.spinsRemaining}</strong> lượt quay · Đã dùng{" "}
              {participant.spinsUsedTotal}/6 (tối đa)
            </p>
          ) : null}

          {lastResult && !lastResult.won ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">Kết quả lượt quay</p>
              <p className="mt-1 text-slate-700">{lastResult.label}</p>
            </div>
          ) : null}

          {auth.loggedIn &&
          !preview &&
          participant &&
          !participant.shareBonusGranted &&
          !participant.hasWon ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">
                Chia sẻ +1 lượt quay
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Copy link và chia sẻ — tick xác nhận để nhận thêm 1 lượt.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShareOpen(true)}
              >
                Chia sẻ chương trình
              </Button>
              {shareMsg ? <p className="mt-2 text-xs text-brand-700">{shareMsg}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-3">
          <LuckyWheel
            prizes={campaign.prizes}
            wheelLayout={campaign.wheelLayout}
            spinDurationMs={campaign.spinDurationMs}
            disabled={!gate.canSpin}
            onRequestSpin={requestSpin}
            onSpinComplete={(o) => {
              setLastResult({
                label: o.prizeLabel,
                won: o.won,
                code: o.redemptionCode,
              });
              if (!preview && !data.isDemo) {
                void loadCampaign({ silent: true });
              }
            }}
          />
          <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
            {PROMOTION_SPIN_CONSENT_LINE}{" "}
            <a
              href="#the-le-chuong-trinh"
              className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
              title="Xem thể lệ đầy đủ"
            >
              Xem thể lệ
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
          <Icon.BadgeCheck className="text-brand-600" /> Bảng trúng thưởng
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {winners.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">
              Chưa có người trúng — hãy là người đầu tiên!
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {winners.map((w) => (
                <li
                  key={w.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{w.displayName}</span>
                  <span className="text-brand-700">{w.prizeLabel}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(w.wonAt).toLocaleString("vi-VN")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {campaign.termsMarkdown ? (
        <PromotionTermsSection markdown={campaign.termsMarkdown} />
      ) : null}

      {shareOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <p className="font-bold text-slate-900">Chia sẻ chương trình</p>
            <p className="mt-2 text-sm text-slate-600">Copy link bên dưới và đăng lên mạng xã hội:</p>
            <input
              readOnly
              value={shareUrl}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              onFocus={(e) => e.target.select()}
            />
            <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={shareConfirmed}
                onChange={(e) => setShareConfirmed(e.target.checked)}
                className="mt-1"
              />
              Tôi đã chia sẻ link chương trình
            </label>
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                disabled={!shareConfirmed}
                onClick={() => void grantShareBonus()}
              >
                Nhận +1 lượt
              </Button>
              <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function resolveGate(input: {
  preview: boolean;
  live: boolean;
  auth: CampaignPayload["auth"];
  participant: ParticipantState | null;
  isDemo?: boolean;
}) {
  if (input.preview || input.isDemo) {
    return { canSpin: true, message: null, cta: null };
  }
  if (!input.live) {
    return {
      canSpin: false,
      message: "Chương trình khuyến mãi đã tạm kết thúc. Hẹn bạn ở đợt sau!",
      cta: null,
    };
  }
  if (!input.auth.loggedIn) {
    return {
      canSpin: false,
      message: "Đăng nhập tài khoản khách hàng để tham gia vòng quay.",
      cta: { href: "/dang-nhap?next=/khuyen-mai", label: "Đăng nhập" },
    };
  }
  if (!input.auth.emailVerified) {
    return {
      canSpin: false,
      message: "Vui lòng xác minh email trước khi quay.",
      cta: null,
    };
  }
  if (!input.participant?.noxhEligible) {
    return {
      canSpin: false,
      message:
        "Hoàn thành công cụ kiểm tra điều kiện NOXH với kết quả Đủ điều kiện để tham gia.",
      cta: { href: "/cong-cu/dieu-kien-noxh", label: "Kiểm tra NOXH" },
    };
  }
  if (input.participant.hasWon) {
    return {
      canSpin: false,
      message: "Bạn đã trúng phần quà — xem mục Phần quà của bạn bên trên.",
      cta: null,
    };
  }
  if (input.participant.spinsRemaining <= 0) {
    return {
      canSpin: false,
      message: input.participant.blockReason ?? "Hết lượt quay.",
      cta: null,
    };
  }
  return { canSpin: true, message: null, cta: null };
}

function fulfillmentLabel(status: string) {
  switch (status) {
    case "PENDING_CONTRACT":
      return "Chờ ký HĐMB";
    case "CONTRACT_SIGNED":
      return "Đã ký HĐMB — chờ trao quà";
    case "DELIVERED":
      return "Đã trao quà";
    default:
      return status;
  }
}
