/**
 * Read-only audit for local listing uploads.
 *
 * Compares files under public/uploads/listings with local-upload URLs stored in
 * Postgres listing_media. It never deletes or moves files.
 *
 * Usage:
 *   npm run media:audit-orphans
 *   npm run media:audit-orphans -- --format json --output ./reports/media.json
 */
import { PrismaClient } from "@prisma/client";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

type OutputFormat = "text" | "json";

interface Options {
  format: OutputFormat;
  output?: string;
  uploadsDir: string;
}

interface AuditReport {
  generatedAt: string;
  uploadsDir: string;
  readOnly: true;
  counts: {
    diskFiles: number;
    databaseRows: number;
    localDatabaseUrls: number;
    externalDatabaseUrls: number;
    orphanFiles: number;
    missingReferencedFiles: number;
  };
  orphanFiles: string[];
  missingReferencedFiles: string[];
}

const prisma = new PrismaClient();
const URL_PREFIX = "/uploads/listings/";

function parseOptions(argv: string[]): Options {
  let format: OutputFormat = "text";
  let output: string | undefined;
  let uploadsDir = path.join(process.cwd(), "public", "uploads", "listings");

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--format") {
      const value = argv[++i];
      if (value !== "text" && value !== "json") {
        throw new Error("--format must be text or json");
      }
      format = value;
    } else if (current === "--output") {
      output = argv[++i];
      if (!output) throw new Error("--output requires a path");
    } else if (current === "--uploads-dir") {
      const value = argv[++i];
      if (!value) throw new Error("--uploads-dir requires a path");
      uploadsDir = path.resolve(value);
    } else if (current === "--help" || current === "-h") {
      console.log(
        "Usage: npm run media:audit-orphans -- [--format text|json] [--output PATH] [--uploads-dir PATH]",
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${current}`);
    }
  }

  return { format, output, uploadsDir: path.resolve(uploadsDir) };
}

async function listFiles(root: string, relative = ""): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(path.join(root, relative), { withFileTypes: true });
  } catch (error) {
    if (
      relative === "" &&
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }

  const files: string[] = [];
  for (const entry of entries) {
    const child = relative ? path.join(relative, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, child)));
    } else if (entry.isFile()) {
      files.push(child.split(path.sep).join("/"));
    }
  }
  return files;
}

function localPathFromUrl(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  let pathname: string;
  try {
    pathname = new URL(rawUrl, "https://housex.invalid").pathname;
    pathname = decodeURIComponent(pathname).replace(/\\/g, "/");
  } catch {
    return null;
  }

  const normalized = path.posix.normalize(pathname);
  if (!normalized.startsWith(URL_PREFIX)) return null;

  const relative = normalized.slice(URL_PREFIX.length);
  if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative)) {
    return null;
  }
  return relative;
}

function renderText(report: AuditReport): string {
  const lines = [
    "House X listing media orphan audit (READ-ONLY)",
    `Generated: ${report.generatedAt}`,
    `Uploads: ${report.uploadsDir}`,
    `Disk files: ${report.counts.diskFiles}`,
    `Database rows: ${report.counts.databaseRows}`,
    `Local database URLs: ${report.counts.localDatabaseUrls}`,
    `External database URLs: ${report.counts.externalDatabaseUrls}`,
    `Orphan files: ${report.counts.orphanFiles}`,
    `Missing referenced files: ${report.counts.missingReferencedFiles}`,
    "",
    "Orphan files (not referenced by listing_media):",
    ...report.orphanFiles.map((file) => `  ${file}`),
    "",
    "Referenced local files missing from disk:",
    ...report.missingReferencedFiles.map((file) => `  ${file}`),
  ];
  return `${lines.join("\n")}\n`;
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const [diskFiles, databaseMedia] = await Promise.all([
    listFiles(options.uploadsDir),
    prisma.listingMedia.findMany({ select: { url: true } }),
  ]);

  const disk = new Set(diskFiles);
  const referenced = new Set<string>();
  let localDatabaseUrlCount = 0;
  for (const media of databaseMedia) {
    const localPath = localPathFromUrl(media.url);
    if (localPath) {
      localDatabaseUrlCount += 1;
      referenced.add(localPath);
    }
  }

  const orphanFiles = [...disk].filter((file) => !referenced.has(file)).sort();
  const missingReferencedFiles = [...referenced]
    .filter((file) => !disk.has(file))
    .sort();

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    uploadsDir: options.uploadsDir,
    readOnly: true,
    counts: {
      diskFiles: disk.size,
      databaseRows: databaseMedia.length,
      localDatabaseUrls: localDatabaseUrlCount,
      externalDatabaseUrls: databaseMedia.length - localDatabaseUrlCount,
      orphanFiles: orphanFiles.length,
      missingReferencedFiles: missingReferencedFiles.length,
    },
    orphanFiles,
    missingReferencedFiles,
  };

  const rendered =
    options.format === "json"
      ? `${JSON.stringify(report, null, 2)}\n`
      : renderText(report);

  if (options.output) {
    const outputPath = path.resolve(options.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, rendered, { encoding: "utf8", flag: "wx" });
    console.error(`Wrote read-only media audit: ${outputPath}`);
  } else {
    process.stdout.write(rendered);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
