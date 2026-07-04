import Link from "next/link";
import {
  getTeamMemberPortraitSrc,
  type EditorialRole,
  type TeamMemberProfile,
} from "@/lib/content/team-editorial-content";
import { cn } from "@/lib/ui/cn";

function TeamMemberPortrait({
  member,
  size = "md",
}: {
  member: TeamMemberProfile;
  size?: "md" | "sm";
}) {
  const src = getTeamMemberPortraitSrc(member);
  const dim = size === "md" ? "h-28 w-24 sm:h-32 sm:w-28" : "h-20 w-20";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm",
        dim,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${member.name} — ${member.role}`}
          className="h-full w-full object-cover object-[center_20%]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white"
          role="img"
          aria-label={`${member.name} — ${member.role}`}
        >
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            {member.initials}
          </span>
        </div>
      )}
    </div>
  );
}

export function TeamMemberCard({ member }: { member: TeamMemberProfile }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-silver-200 bg-white p-5 shadow-sm sm:gap-5">
      <TeamMemberPortrait member={member} />
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
        <p className="text-sm font-semibold text-brand-700">{member.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.bio}</p>
        {member.profileHref ? (
          <a
            href={member.profileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-brand-700 underline"
          >
            {member.profileLabel ?? "Xem hồ sơ"} →
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function EditorialRoleGrid({ roles }: { roles: readonly EditorialRole[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map((r) => (
        <div
          key={r.title}
          className="rounded-xl border border-silver-200 bg-slate-50 p-4"
        >
          <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function ExpertAdvisoryCard({
  name,
  jobTitle,
  bio,
  reviewNote,
}: {
  name: string;
  jobTitle: string;
  bio: string;
  reviewNote?: string;
}) {
  return (
    <article className="rounded-2xl border border-silver-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">{name}</h3>
      <p className="mt-1 text-sm font-medium text-slate-600">{jobTitle}</p>
      {reviewNote && (
        <p className="mt-2 text-xs font-medium text-brand-600">{reviewNote}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{bio}</p>
    </article>
  );
}

export function NumberedSteps({
  steps,
  className,
}: {
  steps: readonly string[];
  className?: string;
}) {
  return (
    <ol className={cn("space-y-3", className)}>
      {steps.map((step, i) => (
        <li
          key={step}
          className="flex gap-4 rounded-xl border border-silver-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {i + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}

export function ContactChannelList({
  channels,
}: {
  channels: readonly {
    title: string;
    desc: string;
    href: string;
    linkLabel: string;
  }[];
}) {
  return (
    <ul className="space-y-4">
      {channels.map((c) => (
        <li
          key={c.title}
          className="rounded-xl border border-silver-200 bg-white p-5"
        >
          <h3 className="font-bold text-slate-900">{c.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.desc}</p>
          <Link
            href={c.href}
            className="mt-2 inline-block text-sm font-semibold text-brand-700 underline"
          >
            {c.linkLabel} →
          </Link>
        </li>
      ))}
    </ul>
  );
}
