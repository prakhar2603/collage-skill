#!/usr/bin/env node
/**
 * Example collage: "The Dabbawalas of Mumbai" (16:9, 14.9s, no voice). Copy this file and rewrite it for your topic.
 *   S1  0-3.3    Collage: cutouts build over an 1893 map, red sun, 3D title, stamps, strips, the headline card.
 *   E   3.3-6.7  Eye dive: halftone portrait, a pasted eye, dive into the pupil, the pupil is a tiffin of food.
 *   S3  6.7-10.7 Object + callouts: the tiffin on red rings, marker circles to three tags.
 *   S4  10.7-14.9 Back in time: the year counts down to 1890, a taped photo, name tags, the closing card.
 * Facts (Wikipedia, "Dabbawala"): started 1890 by Mahadeo Havaji Bachche with about 100 men; up to 200,000 boxes a
 * day, 6 days a week; each dabbawala brings two bicycles, a wooden crate and a Gandhi cap; boxes are marked with a
 * colour (starting station), a number (destination station) and marks (building, floor); Harvard Business School
 * case study, 2010. The painted code on the tiffin is illustrative. Photos: see CREDITS.txt.
 *
 *   node build.mjs && npx -y hyperframes@0.8.33 lint .
 */
import { writeFileSync } from "node:fs";
import { CSS, DEFS, HELPERS, FONTS, torn, cut as kitCut } from "../../kit/collage-kit.mjs";

const DUR = 14.9;
const W = 1920, H = 1080;
const IMG = (n) => `assets/img/${n}`;
const f2 = (x) => (+x).toFixed(3);
const cut = (id, src, x, y, w, extra) => kitCut(id, IMG(src), x, y, w, extra);
// newspaper strips: lines from the Wikipedia article (CC BY-SA), set like newsprint
const NEWS = [
  ["The lunchboxes are picked up in the late morning, delivered predominantly using bicycles and railway trains, and returned empty in the afternoon.", 1330, 575, 460, 4],
  ["In 1890, Mahadeo Havaji Bachche started a lunch delivery service in Bombay with about a hundred men.", 360, 240, 420, -5],
  ["A colour-coding system identifies the destination and recipient.", 1010, 30, 440, 3],
];
const XS = [[700, 250], [1440, 600], [380, 980], [1660, 960], [610, 640]];
// eye dive: the halftone portrait, his eye on screen, the pasted eye and its pupil
const FX = 820, FY = 50, FS = 1000 / 1400;
const EYE = [Math.round(FX + 526 * FS), Math.round(FY + 390 * FS)];
const EW = 240, EH = 160, ES = 0.12, PUP = [967 * ES, 967 * ES], PR = 260 * ES, ZS = 60;
const SFX = [];
const sfx = (t, f, g) => { SFX.push([+(+t).toFixed(3), f, g]); return ""; };

const html = `<!doctype html>
<html lang="en" data-resolution="landscape">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
  ${FONTS}
  <style>${CSS}
    html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #1F1D1B; }
    .xm { position: absolute; opacity: 0; }
  </style>
</head>
<body>
  ${DEFS}
  <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
    <div id="stage" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" data-layout-allow-overflow data-layout-allow-overlap data-layout-allow-occlusion>
      <div id="cam" style="position:absolute; inset:0;">

        <!-- ============ S1: Mumbai collage ============ -->
        <div class="scene" id="s1" style="background:#ECE4D4;">
          <img id="s1map" src="${IMG("map1893.jpg")}" style="position:absolute; left:460px; top:-420px; width:1000px; transform: rotate(-90deg); opacity:0.42; mix-blend-mode:multiply; filter: sepia(0.4) contrast(1.1);" alt="" />
          <div id="s1in" style="position:absolute; inset:0;">
            <div id="grid" style="position:absolute; left:20px; top:60px; width:560px; height:420px; background:#F1ECE0; opacity:0; transform: rotate(-4deg);
                 background-image: linear-gradient(rgba(60,90,140,0.28) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(60,90,140,0.28) 1.5px, transparent 1.5px); background-size: 34px 34px; clip-path:${torn(560, 420, "ltrb", 10, 18)};"></div>
            <div id="sun" style="position:absolute; left:730px; top:250px; width:460px; height:460px; border-radius:50%; background:#D9352B; opacity:0;"></div>
            ${NEWS.map(([txt, x, y, w, r], i) => `<div class="news" id="nw${i}" style="left:${x}px; top:${y}px; width:${w}px; transform: rotate(${r}deg); clip-path:${torn(w, 120, "lr", 8, 14)};">${txt}</div>`).join("")}
            ${XS.map(([x, y], i) => `<svg class="xm" id="xm${i}" style="left:${x}px; top:${y}px;" width="40" height="40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#D9352B" stroke-width="5" stroke-linecap="round"/></svg>`).join("")}
            ${cut("c_train", "train1.png", 40, 110, 660)}
            ${cut("c_tif", "tiffin.png", 1500, 60, 250)}
            <div class="stamp" id="st1" style="left:770px; top:96px;"><div style="background-image:url(${IMG("oldstreet.jpg")}); background-position: 40% 50%;"></div><b>BOMBAY</b></div>
            <div class="stamp" id="st2" style="left:1215px; top:150px;"><div style="background-image:url(${IMG("map1895.jpg")}); background-position: 50% 40%;"></div><b>1895</b></div>
            <div id="ttl" class="serif" style="position:absolute; left:0; right:0; top:350px; text-align:center; font-size:178px; line-height:1.1; opacity:0; color:#F4EFE6; -webkit-text-stroke: 9px #141210; paint-order: stroke fill; text-shadow: 1px 1px 0 #141210, 2px 2px 0 #141210, 3px 3px 0 #141210, 4px 4px 0 #141210, 5px 5px 0 #141210, 6px 6px 0 #141210, 7px 7px 0 #141210, 8px 8px 0 #141210, 9px 9px 0 #141210, 10px 10px 0 #141210, 11px 11px 0 #141210, 12px 12px 0 #141210, 13px 13px 0 #141210, 14px 14px 0 #141210, 22px 26px 26px rgba(0,0,0,0.38);">Mumbai</div>
            <div class="tag y" id="ttlT" style="left:812px; top:600px; transform: rotate(-2deg);">Maharashtra, India</div>
            ${cut("c_crate", "d4.png", 90, 540, 540)}
            ${cut("c_cart", "d3.png", 1210, 600, 660)}
            <div class="sign" id="sign" style="left:690px; top:860px; transform: rotate(-4deg);">CHURCHGATE</div>
            <div class="sheetw" id="card1w" style="left:470px; top:640px; width:980px; height:250px; opacity:0;">
              <div class="sheet" style="background:#F4EFE6; clip-path:${torn(980, 250, "ltrb", 10, 18)};"></div>
              <div class="serif" style="position:absolute; left:0; right:0; top:40px; text-align:center; font-size:78px; white-space:nowrap;">200,000 lunches a day.</div>
              <div class="tag y sm" id="c1t" style="left:360px; top:168px;">Up to · 6 days a week</div>
            </div>
          </div>
        </div>

        <!-- ============ E: the eye ============ -->
        <div class="sheetw" id="sEw" style="left:-70px; top:0; width:${W + 70}px; height:${H}px;">
          <div class="sheet" style="clip-path:${torn(W + 70, H, "l", 26, 26)}; overflow:hidden; background: radial-gradient(60% 75% at 62% 40%, #EDE5D3 0%, #CFC5B0 45%, #1A1816 100%);">
            <div id="zE" style="position:absolute; left:70px; top:0; width:${W}px; height:${H}px;">
              <div class="ht" id="faceP" style="left:${FX}px; top:${FY}px; width:${Math.round(1120 * FS)}px; height:${Math.round(1400 * FS)}px; clip-path:${torn(Math.round(1120 * FS), Math.round(1400 * FS), "ltrb", 14, 20)};"><img src="${IMG("face.jpg")}" alt="" /></div>
              <div id="eyeW" style="position:absolute; left:${EYE[0] - EW / 2}px; top:${EYE[1] - EH / 2}px; width:${EW}px; height:${EH}px; opacity:0;">
                <div style="position:absolute; inset:-9px; border-radius:50%; background:#D9352B;"></div>
                <div style="position:absolute; inset:-5px; border-radius:50%; background:#F4EFE6;"></div>
                <div style="position:absolute; inset:0; border-radius:50%; overflow:hidden; background:#000;">
                  <img src="${IMG("eye2.jpg")}" style="position:absolute; width:${2000 * ES}px; left:${EW / 2 - PUP[0]}px; top:${EH / 2 - PUP[1]}px; filter: grayscale(1) contrast(1.35) brightness(1.05);" alt="" />
                  <div id="ptif" style="position:absolute; left:${EW / 2 - PR}px; top:${EH / 2 - PR}px; width:${PR * 2}px; height:${PR * 2}px; border-radius:50%; overflow:hidden; opacity:0;"><img src="${IMG("dabba-top.jpg")}" style="width:100%; display:block;" alt="" /></div>
                </div>
              </div>
              <svg width="${W}" height="${H}" style="position:absolute; inset:0; overflow:visible;"><path class="mk" id="eyeMk" d="M ${EYE[0] - 170} ${EYE[1] + 10} C ${EYE[0] - 175} ${EYE[1] - 130}, ${EYE[0] + 175} ${EYE[1] - 135}, ${EYE[0] + 172} ${EYE[1]} C ${EYE[0] + 170} ${EYE[1] + 130}, ${EYE[0] - 150} ${EYE[1] + 135}, ${EYE[0] - 176} ${EYE[1] - 20}" /></svg>
            </div>
            <div class="serif" id="eName" style="position:absolute; left:180px; top:600px; font-size:100px; line-height:0.95; color:#F4EFE6; opacity:0;">The<br/>dabbawala.</div>
            <div class="tag y" id="tE1" style="left:186px; top:820px;">2 bicycles, a wooden crate, a Gandhi cap</div>
          </div>
        </div>

        <!-- ============ S3: the code ============ -->
        <div class="sheetw" id="s3w" style="left:0; top:-40px; width:${W}px; height:${H + 40}px;">
          <div class="sheet" style="clip-path:${torn(W, H + 40, "t", 24, 26)}; background:#1F1D1B; overflow:hidden;">
            <div class="serif" id="h3a" style="position:absolute; left:90px; top:300px; font-size:110px; color:#F4EFE6; opacity:0;">No apps.</div>
            <div id="h3bw" style="position:absolute; left:90px; top:450px; opacity:0;">
              <div id="h3hl" style="position:absolute; left:-10px; top:38px; height:92px; width:600px; background:#F2C230; transform-origin:0 50%;"></div>
              <div class="serif" style="position:relative; font-size:110px; color:#141210; padding:0 6px;">Just paint.</div>
            </div>
            <div class="sheetw" id="paperw" style="left:640px; top:110px; width:1180px; height:880px; transform: rotate(-1.5deg);">
              <div class="sheet" style="background:#EFE7D6; clip-path:${torn(1180, 880, "ltrb", 12, 20)}; overflow:hidden;"><div id="rings" style="position:absolute; left:-280px; top:-370px; width:1600px; height:1600px; border-radius:50%; background: repeating-radial-gradient(circle at 50% 50%, #D9352B 0 34px, #EFE7D6 34px 68px); opacity:0.9;"></div></div>
            </div>
            <div class="it" id="c_tifB" style="left:780px; top:150px; width:430px;"><img class="cut" src="${IMG("tiffin.png")}" alt="" />
              <div class="paint" id="pc1" style="left:120px; top:330px; font-size:64px; color:#C8332B;">VP</div>
              <div class="paint" id="pc2" style="left:150px; top:500px; font-size:78px; color:#141210;">9</div>
              <div class="paint" id="pc3" style="left:110px; top:640px; font-size:60px; color:#1F6B3A;">E12</div>
            </div>
            <svg width="${W}" height="${H + 40}" style="position:absolute; inset:0; overflow:visible;">
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="m1" d="M 900 520 C 870 470, 1000 445, 1040 490 C 1070 530, 960 560, 905 530" />
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="m2" d="M 935 680 C 900 630, 1015 610, 1030 660 C 1045 705, 960 725, 940 690" />
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="m3" d="M 885 830 C 860 780, 1020 760, 1045 810 C 1065 855, 930 875, 890 840" />
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="a1" d="M 1050 500 C 1120 480, 1170 460, 1230 450" />
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="a2" d="M 1040 670 C 1110 660, 1170 650, 1230 640" />
              <path class="mk" style="stroke:#F2C230; stroke-width:9;" id="a3" d="M 1055 820 C 1120 820, 1170 825, 1230 830" />
            </svg>
            <div class="tag" id="t31" style="left:1240px; top:420px;">Colour = starting station</div>
            <div class="tag" id="t32" style="left:1240px; top:610px;">Number = destination station</div>
            <div class="tag" id="t33" style="left:1240px; top:800px;">Marks = building + floor</div>
          </div>
        </div>

        <!-- ============ S4: 1890 ============ -->
        <div class="sheetw" id="s4w" style="left:-60px; top:0; width:${W + 60}px; height:${H}px;">
          <div class="sheet" style="clip-path:${torn(W + 60, H, "r", 24, 26)}; background:#E6DCC6; overflow:hidden;">
            <img src="${IMG("map1895.jpg")}" style="position:absolute; left:300px; top:-500px; width:1500px; opacity:0.16; mix-blend-mode:multiply; filter:grayscale(1);" alt="" />
            <div class="serif" id="yr" style="position:absolute; left:150px; top:120px; font-size:230px; opacity:0;">2026</div>
            <div class="tag y" id="t41" style="left:156px; top:420px;">Mahadeo Havaji Bachche</div>
            <div class="tag" id="t42" style="left:156px; top:478px;">Starts with about 100 men</div>
            <div id="photo" style="position:absolute; left:860px; top:120px; width:900px; padding:22px 22px 70px; background:#F4EFE6; transform: rotate(3deg); opacity:0; box-shadow: 0 22px 40px rgba(0,0,0,0.3);">
              <div style="width:856px; height:600px; overflow:hidden;"><img id="phimg" src="${IMG("oldstreet.jpg")}" style="width:900px; filter: grayscale(1) contrast(1.15) sepia(0.2);" alt="" /></div>
              <div style="position:absolute; left:22px; bottom:20px; font-family:'Permanent Marker',cursive; font-size:30px; color:#3A3530;">Bombay, 1890s</div>
              <i style="position:absolute; left:-30px; top:-14px; width:160px; height:46px; background:rgba(235,225,190,0.82); transform: rotate(-28deg);"></i>
              <i style="position:absolute; right:-34px; top:-10px; width:160px; height:46px; background:rgba(235,225,190,0.82); transform: rotate(24deg);"></i>
            </div>
            <div class="sheetw" id="card4w" style="left:120px; top:640px; width:820px; height:300px; opacity:0;">
              <div class="sheet" style="background:#F4EFE6; clip-path:${torn(820, 300, "ltrb", 9, 18)};"></div>
              <div class="tag sm" style="left:40px; top:38px; opacity:1;">2010</div>
              <div class="serif" style="position:absolute; left:40px; top:96px; font-size:52px; line-height:1.12; white-space:nowrap;">Harvard Business School<br/>makes them a case study.</div>
              <svg width="700" height="300" style="position:absolute; inset:0; overflow:visible;"><path class="mk" id="m4" d="M 36 262 C 220 250, 470 256, 740 246" /></svg>
            </div>
          </div>
        </div>

      </div>
      <div id="grain"></div>
      <div id="vig"></div>
    </div>
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    ${HELPERS}
    boil(${DUR});

    /* ===== S1 (0 - 4.3): Mumbai collage builds itself ===== */
    tl.fromTo("#cam", { scale: 1.07 }, { scale: 1, transformOrigin: "960px 540px", duration: 2.6, ease: "power2.out", immediateRender: true }, 0);
    tl.fromTo("#s1map", { x: 0 }, { x: -40, duration: 4.4, ease: "none", immediateRender: true }, 0);
    enter("#c_train", 0.05, { x: -900, rotation: -8 }, 0.5); ${sfx(0.05, "paper-slide", 0.9)}
    tl.fromTo("#sun", { opacity: 1, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: sm("back.out(1.6)", 0.4), immediateRender: false }, 0.18); ${sfx(0.18, "paper-flick", 0.5)}
    tl.fromTo("#sun", { rotation: 0 }, { rotation: 0, scale: 1.08, duration: 3.6, ease: "sine.inOut", immediateRender: false }, 0.6);
    enter("#grid", 0.12, { x: -500, rotation: -14, end: -4 }, 0.4);
    ${[0, 1, 2].map(i => `enter("#nw${i}", ${f2(0.55 + i * 0.22)}, { y: ${i % 2 ? 300 : -300}, rotation: ${i % 2 ? 14 : -14}, end: ${[4, -5, 3][i]} }, 0.36);`).join(" ")}
    ${[0, 1, 2].map(i => sfx(0.55 + i * 0.22, "paper-flick", 0.55)).join("")}
    ${[0, 1, 2, 3, 4].map(i => `pop(".xm#xm${i}", ${f2(1.75 + i * 0.07)}, 45);`).join(" ")}${sfx(1.75, "paper-tap", 0.5)}
    pop("#ttl", 0.3, -3); ${sfx(0.3, "paper-tap", 0.9)}
    enter("#c_tif", 0.45, { y: -760, rotation: 30, end: 4 }, 0.42); ${sfx(0.72, "paper-tap", 0.9)}
    pop("#ttlT", 0.62); ${sfx(0.62, "paper-flick", 0.6)}
    enter("#c_crate", 0.75, { y: 760, rotation: 10 }, 0.45); ${sfx(0.75, "paper-slide", 0.8)}
    enter("#c_cart", 1.0, { x: 1000, rotation: 8 }, 0.45); ${sfx(1.0, "paper-slide", 0.8)}
    pop("#st1", 1.3, -18); ${sfx(1.3, "paper-flick", 0.7)}
    pop("#st2", 1.45, 16); ${sfx(1.45, "paper-flick", 0.7)}
    tl.fromTo("#sign", { opacity: 0, y: 260, rotation: -4 }, { opacity: 1, y: 0, rotation: -4, duration: 0.35, ease: sm("back.out(1.8)", 0.35), immediateRender: false }, 1.65); ${sfx(1.65, "paper-tap", 0.9)}
    // make room, then the number lands
    tl.to("#c_crate", { x: -70, rotation: -3, duration: 0.4, ease: sm("power2.inOut", 0.4) }, 2.2);
    tl.to("#c_cart", { x: 70, rotation: 3, duration: 0.4, ease: sm("power2.inOut", 0.4) }, 2.2);
    tl.to("#sign", { y: 260, opacity: 0, duration: 0.3, ease: sm("power2.in", 0.3) }, 2.2);
    tl.to(["#ttl", "#ttlT"], { y: -40, duration: 0.4, ease: sm("power2.inOut", 0.4) }, 2.2);
    tl.fromTo("#card1w", { opacity: 1, y: 420, rotation: 6 }, { opacity: 1, y: 0, rotation: -1.5, duration: 0.45, ease: sm("back.out(1.3)", 0.45), immediateRender: false }, 2.35); ${sfx(2.35, "paper-slide", 1)}
    pop("#c1t", 2.95, 4); ${sfx(2.95, "paper-flick", 0.6)}
    tl.fromTo("#cam", { scale: 1 }, { scale: 1.03, transformOrigin: "960px 760px", duration: 0.65, ease: "power1.in", immediateRender: false }, 2.6);
    tl.to("#cam", { scale: 1, duration: 0.42, ease: "power3.inOut" }, 3.25);

    /* ===== E (3.25 - 6.7): a dabbawala in halftone; an eye gets pasted on; dive into it, the pupil is a tiffin ===== */
    tl.fromTo("#sEw", { x: ${W + 120} }, { x: 0, immediateRender: true, duration: 0.42, ease: "power3.inOut" }, 3.25); ${sfx(3.2, "paper-slide", 1)}${sfx(3.2, "whoosh", 0.22)}
    tl.fromTo("#faceP", { y: 760, rotation: 8 }, { y: 0, rotation: 0, duration: 0.45, ease: sm("back.out(1.3)", 0.45), immediateRender: true }, 3.5); ${sfx(3.65, "paper-tap", 0.9)}
    tl.fromTo("#eName", { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.3, ease: sm("power3.out", 0.3), immediateRender: false }, 3.85); ${sfx(3.85, "paper-slide", 0.7)}
    pop("#tE1", 4.15, -2); ${sfx(4.15, "paper-flick", 0.6)}
    tl.fromTo("#zE", { scale: 1 }, { scale: 1.08, transformOrigin: "${EYE[0]}px ${EYE[1]}px", duration: 1.2, ease: "power1.inOut", immediateRender: true }, 3.95);
    tl.fromTo("#eyeW", { opacity: 1, scale: 0, rotation: -25 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.3, ease: sm("back.out(2.2)", 0.3), immediateRender: false }, 4.5); ${sfx(4.5, "paper-tap", 1)}
    draw("#eyeMk", 4.72, 0.32); ${sfx(4.72, "marker", 0.6)}
    tl.to(["#eName", "#tE1"], { opacity: 0, x: -200, duration: 0.3, ease: "power2.in" }, 5.1);
    tl.to("#eyeMk", { opacity: 0, duration: 0.15 }, 5.15);
    tl.fromTo("#zE", { scale: 1.08, x: 0, y: 0 }, { scale: ${ZS}, x: ${960 - EYE[0]}, y: ${540 - EYE[1]}, transformOrigin: "${EYE[0]}px ${EYE[1]}px", duration: 1.6, ease: "expo.in", immediateRender: false }, 5.15); ${sfx(5.1, "riser", 0.9)}
    tl.to("#eyeW", { rotation: 0, duration: 1.2, ease: "power2.in" }, 5.2);
    tl.fromTo("#ptif", { opacity: 0, rotation: 0 }, { opacity: 1, rotation: 90, duration: 0.6, ease: "power1.in", immediateRender: false }, 5.85);
    tl.to("#ptif", { rotation: 200, duration: 0.9, ease: "none" }, 6.45);
    tl.set("#s1", { opacity: 0 }, 3.75);
    tl.set("#sEw", { opacity: 0 }, 7.2);

    /* ===== S3 (6.9 - 10.9): dark sheet rises, the painted code ===== */
    tl.fromTo("#s3w", { y: ${H + 100} }, { y: 0, immediateRender: true, duration: 0.42, ease: "power3.inOut" }, 6.65); ${sfx(6.6, "paper-slide", 1.1)}${sfx(6.6, "whoosh", 0.22)}
    tl.fromTo("#paperw", { y: 900, rotation: 6 }, { y: 0, rotation: -1.5, duration: 0.45, ease: sm("back.out(1.2)", 0.45), immediateRender: true }, 6.85);
    tl.fromTo("#rings", { scale: 0.2 }, { scale: 1, duration: 0.6, ease: sm("power3.out", 0.6), immediateRender: true }, 6.95);
    tl.fromTo("#rings", { rotation: 0 }, { rotation: 0, scale: 1.25, duration: 3.2, ease: "none", immediateRender: false }, 7.55);
    enter("#c_tifB", 7.05, { y: -900, rotation: -25, end: -2 }, 0.45); ${sfx(7.35, "paper-tap", 1)}
    pop("#h3a", 7.4, -3); ${sfx(7.4, "paper-tap", 0.8)}
    tl.set("#h3bw", { opacity: 1 }, 7.75);
    tl.fromTo("#h3hl", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power2.out", immediateRender: true }, 7.75); ${sfx(7.75, "marker", 0.5)}
    ${[["pc1", "m1", "a1", "t31", 8.1], ["pc2", "m2", "a2", "t32", 8.75], ["pc3", "m3", "a3", "t33", 9.4]].map(([pc, m, a, t, at]) => `
    tl.fromTo("#${pc}", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out", immediateRender: false }, ${f2(at)});
    draw("#${m}", ${f2(at + 0.1)}, 0.32); draw("#${a}", ${f2(at + 0.38)}, 0.2);
    pop("#${t}", ${f2(at + 0.52)}, -2);`).join("")}
    ${[8.1, 8.75, 9.4].map(at => sfx(at, "paper-tap", 0.5) + sfx(at + 0.1, "marker", 0.5) + sfx(at + 0.52, "paper-flick", 0.6)).join("")}
    tl.fromTo("#s3w", { scale: 1 }, { scale: 1.035, transformOrigin: "1000px 600px", duration: 3.6, ease: "power1.inOut", immediateRender: false }, 7.1);

    /* ===== S4 (10.9 - 14.9): back to 1890 ===== */
    tl.fromTo("#s4w", { x: -${W + 140} }, { x: 0, immediateRender: true, duration: 0.42, ease: "power3.inOut" }, 10.65); ${sfx(10.6, "paper-slide", 1.1)}${sfx(10.6, "whoosh", 0.25)}
    tl.set("#s3w", { opacity: 0 }, 11.1);
    tl.set("#yr", { opacity: 1 }, 11);
    count("#yr", 2026, 1890, 11, 0.7); ${[0, 1, 2, 3, 4, 5, 6].map(k => sfx(11 + k * 0.09, "key-press", 0.35)).join("")}
    tl.fromTo("#yr", { scale: 1.12 }, { scale: 1, transformOrigin: "0% 50%", duration: 0.25, ease: "back.out(2)", immediateRender: false }, 11.7); ${sfx(11.7, "paper-tap", 1)}
    tl.fromTo("#photo", { opacity: 1, y: -900, rotation: -12 }, { opacity: 1, y: 0, rotation: 3, duration: 0.45, ease: sm("back.out(1.3)", 0.45), immediateRender: false }, 11.25); ${sfx(11.55, "paper-tap", 0.9)}
    tl.fromTo("#phimg", { x: 0, scale: 1.12 }, { x: -40, scale: 1.0, duration: 3.5, ease: "none", immediateRender: true }, 11.25);
    pop("#t41", 11.95, -2); ${sfx(11.95, "paper-flick", 0.7)}
    pop("#t42", 12.25, 2); ${sfx(12.25, "paper-flick", 0.7)}
    tl.fromTo("#card4w", { opacity: 1, y: 500, rotation: 7 }, { opacity: 1, y: 0, rotation: -2, duration: 0.45, ease: sm("back.out(1.3)", 0.45), immediateRender: false }, 12.8); ${sfx(12.8, "paper-slide", 1)}
    draw("#m4", 13.45, 0.4); ${sfx(13.45, "marker", 0.55)}
    tl.fromTo("#cam", { scale: 1 }, { scale: 1.05, transformOrigin: "700px 600px", duration: 3.6, ease: "power1.inOut", immediateRender: false }, 11.3);

    window.__timelines["main"] = tl;
  </script>
</body>
</html>`;
writeFileSync(new URL("./index.html", import.meta.url), html);
writeFileSync(new URL("./sfx.json", import.meta.url), JSON.stringify(SFX));
console.log("ok", SFX.length, "sound cues");
