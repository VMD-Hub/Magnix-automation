import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractYoutubeVideoId,
  isYoutubeShortsUrl,
  isYoutubeUrl,
  toYoutubeEmbedUrl,
  toYoutubeWatchUrl,
} from "../lib/media/youtube";

describe("youtube helpers", () => {
  it("parses Shorts URL used on DTA Happy Home", () => {
    const url = "https://www.youtube.com/shorts/t8Lx4NTnHos";
    assert.equal(isYoutubeUrl(url), true);
    assert.equal(isYoutubeShortsUrl(url), true);
    assert.equal(extractYoutubeVideoId(url), "t8Lx4NTnHos");
    assert.equal(
      toYoutubeEmbedUrl(url),
      "https://www.youtube.com/embed/t8Lx4NTnHos",
    );
    assert.equal(
      toYoutubeWatchUrl(url),
      "https://www.youtube.com/watch?v=t8Lx4NTnHos",
    );
  });

  it("parses watch and youtu.be URLs", () => {
    assert.equal(
      extractYoutubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
      "dQw4w9WgXcQ",
    );
    assert.equal(
      extractYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ"),
      "dQw4w9WgXcQ",
    );
  });
});
