import type { Metadata } from "next";
import { getVertical } from "@/lib/content/affiliate-verticals";
import { NHA_DEP_PATH } from "@/lib/content/noi-that-content";
import { NhaDepInspirationHub } from "@/components/affiliate/nha-dep-inspiration-hub";

const vertical = getVertical("noi-that");

export const metadata: Metadata = {
  title: "Nhà đẹp — Ý tưởng bố trí nội thất | House X",
  description:
    "Bảng cảm hứng nhà đẹp TP.HCM: phòng khách, bếp, phòng ngủ, decor theo phong cách hiện đại, Scandinavian, Indochine, minimal.",
  alternates: { canonical: NHA_DEP_PATH },
};

export default function NhaDepPage() {
  return <NhaDepInspirationHub vertical={vertical} />;
}
