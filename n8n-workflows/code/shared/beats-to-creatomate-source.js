// Shared: beats[] + scene media → Creatomate RenderScript (Agent 7 v2)
// Inlined vào n8n Code node bởi build-content-video-render.mjs

/** Hook to hơn body — tránh cảm giác đều đều nhàm chán */
const HOOK_AUDIO_VOLUME = '130%';
const BODY_AUDIO_VOLUME = '96%';
const BRAND_AUDIO_VOLUME = '108%';
/** Tiếng chuông ngắn — 1 lần đầu outro, volume thấp */
const MAGNIX_BELL_SFX_URL =
  'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const BELL_SFX_VOLUME = '36%';

function isBrandOutroBeat(beat) {
  return String(beat?.role || '').toLowerCase() === 'brand_outro';
}

function hasBrandOutroInBeats(beats) {
  return (beats || []).some((b) => isBrandOutroBeat(b));
}

function animationForIntent(intent, isHook) {
  const base = {
    time: 0,
    duration: isHook ? 0.6 : 0.45,
    easing: 'quadratic-out',
    transition: true,
  };
  const key = String(intent || '').toLowerCase();
  if (key === 'pattern_interrupt' || isHook) {
    return [{ ...base, type: 'scale', start_scale: '115%', end_scale: '100%' }];
  }
  if (key === 'reframe') {
    return [{ ...base, type: 'text-slide', scope: 'split-clip', split: 'line' }];
  }
  if (key === 'checklist_tease') {
    return [{ ...base, type: 'fade', fade: true }];
  }
  if (key === 'cta_soft') {
    return [{ time: 0.2, duration: 0.5, type: 'fade', fade: true }];
  }
  if (key === 'brand_close') {
    return [{ time: 0, duration: 0.7, type: 'fade', fade: true }];
  }
  return [{ ...base, type: 'fade', fade: true }];
}

function segmentAccent(segment) {
  const map = {
    noxh_income: '#2ecc71',
    valuation: '#3498db',
    sme_credit: '#9b59b6',
    general_inbound: '#e67e22',
  };
  return map[String(segment || '').toLowerCase()] || '#3498db';
}

function buildCreatomateSourceFromBeats(opts) {
  const beats = Array.isArray(opts.beats) ? opts.beats : [];
  const durationSec = Number(opts.duration_sec || 30);
  const segment = opts.segment || 'general_inbound';
  const title = String(opts.title || '').slice(0, 80);
  const ctaKeyword = String(opts.cta_keyword || 'CHECKLIST').slice(0, 40);
  const sceneMedia = Array.isArray(opts.sceneMedia) ? opts.sceneMedia : [];
  const accent = segmentAccent(segment);

  const width = 1080;
  const height = 1920;
  const rootElements = [];
  let timelineCursor = 0;

  for (let i = 0; i < beats.length; i += 1) {
    const beat = beats[i] || {};
    const plannedStart = Math.max(0, Number(beat.start_sec) || 0);
    const plannedEnd = Number(beat.end_sec);
    const plannedDur = Math.max(
      0.8,
      (Number.isFinite(plannedEnd) ? plannedEnd : plannedStart + 3) - plannedStart
    );
    const media = sceneMedia[i] || {};
    const audioDur = Number(media.audioDurationSec) || 0;
    const dur = Math.max(plannedDur, audioDur > 0 ? audioDur + 0.2 : 0);
    const start = timelineCursor;
    timelineCursor += dur;
    const isBrandOutro = isBrandOutroBeat(beat);
    const isHook = !isBrandOutro && (i === 0 || String(beat.role || '').toLowerCase() === 'hook');
    const sceneEls = [];

    if (media.videoUrl) {
      sceneEls.push({
        type: 'video',
        source: media.videoUrl,
        track: 1,
        time: 0,
        duration: dur,
        width: '100%',
        height: '100%',
        x: '50%',
        y: '50%',
        fit: 'cover',
      });
    } else {
      sceneEls.push({
        type: 'shape',
        shape: 'rectangle',
        fill_color: beat.visual_spec?.fallback_color || '#0f172a',
        width: '100%',
        height: '100%',
        track: 1,
        time: 0,
        duration: dur,
      });
    }

    sceneEls.push({
      type: 'shape',
      shape: 'rectangle',
      fill_color: isBrandOutro ? 'rgba(0,0,0,0.48)' : 'rgba(0,0,0,0.42)',
      width: '100%',
      height: '38%',
      y: '82%',
      x: '50%',
      track: 2,
      time: 0,
      duration: dur,
    });

    if (isBrandOutro) {
      const bellUrl = String(beat.visual_spec?.bell_sfx_url || MAGNIX_BELL_SFX_URL).trim();
      if (bellUrl) {
        sceneEls.push({
          type: 'audio',
          source: bellUrl,
          track: 6,
          time: 0,
          duration: Math.min(1, dur * 0.18),
          volume: BELL_SFX_VOLUME,
        });
      }
    }

    const onScreen = String(beat.on_screen || '').trim().slice(0, 100)
      || String(beat.spoken || '').trim().slice(0, 80);
    if (onScreen) {
      sceneEls.push({
        type: 'text',
        text: onScreen,
        track: 3,
        time: 0,
        duration: dur,
        width: '92%',
        height: '28%',
        x: '50%',
        y: '82%',
        x_alignment: '50%',
        y_alignment: '50%',
        font_family: 'Inter',
        font_weight: isBrandOutro ? '600' : '700',
        font_size: isHook ? '7.5 vmin' : isBrandOutro ? '5.4 vmin' : '6 vmin',
        line_height: '110%',
        fill_color: '#ffffff',
        stroke_color: '#000000',
        stroke_width: '0.25 vmin',
        animations: animationForIntent(beat.retention_intent, isHook),
      });
    }

    if (isBrandOutro && String(beat.on_screen_tagline || '').trim()) {
      const tagStart = Math.max(0, dur * 0.48);
      sceneEls.push({
        type: 'text',
        text: String(beat.on_screen_tagline).trim().slice(0, 80),
        track: 4,
        time: tagStart,
        duration: Math.max(0.8, dur - tagStart),
        width: '90%',
        x: '50%',
        y: '88%',
        x_alignment: '50%',
        y_alignment: '50%',
        font_family: 'Inter',
        font_weight: '800',
        font_size: '5.5 vmin',
        fill_color: accent,
        stroke_color: '#000000',
        stroke_width: '0.2 vmin',
        animations: [{ time: 0, duration: 0.5, type: 'fade', fade: true }],
      });
      sceneEls.push({
        type: 'text',
        text: 'Magnix',
        track: 5,
        time: tagStart + 0.2,
        duration: Math.max(0.6, dur - tagStart - 0.2),
        width: '40%',
        x: '50%',
        y: '94%',
        x_alignment: '50%',
        y_alignment: '50%',
        font_family: 'Inter',
        font_weight: '800',
        font_size: '4 vmin',
        fill_color: '#e2e8f0',
        animations: [{ time: 0, duration: 0.45, type: 'fade', fade: true }],
      });
    }

    if (isHook && title) {
      sceneEls.push({
        type: 'text',
        text: title.slice(0, 60),
        track: 4,
        time: 0,
        duration: Math.min(2.5, dur),
        width: '88%',
        x: '50%',
        y: '12%',
        x_alignment: '50%',
        y_alignment: '50%',
        font_family: 'Inter',
        font_weight: '800',
        font_size: '5 vmin',
        fill_color: accent,
        animations: [{ time: 0, duration: 0.4, type: 'fade', fade: true }],
      });
    }

    const spoken = String(beat.spoken || '').trim();
    if (media.audioUrl) {
      sceneEls.push({
        type: 'audio',
        source: media.audioUrl,
        track: 5,
        time: 0,
        volume: isHook ? HOOK_AUDIO_VOLUME : isBrandOutro ? BRAND_AUDIO_VOLUME : BODY_AUDIO_VOLUME,
      });
    } else if (spoken && opts.useCreatomateVoice !== false) {
      sceneEls.push({
        type: 'voice',
        track: 5,
        time: 0,
        duration: dur,
        text: spoken.slice(0, 800),
        provider: opts.voiceProvider || 'google',
        voice_id: opts.voiceId || undefined,
      });
    }

    rootElements.push({
      name: `Scene-${i + 1}-${String(beat.role || 'beat')}`,
      type: 'composition',
      track: 1,
      time: start,
      duration: dur,
      elements: sceneEls,
    });
  }

  const lastBeat = beats[beats.length - 1];
  const totalDuration = Math.max(durationSec, timelineCursor + 1.5);
  const ctaStart = Math.max(0, totalDuration - 2.5);
  if (ctaKeyword && ctaStart < totalDuration && !hasBrandOutroInBeats(beats)) {
    rootElements.push({
      type: 'text',
      track: 2,
      time: ctaStart,
      duration: Math.min(2.5, totalDuration - ctaStart),
      text: `COMMENT "${ctaKeyword}" để nhận checklist`,
      width: '90%',
      x: '50%',
      y: '92%',
      x_alignment: '50%',
      font_family: 'Inter',
      font_weight: '700',
      font_size: '5 vmin',
      fill_color: accent,
      animations: [{ time: 0, duration: 0.35, type: 'fade', fade: true }],
    });
  }

  return {
    output_format: 'mp4',
    width,
    height,
    duration: totalDuration,
    frame_rate: 30,
    elements: rootElements,
  };
}

/* eslint-disable no-unused-vars -- stripped when inlined to n8n */
if (typeof globalThis !== 'undefined') {
  globalThis.buildCreatomateSourceFromBeats = buildCreatomateSourceFromBeats;
}
