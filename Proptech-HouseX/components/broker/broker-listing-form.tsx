"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  BROKER_LISTING_PROVINCES,
  BROKER_PROPERTY_TYPE_OPTIONS,
  LISTING_GATE_HINT,
} from "@/lib/content/broker-listing-form-options";
import { propertyTypeFromSlug } from "@/lib/content/property-type-slug";
import { LISTING_STATUS_LABEL, TRANSACTION_TYPE_LABEL } from "@/lib/format";
import { cn } from "@/lib/ui/cn";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

type ListingDetail = {
  id: string;
  code: string;
  status: string;
  transactionType: string;
  propertyType: string;
  price: string | number;
  area: number | null;
  province: string;
  district: string;
  ward: string | null;
  address: string | null;
  description: string | null;
  rejectReason: string | null;
  media: { url: string; type: string }[];
};

function parsePrice(raw: string): number | null {
  const n = Number(raw.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

type ExistingImage = { url: string; status?: string };

export function BrokerListingForm({ listingId }: { listingId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(listingId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingCode, setExistingCode] = useState<string | null>(null);
  const [existingStatus, setExistingStatus] = useState<string>("DRAFT");
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(listingId ?? null);

  const [transactionType, setTransactionType] = useState<"SALE" | "RENT">("SALE");
  const [propertyType, setPropertyType] = useState("can_ho");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [province, setProvince] = useState<string>(BROKER_LISTING_PROVINCES[0]);
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  const loadListing = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/broker/me/listings?id=${listingId}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được tin.");
        return;
      }
      const l = json.data?.listing as ListingDetail;
      if (!l) return;
      setSavedId(l.id);
      setExistingCode(l.code);
      setExistingStatus(l.status);
      setRejectReason(l.rejectReason ?? null);
      setTransactionType(l.transactionType as "SALE" | "RENT");
      setPropertyType(l.propertyType);
      setPrice(String(l.price));
      setArea(l.area != null ? String(l.area) : "");
      setProvince(l.province);
      setDistrict(l.district);
      setWard(l.ward ?? "");
      setAddress(l.address ?? "");
      setDescription(l.description ?? "");
      setExistingImages(
        l.media.filter((m) => m.type === "image").map((m) => ({ url: m.url })),
      );
      setPendingFiles([]);
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  async function uploadPendingFiles(id: string) {
    if (pendingFiles.length === 0) return;

    const errors: string[] = [];
    const uploaded: ExistingImage[] = [];
    const startPosition = existingImages.length;

    for (let i = 0; i < pendingFiles.length; i++) {
      const fd = new FormData();
      fd.append("file", pendingFiles[i]!);
      fd.append("position", String(startPosition + i));

      const res = await fetch(`/api/listings/${id}/media/upload`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        errors.push(json?.error?.message ?? `Không upload được ảnh ${i + 1}.`);
        continue;
      }
      const media = json.data?.media;
      if (media?.status === "REJECTED") {
        errors.push(media.rejectReason ?? `Ảnh ${i + 1} không đạt chất lượng.`);
      } else {
        uploaded.push({ url: json.data?.url ?? media?.url, status: media?.status });
      }
    }

    if (uploaded.length) {
      setExistingImages((prev) => [...prev, ...uploaded]);
    }
    setPendingFiles([]);

    if (errors.length) {
      throw new Error(errors.join(" "));
    }
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) {
      setPendingFiles((prev) => [...prev, ...picked]);
    }
    e.target.value = "";
  }

  function buildPayload(status: "DRAFT" | "ACTIVE") {
    const priceNum = parsePrice(price);
    if (!priceNum) throw new Error("Giá không hợp lệ.");
    if (!district.trim()) throw new Error("Vui lòng nhập quận/huyện.");
    if (status === "ACTIVE" && (description.trim().length < LISTING_GATE_HINT.minDescLen)) {
      throw new Error(
        `Mô tả cần tối thiểu ${LISTING_GATE_HINT.minDescLen} ký tự để đăng hiển thị.`,
      );
    }
    const areaNum = area.trim() ? Number(area.replace(",", ".")) : undefined;
    return {
      transactionType,
      propertyType,
      price: priceNum,
      ...(areaNum && areaNum > 0 ? { area: areaNum } : {}),
      province: province.trim(),
      district: district.trim(),
      ward: ward.trim() || undefined,
      address: address.trim() || undefined,
      description: description.trim() || undefined,
      status,
    };
  }

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const payload = buildPayload("DRAFT");
      if (savedId) {
        const res = await fetch(`/api/listings/${savedId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Không lưu được.");
        await uploadPendingFiles(savedId);
        setSuccess("Đã lưu nháp.");
        setExistingStatus(json.data?.status ?? "DRAFT");
      } else {
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Không tạo được tin.");
        const id = json.data?.id as string;
        const code = json.data?.code as string;
        setSavedId(id);
        setExistingCode(code);
        setExistingStatus("DRAFT");
        await uploadPendingFiles(id);
        setSuccess(`Đã tạo tin nháp ${code}.`);
        router.replace(`/moi-gioi/dang-tin/${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu tin.");
    } finally {
      setSaving(false);
    }
  }

  async function submitForReview() {
    if (!savedId) {
      setError("Lưu nháp trước khi gửi duyệt.");
      return;
    }
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const payload = buildPayload("DRAFT");
      await fetch(`/api/listings/${savedId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      await uploadPendingFiles(savedId);
      const res = await fetch(`/api/listings/${savedId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "PENDING_REVIEW" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Không gửi duyệt được.");
      setExistingStatus("PENDING_REVIEW");
      setRejectReason(null);
      setSuccess("Tin đã gửi admin duyệt. Bạn sẽ nhận email khi có kết quả.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi gửi duyệt.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-slate-500">Đang tải tin…</p>;
  }

  return (
    <form onSubmit={saveDraft} className="space-y-6">
      {existingCode ? (
        <p className="text-sm text-slate-600">
          Mã tin: <span className="font-mono font-semibold">{existingCode}</span>
          {" · "}
          Trạng thái:{" "}
          <span className="font-medium">
            {LISTING_STATUS_LABEL[existingStatus] ?? existingStatus}
          </span>
        </p>
      ) : null}

      {rejectReason && existingStatus === "REJECTED" ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <strong>Admin từ chối:</strong> {rejectReason}. Chỉnh sửa tin rồi gửi duyệt lại.
        </p>
      ) : null}

      {existingStatus === "PENDING_REVIEW" ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Tin đang chờ admin duyệt. Bạn có thể sửa nội dung; gửi duyệt lại nếu đã chỉnh.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
          {existingCode && existingStatus === "ACTIVE" ? (
            <>
              {" "}
              <Link href={`/tin-dang/${existingCode}`} className="font-semibold underline">
                Xem tin
              </Link>
            </>
          ) : null}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Loại giao dịch</span>
          <select
            className={inputCls}
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as "SALE" | "RENT")}
          >
            {(["SALE", "RENT"] as const).map((v) => (
              <option key={v} value={v}>
                {TRANSACTION_TYPE_LABEL[v]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Loại hình</span>
          <select
            className={inputCls}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {BROKER_PROPERTY_TYPE_OPTIONS.map((o) => (
              <option key={o.slug} value={propertyTypeFromSlug(o.slug) ?? o.slug}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Giá (VND)</span>
          <input
            className={inputCls}
            inputMode="numeric"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="vd: 2500000000"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Diện tích (m²)</span>
          <input
            className={inputCls}
            inputMode="decimal"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="vd: 65"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Tỉnh / TP</span>
          <select
            className={inputCls}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            {BROKER_LISTING_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Quận / huyện</span>
          <input
            className={inputCls}
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="vd: Quận 7"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Phường / xã</span>
          <input
            className={inputCls}
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Địa chỉ cụ thể</span>
          <input
            className={inputCls}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Mô tả</span>
        <textarea
          className={cn(inputCls, "min-h-[120px] py-3")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Tối thiểu ${LISTING_GATE_HINT.minDescLen} ký tự khi đăng hiển thị.`}
        />
      </label>

      <div className="block text-sm">
        <span className="font-medium text-slate-700">Ảnh bất động sản</span>
        <p className="mt-1 text-xs text-slate-500">
          Upload JPG/PNG/WebP (tối đa 12 MB/ảnh). Cần ≥ {LISTING_GATE_HINT.minPhotos} ảnh
          đạt chuẩn (cạnh ngắn ≥ 1024px) để đăng hiển thị.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700"
          onChange={onPickFiles}
        />
        {(existingImages.length > 0 || pendingFiles.length > 0) && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {existingImages.map((img) => (
              <li key={img.url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </li>
            ))}
            {pendingFiles.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-dashed border-brand-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-full w-full object-cover opacity-90"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-brand-600/80 px-1 text-[10px] text-white">
                  Mới
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Ảnh được lưu khi bấm &quot;Lưu nháp&quot; hoặc &quot;Gửi duyệt&quot;. Hiện có{" "}
          {existingImages.length} ảnh đã lưu
          {pendingFiles.length > 0 ? ` · ${pendingFiles.length} ảnh chờ upload` : ""}.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu…" : savedId ? "Lưu nháp" : "Tạo tin nháp"}
        </Button>
        {savedId && existingStatus !== "ACTIVE" ? (
          <Button type="button" variant="outline" disabled={saving} onClick={submitForReview}>
            {existingStatus === "PENDING_REVIEW" || existingStatus === "REJECTED"
              ? "Gửi duyệt lại"
              : "Gửi duyệt"}
          </Button>
        ) : null}
        <ButtonLink href="/moi-gioi/tin-cua-toi" variant="outline">
          Tin của tôi
        </ButtonLink>
      </div>
    </form>
  );
}
