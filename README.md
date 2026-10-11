# Collage: Vox-style paper-collage videos with Claude Code

A free skill for Claude Code. Give it a topic and it makes a short paper-collage explainer: black-and-white
photo cutouts with red sticker borders, torn paper, old maps, label tags, marker circles, stop-motion movement
and an eye-dive transition. You get an MP4 and a project you can edit on a timeline.

No paid tools and no API keys. It runs on [HyperFrames](https://github.com/heygen-com/hyperframes)
(open source, Apache-2.0), ffmpeg and photos from Wikimedia Commons.

## Install

In Claude Code, paste this repo's link and say:

```
install this skill
```

Or by hand:

```bash
git clone https://github.com/prakhar2603/collage-skill ~/.claude/skills/collage
cd ~/.claude/skills/collage/tools && npm install
swiftc -O lift.swift -o lift        # macOS only
```

You need Node 20+, ffmpeg and Google Chrome.

## Use

```
/collage Mumbai's dabbawalas
```

Claude reads the Wikipedia article, picks the facts, finds free photos, cuts the subjects out, builds the
scenes, renders the video and tells you where it is. To edit it afterwards:

```bash
npx -y hyperframes@0.8.33 preview .
```

That opens HyperFrames Studio: scrub the film, see each photo cutout as a layer on the timeline, click any
element on the canvas to change it, and export a new MP4.

## What is in here

| Path | What it does |
| --- | --- |
| `SKILL.md` | The instructions Claude follows. |
| `kit/collage-kit.mjs` | The look and the motion: sticker-border filter, torn paper, tags, stamps, 3D titles, halftone, and the timeline helpers. |
| `tools/photos.mjs` | Searches Wikimedia Commons, downloads only reusable licences, writes `CREDITS.txt`. |
| `tools/lift.swift` | Cuts the subject out of a photo with the Mac's built-in "lift subject". |
| `tools/map.mjs` | Flat yellow-and-blue maps from Natural Earth data. No country borders unless you ask for them. |
| `tools/sheet.sh` | Contact sheets, so Claude looks at every photo and cutout before using it. |
| `tools/sfx.sh` | Makes the paper sound effects with ffmpeg. |
| `tools/mix.mjs` | Adds the sounds to the render. |
| `examples/dabbawalas/` | A complete 15-second film to copy from. |

## Good to know

- **Best on a Mac.** The cutout tool is macOS only. On Windows and Linux the skill falls back to a cutout
  model that is good on people and weak on objects, so objects get framed as photos instead.
- **Credits.** Many Commons photos need attribution. Paste the generated `CREDITS.txt` into your caption or
  description.
- **Facts.** The skill takes every number and name from the Wikipedia article and lists them in `FACTS.md`.
  Check them before you post.
- **Maps have no country borders by default.** The border data shows disputed regions in ways that are wrong
  or illegal to publish in some countries, India included.
- **It takes about 15 minutes** from the prompt to a finished video on a recent Mac.
- **Music is not included.** The video comes with paper sound effects; add your own track.

## Licence

MIT for the code in this repo. Photos in `examples/` keep their own licences (see the `CREDITS.txt` there).
The eye photo in `kit/eye.jpg` is "Iris of the Human Eye" by Mcorrens, CC BY-SA 3.0, via Wikimedia Commons.
