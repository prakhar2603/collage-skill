---
name: collage
description: Make a Vox-style paper-collage explainer video on any topic. B&W photo cutouts with red sticker borders, torn paper, maps, label tags, marker circles, stop-motion movement, an eye-dive transition. Finds free archive photos, cuts them out, builds the video in HyperFrames and renders an MP4, with a project that opens in HyperFrames Studio. Use when the user types /collage <topic> or asks for a collage, paper cut-out, Vox-style or documentary-style explainer.
---

# Collage

You are making a 12 to 20 second paper-collage explainer (16:9, 1920x1080, no voice) about the user's topic.
The finished project is an MP4 plus a HyperFrames project the user can open in HyperFrames Studio.

`SKILL_DIR` below means the folder this file is in. Paths often contain spaces: always quote them.
Work in a new folder: `./collage-<topic-slug>/`, laid out like this:

```
collage-<topic>/
  src/            downloads from photos.mjs (originals)
  cut/            raw cutouts from lift
  assets/img/     what the film actually uses (resized cutouts, photos, the eye, the map)
  assets/sfx/     paper sounds from sfx.sh
  build.mjs       writes index.html and sfx.json
  collage-kit.mjs copied from the skill, so the project stands on its own
  FACTS.md  STORYBOARD.md  CREDITS.txt  renders/
```

## What you need

- Node 20+, ffmpeg, Google Chrome (HyperFrames renders with it), and an internet connection (fonts and GSAP
  load from Google Fonts and jsdelivr when the film is built and rendered).
- macOS for the best cutouts (`tools/lift.swift` uses the Mac's own "lift subject"). On Windows or Linux, use
  `npx -y hyperframes@0.8.33 remove-background photo.jpg -o cut.png` instead (it downloads a model the first
  time): it is good on people, weak on objects, so frame objects as taped photos or stamps there instead of
  cutting them out. Shell commands below are POSIX; on Windows run them in Git Bash or WSL.
- Nothing paid. No API keys.

One-time setup (skip what already exists):

```bash
cd "SKILL_DIR/tools" && npm install          # map data, about 9 MB
swiftc -O lift.swift -o lift                 # macOS only, builds the cutout tool
```

## The steps

Do them in order. Tell the user what you found after step 1 and what the scenes are after step 2, then keep
going without waiting unless they asked to approve the plan.

### 1. Facts first

Read the topic's Wikipedia article (the API needs no key):

```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles=<Title>"
```

Pick 5 to 7 facts that are concrete and checkable: a year, a number, a place, a name, how something works.
Every number and name on screen must come from what you read. If a famous claim is disputed in the article,
leave it out. Never invent a statistic, a quote or a date. Write the facts and their source into `FACTS.md`,
and mark anything that did not come from the article (a map coordinate, a date from a photo's title).

### 2. Storyboard: 4 or 5 scenes, about 3.5 seconds each

Write `STORYBOARD.md`. Each scene is one idea and one layout. Use this palette of scene types (mix them):

| Scene | What it is |
| --- | --- |
| **Collage** | An old map or paper ground, 4 to 6 cutouts sliding in from the edges, a red sun, a big 3D title, stamps, newspaper strips, then a torn card with the headline number. Always the opener. |
| **Map** | Flat yellow land on blue sea (`tools/map.mjs`), zoom to a place, pins, black tags, a red dotted route that draws itself. Recipe below. |
| **Eye dive** | A halftone portrait, an eye pasted over the person's eye with a red marker circle, the camera dives into the pupil, and the pupil becomes a round object from the story (a coin, a wheel, a plate, the Moon). The dive lands in the next scene. Use it once, in the middle. |
| **Object + callouts** | One big cutout on a paper sheet with red rings behind it, marker circles and arrows to 2 or 3 tags. A two-line headline beside it with a yellow highlight. |
| **Back in time** | A year counting down to the date, a taped black-and-white photo, a name tag, a card with the closing fact. Good closer. |

Density is the look: every frame should have layers on layers, with no empty half of the frame.
Movement is the other half: something new enters at least every 0.4 seconds, and nothing sits still for more
than 0.6 seconds. Leave every tag and card on screen for at least 1 second so it can be read.

### 3. Photos

```bash
node "SKILL_DIR/tools/photos.mjs" search "<words>" --limit 15     # lists size, licence, file title
node "SKILL_DIR/tools/photos.mjs" get "File:<Title>.jpg" <short>   # saves src/<short>.jpg and appends CREDITS.txt
sh "SKILL_DIR/tools/sheet.sh" src sheet-src.jpg                     # contact sheet: read it before using anything
```

You need about 8: 4 to 6 subjects to cut out (people, vehicles, objects, buildings), 1 old map or texture for
the ground, 1 archive photo to frame, 1 portrait with a visible face for the eye dive, 1 round object for the
pupil. Prefer at least 1500 px wide. The portrait needs mid-tones: a pale, flat or very small face turns into a
white blob in halftone.

Only the licences the tool lists are allowed.

### 4. Cut out

```bash
"SKILL_DIR/tools/lift" src/train.jpg cut/train.png            # every subject in the photo
"SKILL_DIR/tools/lift" src/crowd.jpg cut/one.png 1            # only subject number 1 (pass `list` to count them)
sh "SKILL_DIR/tools/sheet.sh" cut sheet-cut.jpg red            # look at every cutout on red
ffmpeg -y -i cut/train.png -vf "scale='min(1100,iw)':-2" assets/img/train.png     # resize what you keep
```

`lift` says "ok" even when it only got part of the subject (a cart without its wheels, half an animal), so the
red sheet is the real check. If a cutout is wrong, crop the photo first or pick another photo.

### 5. Build

```bash
cp "SKILL_DIR/examples/dabbawalas/build.mjs" build.mjs
cp "SKILL_DIR/kit/collage-kit.mjs" collage-kit.mjs
cp "SKILL_DIR/kit/eye.jpg" assets/img/eye.jpg
sh "SKILL_DIR/tools/sfx.sh" assets/sfx
```

In your copy of `build.mjs`, change the import to `"./collage-kit.mjs"`, then rewrite it for your storyboard.
The example is a complete, working film: read all of it before writing anything. The kit has the shared CSS, the
`#cut` sticker filter, the torn-paper generator and the timeline helpers (`enter`, `pop`, `slam`, `draw`,
`drawRoute`, `count`, `sheetIn`, `dive`, `boil`).

The rules that keep a HyperFrames render correct:

- One paused GSAP timeline, registered as `window.__timelines["main"]`. No `Math.random()`, no `Date`.
- Set start states with `fromTo` (use `immediateRender: true` for things that must be off-screen at 0). Do not
  tween `left`/`top`. Use absolute values, never `"+=..."`. If an element has a CSS `rotate()` for its resting
  angle, pass that same `rotation` in every tween on it, because GSAP replaces the whole transform.
- Give every cutout, tag and card its own id.
- Scenes change by a torn sheet sliding over the last one (`sheetIn`), then hide the covered scene. Make the
  sheet at least 120 px wider than the frame on its torn side, so the torn edge ends up off-screen.
- Text: serif 900 for headlines and numbers, condensed caps in black or yellow tags for labels. One short line
  per card. Check that nothing wraps.
- Sound: add a cue for every entrance in `sfx.json` (`[time, name, gain]`): `paper-slide` for slides,
  `paper-tap` for landings, `paper-flick` for tags, `marker` for drawn lines, `pop` for pins, `whoosh` for
  sheets, `key-press` for counters, `riser` under the eye dive. Gains around 0.3 to 1.

**Eye dive geometry.** `eye.jpg` is 2000 px square; its pupil centre is (967, 967) and the pupil radius is 260
(also exported as `EYE` from the kit). Scale the eye image so the whole eye fits an ellipse about 240 x 160,
centre the pupil on the portrait's eye, put the round object in a circle the size of the pupil, and scale the
whole layer by about 60 with `expo.in` so the pupil fills the frame. If the halftone portrait comes out too
white, set `style="--ht-b:0.6"` on the `.ht` element (lower is darker) and check a snapshot.

**Map scene recipe.**

```bash
node "SKILL_DIR/tools/map.mjs" 58 6 100 35 1920 1080 assets/map.svg Mumbai=72.877,19.076 Pune=73.856,18.52
# prints {"Mumbai":[749.4,618.1],"Pune":[783,638.3]}: pixel positions for your pins
```

```js
const MAP = readFileSync(new URL("./assets/map.svg", import.meta.url), "utf8").replace("<svg ", '<svg id="mapsvg" ');
// markup: the map in a layer you can zoom, pins and routes in an overlay on top of it
`<div id="mapcam" style="position:absolute; inset:0; transform-origin:${A[0]}px ${A[1]}px;">${MAP}</div>
 <svg width="1920" height="1080" style="position:absolute; inset:0; overflow:visible;">${route("r1", `M ${A[0]} ${A[1]} Q ${mx} ${my} ${B[0]} ${B[1]}`)}</svg>
 ${pin("pA", A[0], A[1])} ${tag("tA", "Mumbai", A[0] + 24, A[1] - 60)}`
// timeline
pop("#pA", 4.6); pop("#tA", 4.7, -3); drawRoute("r1", 5.0, 0.7);
```

The map has no country borders by default, on purpose: the border data shows disputed regions (Kashmir, for
one) in ways that are wrong or illegal to publish in some countries, India included. Only pass `--borders` if
you have checked the result for where the user will post. If you zoom the map layer, compute where each pin
lands after the zoom (`origin + (point - origin) * scale + shift`) and place the overlay there.

### 6. Check, then render

```bash
node build.mjs && npx -y hyperframes@0.8.33 lint .
npx -y hyperframes@0.8.33 snapshot . --describe false --no-end --at <two times per scene, plus one inside each transition>
```

Zero lint errors is the bar. Two warnings are normal and fine: `duplicate_media_discovery_risk` and
`composition_file_too_large`. Read the snapshots. Fix anything cropped, overlapping badly, unreadable, washed
out, or empty. Then:

```bash
npx -y hyperframes@0.8.33 render . --quality high --crf 14 -o renders/video.mp4          # 1080p, about 1 to 2 minutes
node "SKILL_DIR/tools/mix.mjs" renders/video.mp4 renders/<topic>.mp4 <duration>            # adds the sounds from sfx.json
```

For a sharper master, render at 4K and scale down (3 to 6 minutes, a 500 MB temporary file):
`--resolution landscape-4k -o renders/4k.mp4`, then
`ffmpeg -y -i renders/4k.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -crf 18 -pix_fmt yuv420p -an renders/video.mp4`.

Check for dead spots and fix any hold longer than 0.6 s (the paper grain moves on every frame, so the looser
threshold is needed to see through it):

```bash
ffmpeg -i renders/<topic>.mp4 -vf "freezedetect=n=0.01:d=0.6" -map 0:v -f null - 2>&1 | grep freeze
```

### 7. Hand over

First tidy `CREDITS.txt`: delete the lines for photos the film does not use, fix any cut-off author names, and
add these two lines if you used them:

```
eye | File:Iris of the Human Eye.jpg | CC BY-SA 3.0 | Mcorrens | commons.wikimedia.org
map | Natural Earth via world-atlas | Public domain | naturalearthdata.com
```

Then tell the user, in this order: where the MP4 is, the facts used and their source, the photo credits to
paste into their caption, and how to open the project:

```bash
npx -y hyperframes@0.8.33 preview .
```

That opens HyperFrames Studio. Describe it accurately: they can scrub the film, see each photo cutout as a
layer on the timeline, click any element on the canvas to select and change it, ask an agent for changes, and
export a new MP4. Timing lives in `build.mjs`; for bigger changes they ask you to edit it and rebuild.

## Honest limits

- Photos come from Wikimedia Commons. If a topic has no free photos (a private company, a recent event), say
  so and suggest a neighbouring topic rather than using photos you cannot credit.
- Real people: use them respectfully, and do not put words in their mouths.
- Maps: borderless by default (see above). Never draw a national border from memory.
- Music is not included. The video has paper sound effects only; the user adds their own track.
