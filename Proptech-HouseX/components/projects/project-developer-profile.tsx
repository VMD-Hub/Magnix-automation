import type { ProjectLandingDeveloperProfile } from "@/lib/content/project-landing";

type Props = {
  profile: ProjectLandingDeveloperProfile;
};

export function ProjectDeveloperProfile({ profile }: Props) {
  const sourceLabel = profile.sourceLabel?.trim() || "Xem hồ sơ công bố";

  return (
    <section
      id="project-developer-profile"
      aria-labelledby="project-developer-profile-heading"
      className="lux-detail-panel p-6 sm:p-8"
    >
      <h2
        id="project-developer-profile-heading"
        className="lux-heading-accent text-2xl font-bold"
      >
        {profile.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-[#555555]">
        {profile.summary}
      </p>

      {profile.facts.length > 0 && (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {profile.facts.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {f.label}
              </dt>
              <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-900">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {profile.note && (
        <p className="mt-5 rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-amber-950">
          {profile.note}
        </p>
      )}

      {profile.sourceUrl && (
        <p className="mt-4 text-sm text-slate-500">
          <a
            href={profile.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            {sourceLabel}
          </a>
        </p>
      )}
    </section>
  );
}
