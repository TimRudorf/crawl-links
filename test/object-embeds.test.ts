import { describe, it, expect } from "vitest";
import type { Root, Element } from "hast";
import { VFile } from "vfile";
import type { BuildCtx } from "@quartz-community/types";
import type { FullSlug } from "@quartz-community/utils";
import { CrawlLinks } from "../src/transformer";

function resolveObject(data: string, fileSlug: string, allSlugs: string[]): Element {
  const object: Element = {
    type: "element",
    tagName: "object",
    properties: { data, type: "image/svg+xml" },
    children: [],
  };
  const tree: Root = { type: "root", children: [object] };
  const plugins = CrawlLinks({ markdownLinkResolution: "shortest" }).htmlPlugins!({
    allSlugs,
  } as unknown as BuildCtx);
  const transformer = (plugins[0] as () => (tree: Root, file: VFile) => void)();
  const file = new VFile();
  file.data.slug = fileSlug as FullSlug;
  transformer(tree, file);
  return tree.children[0] as Element;
}

describe("object embeds (SVG)", () => {
  const allSlugs = ["index", "notes/page", "diagrams/overview.svg"];

  it("resolves a bare SVG filename in a subfolder via shortest path", () => {
    expect(resolveObject("overview.svg", "index", allSlugs).properties.data).toBe(
      "./diagrams/overview.svg",
    );
  });

  it("resolves relative to the embedding page", () => {
    expect(resolveObject("overview.svg", "notes/page", allSlugs).properties.data).toBe(
      "../diagrams/overview.svg",
    );
  });

  it("leaves absolute URLs untouched", () => {
    const url = "https://example.com/a.svg";
    expect(resolveObject(url, "index", allSlugs).properties.data).toBe(url);
  });
});
