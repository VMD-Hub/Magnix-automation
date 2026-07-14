type Props = {
  title: string;
  benefit: string;
  imageUrl?: string | null;
  gradient?: string;
  cta?: string;
  onClick: () => void;
};

export function LanePickCard({
  title,
  benefit,
  imageUrl,
  gradient = "var(--hx-ruby-gradient)",
  cta = "Bắt đầu →",
  onClick,
}: Props) {
  return (
    <button type="button" className="lane-pick-card" onClick={onClick}>
      <div
        className="lane-pick-card-media"
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(26, 18, 20, 0.15) 0%, rgba(26, 18, 20, 0.88) 100%), url(${imageUrl})`,
              }
            : { background: gradient }
        }
      />
      <div className="lane-pick-card-body">
        <span className="lane-pick-card-title">{title}</span>
        <p className="lane-pick-card-benefit">{benefit}</p>
        <span className="lane-pick-card-cta">{cta}</span>
      </div>
    </button>
  );
}
