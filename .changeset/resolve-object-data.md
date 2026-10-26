---
"@quartz-community/crawl-links": patch
---

Resolve `<object data>` like `src` on other resources. obsidian-flavored-markdown renders SVG embeds (`![[diagram.svg]]`) as `<object type="image/svg+xml">`, whose URL was never resolved, so an SVG in a subfolder or embedded from a note in a subfolder 404'd.
