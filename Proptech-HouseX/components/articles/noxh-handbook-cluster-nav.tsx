import Link from "next/link";
import { topicPath } from "@/lib/content/article-routes";
import {
  NOXH_HANDBOOK_PILLAR_CLUSTERS,
  NOXH_HANDBOOK_SECONDARY_CLUSTERS,
} from "@/lib/content/articles/noxh-handbook-tags";

export function NoxhHandbookClusterNav() {
  return (
    <section className="mb-10" aria-label="Chủ đề cẩm nang NOXH">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NOXH_HANDBOOK_PILLAR_CLUSTERS.map((cluster) => (
          <Link
            key={cluster.slug}
            href={topicPath(cluster.slug)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-800">
              {cluster.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {cluster.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-brand-700">
              Xem bài viết →
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {NOXH_HANDBOOK_SECONDARY_CLUSTERS.map((cluster) => (
          <Link
            key={cluster.slug}
            href={topicPath(cluster.slug)}
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-brand-700"
          >
            {cluster.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
