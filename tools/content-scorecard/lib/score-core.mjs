/**
 * Core scoring logic — shared by score.mjs CLI and n8n Code node (bundled at build).
 */

export function tierForMetric(value, spec) {
  if (value == null || Number.isNaN(value)) return "unknown";
  const lowerBetter = spec.lower_is_better === true;
  if (lowerBetter) {
    if (value <= spec.scale) return "scale";
    if (value <= spec.good) return "good";
    if (value <= spec.average) return "average";
    return "poor";
  }
  if (value >= spec.scale) return "scale";
  if (value >= spec.good) return "good";
  if (value >= spec.average) return "average";
  return "poor";
}

export const TIER_SCORE = { scale: 100, good: 80, average: 55, poor: 25, unknown: 0 };

export function computeIvi(metrics) {
  const reach = metrics.reach || metrics.views || 0;
  if (!reach) return null;
  const keywordComments = metrics.keyword_comments || 0;
  const dmOptIn = metrics.dm_opt_in || 0;
  const formSubmit = metrics.form_submit || 0;
  return (keywordComments + dmOptIn + formSubmit) / reach;
}

export function primaryRetentionMetric(platform, metrics, platformMetrics) {
  const priority = {
    tiktok: ["completion_rate", "early_swipe_away_3s"],
    fb_reels: ["completion_rate", "retention_50pct", "retention_3s"],
    fb_page: ["video_avg_watch_pct"],
    youtube_shorts: ["viewed_not_swiped", "apv"],
  };
  const keys = priority[platform] || Object.keys(platformMetrics);
  for (const key of keys) {
    if (metrics[key] != null && platformMetrics[key]) {
      return { key, value: metrics[key], spec: platformMetrics[key] };
    }
  }
  return null;
}

export function buildRecommendations(platform, scored, retentionTier, iviTier, primary) {
  const recs = [];

  if (retentionTier === "poor" || retentionTier === "average") {
    recs.push({
      priority: "high",
      area: "hook_pacing",
      action:
        "Re-cut first 3s: pain text on-screen + cut intro; add pattern interrupt every 3-5s",
    });
  }

  if (primary?.key === "early_swipe_away_3s" || primary?.key === "swipe_away_3s") {
    if (primary.value > 0.35) {
      recs.push({
        priority: "high",
        area: "first_frame",
        action: "First frame must show payoff preview, not logo or greeting",
      });
    }
  }

  if (iviTier === "poor" || iviTier === "average") {
    recs.push({
      priority: "high",
      area: "cta",
      action:
        "Add comment keyword CTA (CHECKLIST/NOXH/DTI) + pin comment with opt-in instruction",
    });
  }

  if (platform === "fb_reels") {
    recs.push({
      priority: "medium",
      area: "utis_fit",
      action:
        "Keep mood/style consistent with Page; avoid generic BDS clips that mismatch audience interest",
    });
  }

  if (scored.save_rate?.tier === "poor" || scored.save_rate?.tier === "average") {
    recs.push({
      priority: "medium",
      area: "save_framing",
      action: "Explicit save CTA: checklist/table worth saving before applying",
    });
  }

  if (recs.length === 0) {
    recs.push({
      priority: "low",
      area: "scale",
      action: "Repurpose to Hub with lead magnet; A/B 2 hooks for next batch",
    });
  }

  return recs;
}

export function scorePrePublish(input, platform, SIGNALS) {
  const rubric = SIGNALS.pre_publish_rubric;
  const platformSpec = SIGNALS.platforms[platform];
  if (!platformSpec) throw new Error(`Unknown platform: ${platform}`);

  const scores = input.scores || {};
  const required = rubric.items.map((item) => item.id);
  const missing = required.filter((id) => scores[id] == null);
  if (missing.length) {
    throw new Error(`Missing rubric scores for: ${missing.join(", ")}. Each 0-10.`);
  }

  let weighted = 0;
  const breakdown = rubric.items.map((item) => {
    const raw = Math.max(0, Math.min(10, Number(scores[item.id])));
    const normalized = (raw / item.max_score) * 100;
    const contribution = normalized * item.weight;
    weighted += contribution;
    return {
      id: item.id,
      name: item.name,
      score: raw,
      normalized: Math.round(normalized),
      weight: item.weight,
      contribution: Math.round(contribution * 10) / 10,
    };
  });

  const total = Math.round(weighted);
  let action = "kill";
  if (total >= rubric.publish_threshold) action = "publish";
  else if (total >= rubric.fix_threshold) action = "fix_before_publish";

  const duration = input.duration_sec;
  let lengthCheck = null;
  if (duration != null && platformSpec.optimal_duration_sec) {
    const { min, max, ideal } = platformSpec.optimal_duration_sec;
    const inRange = duration >= min && duration <= max;
    lengthCheck = {
      duration_sec: duration,
      optimal: { min, max, ideal },
      in_range: inRange,
      note: inRange
        ? duration === ideal
          ? "ideal_length"
          : "acceptable_length"
        : duration < min
          ? "too_short_for_platform"
          : "too_long_risk_retention_drop",
    };
  }

  return {
    mode: "pre_publish",
    platform,
    platform_role: platformSpec.role,
    total_score: total,
    action,
    thresholds: {
      publish: rubric.publish_threshold,
      fix: rubric.fix_threshold,
    },
    breakdown,
    length_check: lengthCheck,
    segment: input.segment || null,
    post_id: input.post_id || null,
  };
}

export function scorePostPublish(input, platform, SIGNALS) {
  const platformSpec = SIGNALS.platforms[platform];
  if (!platformSpec) throw new Error(`Unknown platform: ${platform}`);

  const metrics = { ...input.metrics };
  const computedIvi = computeIvi(metrics);
  if (computedIvi != null && metrics.ivi == null) {
    metrics.ivi = computedIvi;
  }

  const platformMetrics = platformSpec.metrics;
  const scored = {};
  let weightedSum = 0;
  let weightTotal = 0;

  for (const [key, spec] of Object.entries(platformMetrics)) {
    const value = metrics[key];
    if (value == null) continue;
    const tier = tierForMetric(value, spec);
    const points = TIER_SCORE[tier] * spec.weight;
    weightedSum += points;
    weightTotal += spec.weight;
    scored[key] = {
      value,
      tier,
      weight: spec.weight,
      benchmarks: {
        poor: spec.poor,
        average: spec.average,
        good: spec.good,
        scale: spec.scale,
        lower_is_better: spec.lower_is_better || false,
      },
    };
  }

  const performanceScore =
    weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;

  const primary = primaryRetentionMetric(platform, metrics, platformMetrics);
  const retentionTier = primary
    ? tierForMetric(primary.value, primary.spec)
    : "unknown";
  const iviTier =
    metrics.ivi != null
      ? tierForMetric(
          metrics.ivi,
          platformMetrics.ivi || SIGNALS.platforms.tiktok.metrics.ivi
        )
      : "unknown";

  const warmLeadRate = metrics.warm_lead_rate ?? null;
  const rules = SIGNALS.verdict_rules;

  let verdict = "review";
  const verdictReason = [];

  if (retentionTier === "poor" || retentionTier === "unknown") {
    verdict = "kill";
    verdictReason.push("retention_below_average");
  } else if (
    (retentionTier === "good" || retentionTier === "scale") &&
    (iviTier === "poor" || iviTier === "average" || iviTier === "unknown")
  ) {
    verdict = "fix";
    verdictReason.push("retention_ok_ivi_low_fix_cta");
  } else if (
    (retentionTier === "good" || retentionTier === "scale") &&
    (iviTier === "good" || iviTier === "scale")
  ) {
    if (warmLeadRate != null && warmLeadRate >= rules.scale.warm_lead_rate_min) {
      verdict = "scale";
      verdictReason.push("retention_and_ivi_good_warm_leads_ok");
    } else if (warmLeadRate == null) {
      verdict = "scale";
      verdictReason.push("retention_and_ivi_good_no_warm_lead_data");
    } else {
      verdict = "fix";
      verdictReason.push("ivi_ok_but_warm_lead_rate_low");
    }
  }

  if (
    verdict === "scale" &&
    platformSpec.role === "spoke_discovery" &&
    (retentionTier === "scale" || retentionTier === "good") &&
    (iviTier === "good" || iviTier === "scale")
  ) {
    verdict = "hub_candidate";
    verdictReason.push("spoke_winner_repurpose_to_hub");
  }

  const recommendations = buildRecommendations(
    platform,
    scored,
    retentionTier,
    iviTier,
    primary
  );

  return {
    mode: "post_publish",
    platform,
    platform_role: platformSpec.role,
    performance_score: performanceScore,
    ivi: computedIvi != null ? Math.round(computedIvi * 10000) / 10000 : null,
    ivi_pct: computedIvi != null ? Math.round(computedIvi * 10000) / 100 : null,
    primary_retention: primary
      ? { metric: primary.key, value: primary.value, tier: retentionTier }
      : null,
    ivi_tier: iviTier,
    warm_lead_rate: warmLeadRate,
    verdict,
    verdict_reason: verdictReason,
    metrics_scored: scored,
    recommendations,
    post_id: input.post_id || null,
    segment: input.segment || null,
    analyzed_at: new Date().toISOString(),
  };
}
