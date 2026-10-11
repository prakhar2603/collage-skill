// Flat Vox-style map (yellow land, blue sea, black coastline) as an SVG, from Natural Earth (public domain).
//
//   node map.mjs <lonMin> <latMin> <lonMax> <latMax> <W> <H> <out.svg> [Name=lon,lat ...] [--borders] [--highlight Country]
//
//   Prints the pixel position of every pin as JSON, e.g.
//   node map.mjs 58 6 100 35 1920 1080 assets/map.svg Mumbai=72.877,19.076 Pune=73.856,18.52
//
// By default the map has NO country borders: land, sea and coastline only. That is deliberate. Natural Earth
// draws de facto borders, which show disputed regions (Kashmir, for one) in ways that are wrong or illegal to
// publish in some countries, India included. Pass --borders (and --highlight) only if you have checked that the
// borders it draws are right for where the video will be posted.
import { readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath, geoBounds, geoArea } from "d3-geo";
import { feature } from "topojson-client";

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(n); if (i === -1) return null; const v = argv[i + 1]; argv.splice(i, n === "--borders" ? 1 : 2); return n === "--borders" ? true : v; };
const borders = flag("--borders"), hi = flag("--highlight");
const [lo0, la0, lo1, la1, W, H, out, ...pins] = argv;
if (!out) { console.error("usage: map.mjs <lonMin> <latMin> <lonMax> <latMax> <W> <H> <out.svg> [Name=lon,lat ...] [--borders] [--highlight Country]"); process.exit(1); }

const load = (f) => JSON.parse(readFileSync(new URL(`./node_modules/world-atlas/${f}`, import.meta.url)));
const proj = geoMercator().fitExtent([[0, 0], [+W, +H]], { type: "MultiPoint", coordinates: [[+lo0, +la0], [+lo1, +la1]] });
const path = geoPath(proj).digits(1);
// some Natural Earth shapes come wound inside-out (they would fill the whole sea); flip them
const fix = (poly) => geoArea({ type: "Polygon", coordinates: poly }) > 2 * Math.PI ? poly.map(r => r.slice().reverse()) : poly;
const pad = 25;
// a shape whose bounds wrap the antimeridian (a > c) is continent-sized: keep it
const near = (g) => { const [[a, b], [c, d]] = geoBounds(g); if (a > c) return true; return !(c < +lo0 - pad || a > +lo1 + pad || d < +la0 - pad || b > +la1 + pad); };

let shapes = "";
if (borders) {
  const topo = load("countries-10m.json");
  for (const f of feature(topo, topo.objects.countries).features) {
    const g = f.geometry; if (!g || f.properties.name === "Antarctica") continue;
    g.coordinates = g.type === "Polygon" ? fix(g.coordinates) : g.coordinates.map(fix);
    if (!near(f)) continue;
    shapes += `<path class="cs" d="${path(f)}" fill="${f.properties.name === hi ? "#F6EBC8" : "#F2C230"}" stroke="#1A1A1A" stroke-width="1.8" stroke-linejoin="round"/>`;
  }
} else {
  const topo = load("land-10m.json");
  const g = feature(topo, topo.objects.land).features[0].geometry;
  const polys = (g.type === "Polygon" ? [g.coordinates] : g.coordinates).map(fix).filter(p => near({ type: "Polygon", coordinates: p }));
  shapes = `<path class="cs" d="${path({ type: "MultiPolygon", coordinates: polys })}" fill="#F2C230" stroke="#1A1A1A" stroke-width="1.8" stroke-linejoin="round"/>`;
}
writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#2F5BB7"/>
${shapes}
</svg>`);
const p = (lon, lat) => proj([lon, lat]).map(v => +v.toFixed(1));
console.log(JSON.stringify(Object.fromEntries(pins.map(x => { const [n, c] = x.split("="); const [lon, lat] = c.split(",").map(Number); return [n, p(lon, lat)]; }))));
