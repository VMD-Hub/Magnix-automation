/**
 * Legal Channel Pack — route canon KB to 3 delivery channels.
 * @see docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLegalRetrievalPack } from './legal-retrieval-pack.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const CHANNEL_REGISTRY = join(REPO_ROOT, 'legal-sources', 'channels', 'registry.json');

const VALID_CHANNELS = new Set(['aio_seo', 'inbox_counseling', 'staff_ops']);

function loadChannelRegistry() {
  if (!existsSync(CHANNEL_REGISTRY)) return { channels: {} };
  return JSON.parse(readFileSync(CHANNEL_REGISTRY, 'utf8'));
}

/**
 * @param {string} channelId — aio_seo | inbox_counseling | staff_ops
 */
export function getChannelConfig(channelId) {
  if (!VALID_CHANNELS.has(channelId)) {
    throw new Error(`INVALID_CHANNEL: ${channelId}`);
  }
  const reg = loadChannelRegistry();
  const ch = reg.channels?.[channelId];
  if (!ch) throw new Error(`CHANNEL_NOT_IN_REGISTRY: ${channelId}`);
  return ch;
}

/**
 * @param {string} channelId
 * @param {object} [opts]
 * @param {string} [opts.topic]
 * @param {string} [opts.province_code]
 * @param {string} [opts.query] — natural language → topic via buildPackFromQuery
 * @param {number} [opts.max_facts]
 */
export function buildChannelPack(channelId, opts = {}) {
  const channel = getChannelConfig(channelId);
  const topic =
    opts.topic ||
    (channel.retrieval_topics?.includes('noxh_documents') ? 'noxh_documents' : channel.retrieval_topics?.[0]) ||
    'noxh_eligibility';

  const legalPack = opts.query
    ? null
    : buildLegalRetrievalPack({
        topic,
        province_code: opts.province_code || null,
        as_of: opts.as_of,
        max_facts: opts.max_facts ?? (channelId === 'aio_seo' ? 7 : 10),
      });

  const entry_points = {
    aio_seo: {
      start_here: channel.playbook_path,
      qa_files: channel.primary_assets?.filter((p) => p.includes('qa-knowledge')) || [],
      article_structure: 'H2/H3 câu hỏi · short_answer đầu bài · FAQ cluster',
    },
    inbox_counseling: {
      start_here: channel.playbook_path,
      topic_index: 'legal-sources/noxh/counseling-topic-index.md',
      intake_schema: channel.intake_schema,
      intake_order_doc: 'legal-sources/noxh/counseling-topic-index.md',
    },
    staff_ops: {
      start_here: channel.playbook_path,
      topic_index: 'legal-sources/noxh/counseling-topic-index.md',
      handwriting_guide: 'legal-sources/noxh/mau-01-handwriting-sample-guide.md',
      sample_form: 'legal-sources/noxh/samples/mau-01-sample-filled-reference.md',
      dossier_checklist: 'legal-sources/noxh/application-dossier-checklist.md',
    },
  };

  return {
    schema: 'legal_channel_pack_v1',
    channel_id: channelId,
    channel_label: channel.label,
    audience: channel.audience,
    playbook_path: channel.playbook_path,
    architecture_doc: 'docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md',
    entry_points: entry_points[channelId] || {},
    primary_assets: channel.primary_assets || [],
    product_types: channel.product_types || [],
    agent_prompts: channel.agent_prompts || [],
    subagent: channel.subagent || null,
    qa_tiers: channel.qa_tiers || [],
    intake_schema: channel.intake_schema || null,
    output_rules: channel.output_rules || [],
    disclaimer_required: channel.disclaimer_required !== false,
    pii_in_output: false,
    legal_retrieval_pack: legalPack,
    retrieval_topic: topic,
  };
}

export function listChannels() {
  const reg = loadChannelRegistry();
  return Object.values(reg.channels || {}).map((c) => ({
    channel_id: c.channel_id,
    label: c.label,
    playbook_path: c.playbook_path,
  }));
}
