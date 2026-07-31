import { AFFILIATE_DEAL_TIER_VALUES } from "@/lib/validation/noxh-case";

export type AffiliateDealTier = (typeof AFFILIATE_DEAL_TIER_VALUES)[number];

export const DEAL_TIER_OPTIONS: Array<{
  id: AffiliateDealTier;
  name: string;
  hint: string;
}> = [
  { id: "CONNECTOR", name: "Connector", hint: "Chỉ nối — House X tư vấn chốt" },
  {
    id: "CONSULTANT",
    name: "Consultant",
    hint: "Tư vấn đầu + phối hợp HS",
  },
  {
    id: "DEVELOPER_PARTNER",
    name: "Developer Partner",
    hint: "Đồng hành hồ sơ NOXH",
  },
  {
    id: "MASTER_BROKER",
    name: "Master Broker",
    hint: "A–Z (cần đủ điều kiện)",
  },
];

export const DEAL_TIER_LABEL: Record<string, string> = Object.fromEntries(
  DEAL_TIER_OPTIONS.map((t) => [t.id, t.name]),
);
