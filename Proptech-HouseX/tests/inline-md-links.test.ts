import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  splitInlineMdLinks,
  stripInlineMdLinks,
} from "../lib/content/inline-md-links.ts";

describe("inline-md-links", () => {
  it("splits readable CTA link", () => {
    const parts = splitInlineMdLinks(
      "Hotline 0826 — [đăng ký ngay](/lien-he).",
    );
    assert.deepEqual(parts, [
      { type: "text", value: "Hotline 0826 — " },
      { type: "link", label: "đăng ký ngay", href: "/lien-he" },
      { type: "text", value: "." },
    ]);
  });

  it("strips markdown for JSON-LD plain text", () => {
    assert.equal(
      stripInlineMdLinks("đăng ký tại [/lien-he](/lien-he)."),
      "đăng ký tại /lien-he.",
    );
    assert.equal(
      stripInlineMdLinks("[Đăng ký ngay](/lien-he)"),
      "Đăng ký ngay",
    );
  });
});
