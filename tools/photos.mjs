#!/usr/bin/env node
/**
 * Find and download free-to-use photos from Wikimedia Commons, and keep the credits.
 *
 *   node photos.mjs search "dabbawala" [--limit 12]         list candidates: size, licence, title
 *   node photos.mjs get "File:Dabbawala1.jpg" train [--w 1800]   download to src/train.jpg, append to CREDITS.txt
 *
 * Only licences that allow reuse are listed (public domain, CC0, CC BY, CC BY-SA, GODL-India, "No restrictions").
 * CC BY and CC BY-SA need attribution: paste CREDITS.txt into the video description or caption.
 */
import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
const UA = "collage-skill/1.0 (https://github.com; photo research for a personal video)";
const API = "https://commons.wikimedia.org/w/api.php";
const OK = /public domain|cc0|cc by|godl|no restrictions|pdm/i;
const [cmd, a, b, ...rest] = process.argv.slice(2);
const flag = (n, d) => { const i = rest.indexOf("--" + n); return i === -1 ? d : rest[i + 1]; };
const clean = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const api = async (q) => (await fetch(API + "?" + new URLSearchParams({ format: "json", ...q }), { headers: { "User-Agent": UA } })).json();

if (cmd === "search") {
  const lim = flag("limit", b === "--limit" ? rest[0] : "12");
  const j = await api({ action: "query", generator: "search", gsrnamespace: "6", gsrlimit: String(lim), gsrsearch: a, prop: "imageinfo", iiprop: "size|extmetadata", iiextmetadatafilter: "LicenseShortName|Artist" });
  for (const p of Object.values(j.query?.pages || {})) {
    const i = p.imageinfo?.[0]; if (!i || /\.(pdf|djvu|webm|ogv|tif|tiff|svg)$/i.test(p.title)) continue;
    const lic = clean(i.extmetadata?.LicenseShortName?.value);
    if (!OK.test(lic)) continue;
    console.log(`${i.width}x${i.height}  ${lic.padEnd(14)}  ${p.title}`);
  }
} else if (cmd === "get") {
  const w = [b, ...rest].includes("--w") ? flag("w", "1800") : "1800";
  const j = await api({ action: "query", titles: a, prop: "imageinfo", iiprop: "url|extmetadata", iiextmetadatafilter: "LicenseShortName|Artist", iiurlwidth: w });
  const i = Object.values(j.query.pages)[0].imageinfo[0];
  const lic = clean(i.extmetadata?.LicenseShortName?.value), by = clean(i.extmetadata?.Artist?.value).slice(0, 80);
  if (!OK.test(lic)) { console.error("licence does not allow reuse:", lic); process.exit(2); }
  const ext = /\.png$/i.test(a) ? "png" : "jpg";
  mkdirSync("src", { recursive: true });
  const buf = Buffer.from(await (await fetch(i.thumburl || i.url, { headers: { "User-Agent": UA } })).arrayBuffer());
  writeFileSync(`src/${b}.${ext}`, buf);
  appendFileSync("CREDITS.txt", `${b} | ${a} | ${lic} | ${by || "unknown"} | commons.wikimedia.org\n`);
  console.log(`saved src/${b}.${ext} (${(buf.length / 1024) | 0} KB) · ${lic} · ${by}`);
} else {
  console.log('usage: photos.mjs search "<words>" [--limit 12]  |  photos.mjs get "File:Name.jpg" <shortname> [--w 1800]');
}
