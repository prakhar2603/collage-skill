/**
 * Collage kit: the look and the motion of a Vox-style paper-collage video, as building blocks for a HyperFrames
 * composition. Import it from your build.mjs and paste the pieces into the page you generate:
 *
 *   import { CSS, DEFS, HELPERS, FONTS, torn, cut, tag, stamp } from "../kit/collage-kit.mjs";
 *
 *   <head>  ${FONTS}  <style>${CSS}</style>
 *   <body>  ${DEFS}                      (the SVG filters: #cut = B&W photo with cream + red sticker border)
 *   <script> ... ${HELPERS} ...          (sm, enter, pop, drop, draw, count, boil: all seek-safe)
 *
 * Everything animates on one paused GSAP timeline `tl`, registered as window.__timelines["main"].
 */

export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Archivo+Narrow:wght@700&family=Permanent+Marker&display=swap" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`;

export const PALETTE = { paper: "#ECE4D4", cream: "#F4EFE6", ink: "#141210", red: "#D9352B", yellow: "#F2C230", blue: "#2F5BB7", dark: "#1F1D1B" };

/** Torn paper edge as a clip-path. sides: any of "l" "r" "t" "b". Seeded, so every build is identical. */
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
export const torn = (w, h, sides = "ltrb", amp = 14, step = 20) => {
  const pts = [], j = () => (rnd() * amp).toFixed(1);
  for (let x = 0; x <= w; x += step) pts.push(`${x}px ${sides.includes("t") ? j() : 0}px`);
  for (let y = 0; y <= h; y += step) pts.push(`${sides.includes("r") ? (w - j()).toFixed(1) : w}px ${y}px`);
  for (let x = w; x >= 0; x -= step) pts.push(`${x}px ${sides.includes("b") ? (h - j()).toFixed(1) : h}px`);
  for (let y = h; y >= 0; y -= step) pts.push(`${sides.includes("l") ? j() : 0}px ${y}px`);
  return `polygon(${pts.join(",")})`;
};

/** A photo cutout (transparent PNG from tools/lift) with the sticker border. Animate the wrapper #id. */
export const cut = (id, src, x, y, w, extra = "") => `<div class="it" id="${id}" style="left:${x}px; top:${y}px; width:${w}px; ${extra}"><img class="cut" src="${src}" alt="" /></div>`;
/** Label tag. kind: "" (black), "y" (yellow), "r" (red), "w" (cream). Add "sm" for the small size. */
export const tag = (id, text, x, y, kind = "") => `<div class="tag ${kind}" id="${id}" style="left:${x}px; top:${y}px;">${text}</div>`;
/** Postage stamp with a photo crop and a caption. */
export const stamp = (id, src, text, x, y, pos = "50% 50%") => `<div class="stamp" id="${id}" style="left:${x}px; top:${y}px;"><div style="background-image:url(${src}); background-position:${pos};"></div><b>${text}</b></div>`;
/** A torn paper card. Put your own content after it inside the same wrapper. */
export const card = (id, x, y, w, h, inner, bg = "#F4EFE6") => `<div class="sheetw" id="${id}" style="left:${x}px; top:${y}px; width:${w}px; height:${h}px; opacity:0;"><div class="sheet" style="background:${bg}; clip-path:${torn(w, h, "ltrb", 10, 18)};"></div>${inner}</div>`;
/** Big 3D paper-cut title (cream letters, black outline, extruded edge). */
export const title3d = (id, text, x, y, size, extra = "") => `<div class="t3d" id="${id}" style="left:${x}px; top:${y}px; font-size:${size}px; ${extra}">${text}</div>`;

export const CSS = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .scene { position: absolute; inset: 0; overflow: hidden; }
    .it { position: absolute; opacity: 0; }
    .it img, img.cut { display: block; width: 100%; filter: url(#cut); }
    .sheetw { position: absolute; filter: drop-shadow(0 18px 26px rgba(0,0,0,0.35)); }
    .sheet { position: absolute; inset: 0; }
    .serif { font-family: "Playfair Display", serif; font-weight: 900; color: #141210; letter-spacing: -0.01em; }
    .tag { position: absolute; padding: 9px 16px 8px; background: #141210; color: #F4EFE6; font-family: "Archivo Narrow", sans-serif; font-weight: 700; font-size: 30px; text-transform: uppercase; white-space: nowrap; opacity: 0; }
    .tag.y { background: #F2C230; color: #141210; } .tag.r { background: #D9352B; } .tag.w { background: #F4EFE6; color: #141210; }
    .tag.sm { font-size: 22px; padding: 6px 12px 5px; }
    .sign { position: absolute; padding: 14px 26px 10px; background: #141210; color: #F4EFE6; border: 5px solid #F4EFE6; outline: 3px solid #141210; font-family: "Archivo Narrow", sans-serif; font-weight: 700; font-size: 48px; opacity: 0; }
    .t3d { position: absolute; font-family: "Playfair Display", serif; font-weight: 900; color: #F4EFE6; -webkit-text-stroke: 9px #141210; paint-order: stroke fill; opacity: 0; white-space: nowrap; line-height: 1.1;
           text-shadow: ${Array.from({ length: 14 }, (_, i) => `${i + 1}px ${i + 1}px 0 #141210`).join(", ")}, 22px 26px 26px rgba(0,0,0,0.38); }
    .stamp { position: absolute; width: 190px; height: 230px; padding: 14px; background: #F4EFE6; opacity: 0;
             -webkit-mask: radial-gradient(circle 7px at 50% 50%, transparent 98%, #000) -7px -7px / 20px 20px, linear-gradient(#000,#000) 10px 10px / calc(100% - 20px) calc(100% - 20px) no-repeat;
             filter: drop-shadow(0 8px 10px rgba(0,0,0,0.3)); }
    .stamp div { width: 100%; height: 160px; background-size: cover; filter: grayscale(1) contrast(1.2) sepia(0.25); }
    .stamp b { display: block; margin-top: 8px; font-family: "Archivo Narrow", sans-serif; font-size: 22px; color: #B8322A; text-align: center; }
    .news { position: absolute; height: 120px; padding: 12px 18px; background: #E9E3D3; font-family: "Playfair Display", serif; font-weight: 700; font-size: 19px; line-height: 1.3; color: #2A2622; opacity: 0; overflow: hidden; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.18)); }
    .mk { fill: none; stroke: #D9352B; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
    .paint { position: absolute; font-family: "Permanent Marker", cursive; opacity: 0; }
    /* halftone print: a blurred grey photo under a dot screen, thresholded by a huge contrast */
    .ht { position: absolute; overflow: hidden; background: #fff; filter: contrast(22); }
    .ht img { display: block; width: 100%; filter: grayscale(1) contrast(1.5) brightness(0.88) blur(1.2px); }
    .ht:after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, #000 0%, #3a3a3a 50%, #b0b0b0 100%) 0 0 / 8px 8px; mix-blend-mode: screen; }
    #grain { position: absolute; inset: -60px; pointer-events: none; mix-blend-mode: multiply; opacity: 0.55;
             background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.33  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
    #vig { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 60%, rgba(40,25,10,0.28) 100%); }`;

/** SVG filter defs. #cut: greyscale, more contrast, cream border, red outline, soft shadow. */
export const DEFS = `<svg width="0" height="0" style="position:absolute">
    <filter id="cut" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g" />
      <feComponentTransfer in="g" result="bw"><feFuncR type="linear" slope="1.3" intercept="-0.08" /><feFuncG type="linear" slope="1.3" intercept="-0.08" /><feFuncB type="linear" slope="1.22" intercept="-0.1" /></feComponentTransfer>
      <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="a1" />
      <feMorphology in="SourceAlpha" operator="dilate" radius="12" result="a2" />
      <feFlood flood-color="#F4EFE6" result="w" /><feComposite in="w" in2="a1" operator="in" result="wb" />
      <feFlood flood-color="#D9352B" result="r" /><feComposite in="r" in2="a2" operator="in" result="rb" />
      <feGaussianBlur in="a2" stdDeviation="9" result="sb" /><feOffset in="sb" dy="12" result="so" />
      <feFlood flood-color="#000" flood-opacity="0.38" /><feComposite in2="so" operator="in" result="sh" />
      <feMerge><feMergeNode in="sh" /><feMergeNode in="rb" /><feMergeNode in="wb" /><feMergeNode in="bw" /></feMerge>
    </filter>
  </svg>`;

/**
 * Timeline helpers. Paste inside your <script> AFTER `const tl = gsap.timeline({ paused: true });`.
 * `boil(DUR)` must be called once: it gives every cutout, tag and stamp a 12fps hand-made jitter and moves the grain.
 */
export const HELPERS = `
    // stop-motion: hold each pose for 1/12s
    const sm = (base, d) => { const e = gsap.parseEase(base), n = Math.max(1, Math.round(d * 12)); return (p) => e(p >= 1 ? 1 : Math.floor(p * n) / n); };
    // slide/drop a piece in from an offset: enter("#train", 0.2, { x: -900, rotation: -8 })
    const enter = (sel, at, from, d, base) => { d = d || 0.42; tl.fromTo(sel, Object.assign({ opacity: 1 }, from), { opacity: 1, x: 0, y: 0, rotation: (from && from.end) || 0, scale: 1, duration: d, ease: sm(base || "back.out(1.4)", d), immediateRender: false }, at); };
    const pop = (sel, at, r) => tl.fromTo(sel, { opacity: 0, scale: 0.6, rotation: r || 0 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.25, ease: sm("back.out(2.4)", 0.25), immediateRender: false }, at);
    // slam: for big titles and stamps landing hard
    const slam = (sel, at, rot) => tl.fromTo(sel, { opacity: 0, scale: 2, rotation: (rot || 0) + 8 }, { opacity: 1, scale: 1, rotation: rot || 0, duration: 0.2, ease: "power4.in", immediateRender: false }, at);
    // hand-drawn marker: draw("#circle1", 3.2, 0.35) on a <path class="mk">
    const draw = (sel, at, d) => { const el = document.querySelector(sel); const L = el.getTotalLength(); tl.fromTo(sel, { strokeDasharray: L, strokeDashoffset: L, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, duration: d, ease: "power1.inOut", immediateRender: false }, at); };
    const count = (sel, from, to, at, d) => { const o = { n: from }; tl.fromTo(o, { n: from }, { n: to, duration: d, ease: "power2.out", immediateRender: false, onUpdate: () => { document.querySelector(sel).textContent = Math.round(o.n); } }, at); };
    // a torn sheet sliding over the previous scene: sheetIn("#s2w", 4.05, "x", 2040)
    const sheetIn = (sel, at, axis, from) => tl.fromTo(sel, { [axis]: from }, { [axis]: 0, immediateRender: true, duration: 0.42, ease: "power3.inOut" }, at);
    // dive into a point until it fills the frame: dive("#zoomLayer", 7.0, 1.6, [eyeX, eyeY], 60, [W, H])
    const dive = (sel, at, d, pt, scale, frame) => tl.fromTo(sel, { scale: 1, x: 0, y: 0 }, { scale: scale, x: frame[0] / 2 - pt[0], y: frame[1] / 2 - pt[1], transformOrigin: pt[0] + "px " + pt[1] + "px", duration: d, ease: "expo.in", immediateRender: false }, at);
    const boil = (DUR) => {
      const bits = Array.from(document.querySelectorAll(".cut, .tag, .sign, .stamp"));
      const h = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x) - 0.5; };
      const c = { t: 0 };
      tl.fromTo(c, { t: 0 }, { t: DUR, duration: DUR, ease: "none", immediateRender: true, onUpdate: () => {
        const k = Math.floor(c.t * 12);
        bits.forEach((el, i) => { el.style.translate = (h(i, k) * 2.2).toFixed(2) + "px " + (h(i + 50, k) * 2.2).toFixed(2) + "px"; el.style.rotate = (h(i + 99, k) * 0.7).toFixed(2) + "deg"; });
        const g = document.getElementById("grain"); if (g) g.style.translate = Math.round(h(1, k) * 60) + "px " + Math.round(h(2, k) * 60) + "px";
      } }, 0);
    };`;
