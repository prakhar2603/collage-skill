// Flat Vox-style map (yellow land, blue sea, black borders) as an SVG, from Natural Earth (public domain) via world-atlas.
//   node map.mjs <lonMin> <latMin> <lonMax> <latMax> <W> <H> <out.svg> [highlightCountry] [Name=lon,lat ...]
//   Prints the pixel position of every pin as JSON, e.g.  node map.mjs 58 6 100 35 1920 1080 assets/map.svg India Mumbai=72.877,19.076
import { readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath, geoBounds, geoArea } from "d3-geo";
import { feature, mesh } from "topojson-client";
const [lo0, la0, lo1, la1, W, H, out, hi, ...pins] = process.argv.slice(2);
const topo = JSON.parse(readFileSync(new URL("./node_modules/world-atlas/countries-10m.json", import.meta.url)));
const land = feature(topo, topo.objects.countries);
const box = { type: "MultiPoint", coordinates: [[+lo0, +la0], [+lo1, +la1]] };
const proj = geoMercator().fitExtent([[0, 0], [+W, +H]], box);
const path = geoPath(proj).digits(1);
const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
// some Natural Earth shapes come wound inside-out (e.g. Maldives at 10m); flip them or they fill the whole sea
const fix = (poly) => geoArea({ type: "Polygon", coordinates: poly }) > 2 * Math.PI ? poly.map(r => r.slice().reverse()) : poly;
for (const f of land.features) { const g = f.geometry; if (!g) continue; g.coordinates = g.type === "Polygon" ? fix(g.coordinates) : g.coordinates.map(fix); }
const pad = 25;
const near = land.features.filter(f => { const [[a, b], [c, d]] = geoBounds(f); return !(c < +lo0 - pad || a > +lo1 + pad || d < +la0 - pad || b > +la1 + pad) && f.properties.name !== "Antarctica"; });
const hiF = near.filter(f => f.properties.name === hi);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#2F5BB7"/>
${near.map(f => `<path class="cs" d="${path(f)}" fill="${f.properties.name === hi ? "#F7CF3C" : "#F2C230"}" stroke="#1A1A1A" stroke-width="1.8" stroke-linejoin="round"/>`).join("")}

</svg>`;
writeFileSync(out, svg);
const p = (lon, lat) => proj([lon, lat]).map(v => +v.toFixed(1));
console.log(JSON.stringify(Object.fromEntries(pins.map(x => { const [n, c] = x.split("="); const [lon, lat] = c.split(",").map(Number); return [n, p(lon, lat)]; }))));
