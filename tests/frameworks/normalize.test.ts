import { describe, expect, it } from "vitest";
import {
  normalizeBrandIconClass,
  normalizeLang,
  normalizeUIKitImageSrc,
} from "../../packages/frameworks/shared/normalize";

describe("normalizeUIKitImageSrc", () => {
  it("returns empty for undefined/empty", () => {
    expect(normalizeUIKitImageSrc()).toBe("");
    expect(normalizeUIKitImageSrc("")).toBe("");
  });

  it("preserves already resolved URLs", () => {
    expect(normalizeUIKitImageSrc("https://example.com/img.jpg")).toBe(
      "https://example.com/img.jpg",
    );
    expect(normalizeUIKitImageSrc("/images/photo.png")).toBe(
      "/images/photo.png",
    );
    expect(normalizeUIKitImageSrc("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("prepends slash for relative paths", () => {
    expect(normalizeUIKitImageSrc("photo.jpg")).toBe("/photo.jpg");
    expect(normalizeUIKitImageSrc("images/photo.png")).toBe(
      "/images/photo.png",
    );
  });
});

describe("normalizeBrandIconClass", () => {
  it("returns undefined for no input", () => {
    expect(normalizeBrandIconClass()).toBeUndefined();
    expect(normalizeBrandIconClass("")).toBeUndefined();
  });

  it("preserves iBrand prefix", () => {
    expect(normalizeBrandIconClass("iBrandGithub")).toBe("iBrandGithub");
  });

  it("converts i prefix to iBrand", () => {
    expect(normalizeBrandIconClass("iGithub")).toBe("iBrandGithub");
  });

  it("adds iBrand prefix", () => {
    expect(normalizeBrandIconClass("Github")).toBe("iBrandGithub");
  });
});

describe("normalizeLang", () => {
  it("defaults to text", () => {
    expect(normalizeLang()).toBe("text");
  });

  it("normalizes HTML aliases", () => {
    expect(normalizeLang("html")).toBe("markup");
    expect(normalizeLang("HTML")).toBe("markup");
  });

  it("normalizes JS aliases", () => {
    expect(normalizeLang("js")).toBe("javascript");
    expect(normalizeLang("ts")).toBe("typescript");
    expect(normalizeLang("md")).toBe("markdown");
  });

  it("returns other values as-is", () => {
    expect(normalizeLang("python")).toBe("python");
    expect(normalizeLang("css")).toBe("css");
  });
});
