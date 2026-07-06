import type { PhongThuyVisualVariant } from "@/lib/content/phong-thuy-visual-variants";
import { BuildAgeArt } from "@/components/feng-shui/eastern-art/build-age-art";
import { BaguaCompassArt, LuoPanArt } from "@/components/feng-shui/eastern-art/luo-pan-art";
import { NguHanhArt } from "@/components/feng-shui/eastern-art/ngu-hanh-art";
import { OfficeDeskArt } from "@/components/feng-shui/eastern-art/office-desk-art";

type Props = {
  variant: PhongThuyVisualVariant;
  size?: "card" | "hero";
  className?: string;
  /** Xoay la bàn / bát quái khi hover (ancestor cần `group`). */
  interactive?: boolean;
};

export function PhongThuyVisual({
  variant,
  size = "card",
  className,
  interactive = false,
}: Props) {
  switch (variant) {
    case "bagua-compass":
      return (
        <BaguaCompassArt size={size} className={className} interactive={interactive} />
      );
    case "luo-pan":
      return <LuoPanArt size={size} className={className} interactive={interactive} />;
    case "build-age":
      return <BuildAgeArt size={size} className={className} />;
    case "ngu-hanh":
      return <NguHanhArt size={size} className={className} />;
    case "office-desk":
      return <OfficeDeskArt size={size} className={className} />;
  }
}
