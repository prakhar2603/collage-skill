---
name: collage
description: Make a Vox-style paper-collage explainer video on any topic. B&W photo cutouts with red sticker borders, torn paper, maps, label tags, marker circles, stop-motion movement, an eye-dive transition. Finds free archive photos, cuts them out, builds the video in HyperFrames and renders an MP4, with an editable timeline in HyperFrames Studio. Use when the user types /collage <topic> or asks for a collage, paper cut-out, Vox-style or documentary-style explainer.
---

# Collage

You are making a 12 to 20 second paper-collage explainer (16:9, 1920x1080, no voice) about the user's topic.
The finished project is an MP4 plus a HyperFrames project the user can open and edit in HyperFrames Studio.

`SKILL_DIR` below means the folder this file is in. Work in a new folder: `./collage-<topic-slug>/`.

## What you need

- Node 20+, ffmpeg, and Google Chrome (HyperFrames renders with it).
- macOS for the best cutouts (`tools/lift.swift` uses the Mac's own "lift subject"). On Windows or Linux, use
  `npx hyperframes remove-background photo.jpg -o cut.png` instead: it is good on people, weak on objects, so
  frame objects as taped photos or stamps there instead of cutting them out.
- Nothing paid. No API keys.

One-time setup (skip what already exists):

```bash
cd SKILL_DIR/tools && npm install            # map data (d3-geo, world-atlas), about 30 MB
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
leave it out. Never invent a statistic, a quote or a date. Write the facts and their source into `FACTS.md`.

### 2. Storyboard: 4 or 5 scenes, about 3.5 seconds each

Write `STORYBOARD.md`. Each scene is one idea and one layout. Use this palette of scene types (mix them):

| Scene | What it is |
| --- | --- |
| **Collage** | An old map or paper ground, 4 to 6 cutouts sliding in from the edges, a red sun, a big 3D title, stamps, newspaper strips, then a torn card with the headline number. Always the opener. |
| **Map** | Flat yellow land on blue sea (`tools/map.mjs`), zoom to a place, pins, black tags, a red dotted route that draws itself. |
| **Eye dive** | A halftone portrait, an eye pasted over the person's eye with a red marker circle, the camera dives into the pupil, and the pupil becomes a round object from the story (a coin, a wheel, a plate, the Moon). The dive lands in the next scene. Use it once, in the middle. |
| **Object + callouts** | One big cutout on a paper sheet with spinning red rings behind it, marker circles and arrows to 2 or 3 tags. A two-line headline beside it with a yellow highlight. |
| **Back in time** | A year counting down to the date, a taped black-and-white photo, a name tag, a card with the closing fact. Good closer. |

Density is the look: every frame should have layers on layers. Movement is the other half: something new enters
at least every 0.4 seconds, and nothing sits still for more than 0.6 seconds.

### 3. Photos

```bash
node SKILL_DIR/tools/photos.mjs search "<words>" --limit 15     # lists size, licence, file title
node SKILL_DIR/tools/photos.mjs get "File:<Title>.jpg" <short>   # saves src/<short>.jpg and appends CREDITS.txt
```

You need about 8: 4 to 6 subjects to cut out (people, vehicles, objects, buildings), 1 old map or texture for
the ground, 1 archive photo to frame, 1 portrait with a visible face for the eye dive, 1 round object for the
pupil. Prefer at least 1500 px wide. Look at every download (make a contact sheet with ffmpeg and read it)
before you use it. `eye.jpg` in `SKILL_DIR/kit/` is a ready eye close-up for the dive.

Only the licences the tool lists are allowed. Keep `CREDITS.txt`; tell the user to paste it in their caption.

### 4. Cut out

```bash
SKILL_DIR/tools/lift src/train.jpg cut/train.png            # every subject in the photo
SKILL_DIR/tools/lift src/crowd.jpg cut/one.png 1            # only subject number 1 (try `list` to count them)
```

Preview each cutout on a red background and look at it. If the tool grabbed the wrong thing, crop the photo
first or pick another photo. Resize cutouts to about 1100 px on the long side (`sips -Z 1100`).

### 5. Build

Copy `SKILL_DIR/examples/dabbawalas/build.mjs` to your folder and rewrite it for your storyboard. It is a
complete, working film: read it before writing anything. `SKILL_DIR/kit/collage-kit.mjs` has the shared CSS,
the `#cut` sticker filter, the torn-paper generator and the timeline helpers (`enter`, `pop`, `slam`, `draw`,
`count`, `sheetIn`, `dive`, `boil`). The rules that keep a HyperFrames render correct:

- One paused GSAP timeline, registered as `window.__timelines["main"]`. No `Math.random()`, no `Date`.
- Set start states with `fromTo` (use `immediateRender: true` for things that must be off-screen at 0). Do not
  put a CSS `transform` on an element GSAP also transforms. Do not tween `left`/`top`. Use absolute values,
  never `"+=..."`.
- Each cutout, tag and card is its own element with its own id, so Studio shows it as its own timeline row.
- Scenes change by a torn sheet sliding over the last one (`sheetIn`), then hide the covered scene.
- Text: serif 900 for headlines and numbers, condensed caps in black or yellow tags for labels. One short line
  per card. Check that nothing wraps.
- Sound: run `sh SKILL_DIR/tools/sfx.sh assets/sfx` once, then add a cue for every entrance in `sfx.json`
  (`[time, name, gain]`): `paper-slide` for slides, `paper-tap` for landings, `paper-flick` for tags,
  `marker` for drawn lines, `riser` under the eye dive. Keep gains between 0.3 and 1.

### 6. Check, then render

```bash
node build.mjs && npx -y hyperframes@0.8.33 lint .
npx -y hyperframes@0.8.33 snapshot . --describe false --no-end --at 0.5,2,3.5,5,7,9,11,13
```

Read the snapshots. Fix anything cropped, overlapping badly, unreadable, or empty. Then:

```bash
npx -y hyperframes@0.8.33 render . --quality high --crf 10 --resolution landscape-4k -o renders/4k.mp4
ffmpeg -y -i renders/4k.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -crf 14 -pix_fmt yuv420p -an renders/video.mp4
node SKILL_DIR/tools/mix.mjs renders/video.mp4 renders/<topic>.mp4 <duration>      # adds the sounds from sfx.json
```

Check for dead spots and fix any hold longer than 0.6 s:

```bash
ffmpeg -i renders/<topic>.mp4 -vf "freezedetect=n=0.002:d=0.6" -map 0:v -f null - 2>&1 | grep freeze
```

### 7. Hand over

Tell the user, in this order: where the MP4 is, the facts used and their source, the photo credits to paste,
and how to edit it:

```bash
npx -y hyperframes@0.8.33 preview .
```

That opens HyperFrames Studio: every cutout, tag and card is a row on the timeline that can be selected, moved
and re-timed, and Export renders a new MP4.

## Honest limits

- Photos come from Wikimedia Commons. If a topic has no free photos (a private company, a recent event), say
  so and suggest a neighbouring topic rather than using photos you cannot credit.
- Real people: use them respectfully, and do not put words in their mouths.
- Music is not included. The video has paper sound effects only; the user adds their own track.
