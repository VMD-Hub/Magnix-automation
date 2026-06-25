#!/usr/bin/env node
/**
 * Magnix Content Scorecard — pre-publish rubric + post-publish platform analytics.
 * Usage:
 *   node score.mjs pre --platform tiktok --input brief.json
 *   node score.mjs post --platform tiktok --input metrics.json
 *   echo '{...}' | node score.mjs post --platform fb_reels --stdin
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePrePublish,
  scorePostPublish,
} from "./lib/score-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIGNALS = JSON.parse(
  readFileSync(join(__dirname, "platform-signals.json"), "utf8")
);

function parseArgs(argv) {
  const args = { mode: null, platform: null, input: null, stdin: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "pre" || a === "post") args.mode = a;
    else if (a === "--platform") args.platform = argv[++i];
    else if (a === "--input") args.input = argv[++i];
    else if (a === "--stdin") args.stdin = true;
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function loadInput(args) {
  if (args.stdin) {
    return JSON.parse(readFileSync(0, "utf8"));
  }
  if (!args.input) {
    throw new Error("Missing --input <file.json> or --stdin");
  }
  return JSON.parse(readFileSync(args.input, "utf8"));
}

function printHelp() {
  console.log(`Magnix Content Scorecard v${SIGNALS.version}

Modes:
  pre   Score script/brief before publish (12-item rubric, 0-10 each)
  post  Score analytics after publish (platform benchmarks + IVI + verdict)

Options:
  --platform  tiktok | fb_reels | fb_page | youtube_shorts
  --input     Path to JSON input file
  --stdin     Read JSON from stdin

Docs: docs/PLATFORM_VIRAL_RESEARCH.md
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.mode) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }
  if (!args.platform) {
    console.error("Error: --platform required");
    process.exit(1);
  }

  try {
    const input = loadInput(args);
    const result =
      args.mode === "pre"
        ? scorePrePublish(input, args.platform, SIGNALS)
        : scorePostPublish(input, args.platform, SIGNALS);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
