#!/usr/bin/env node
// Add the sound cues from ./sfx.json ([time, name, gain]) to a silent render, at -14 LUFS.
//   node mix.mjs <video.mp4> <out.mp4> <duration-seconds> [music.mp3]
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [video, out, dur, music] = process.argv.slice(2);
if (!video || !out || !dur) { console.error("usage: mix.mjs <video.mp4> <out.mp4> <duration> [music.mp3]"); process.exit(1); }
const DUR = +dur, cues = JSON.parse(readFileSync("sfx.json", "utf8"));
const file = (f) => ["wav", "mp3"].map(e => `assets/sfx/${f}.${e}`).find(existsSync);
const inputs = ["-i", video], parts = [], labels = [];
let n = 1;
if (music) { inputs.push("-stream_loop", "-1", "-i", music); parts.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${DUR},asetpts=PTS-STARTPTS,volume=0.3,afade=t=in:d=0.1,afade=t=out:st=${DUR - 0.8}:d=0.8[m]`); labels.push("[m]"); n++; }
else { inputs.push("-f", "lavfi", "-t", String(DUR), "-i", "anullsrc=r=48000:cl=stereo"); labels.push(`[${n}:a]`); n++; }
cues.forEach(([t, f, g], i) => { const p = file(f); if (!p) return; inputs.push("-i", p); const ms = Math.max(0, Math.round(t * 1000));
  parts.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${(g * 0.4).toFixed(3)},adelay=${ms}|${ms}[s${i}]`); labels.push(`[s${i}]`); n++; });
parts.push(`${labels.join("")}amix=inputs=${labels.length}:duration=first:normalize=0,atrim=0:${DUR},loudnorm=I=-14:TP=-1:LRA=9[a]`);
execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", parts.join(";"), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", String(DUR), "-movflags", "+faststart", out], { stdio: "inherit" });
console.log("mixed", cues.length, "cues ->", out);
