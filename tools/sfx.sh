#!/bin/sh
# Paper sound effects, synthesised with ffmpeg (no downloads, no licences).   sh sfx.sh <out-dir>
set -e; O="${1:-assets/sfx}"; mkdir -p "$O"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=pink:d=0.42:a=0.9:seed=7" -af "highpass=f=1200,lowpass=f=7500,equalizer=f=3000:t=q:w=1:g=4,afade=t=in:d=0.04,afade=t=out:st=0.12:d=0.3,tremolo=f=22:d=0.5,volume=0.9" -ac 2 -ar 48000 "$O/paper-slide.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=white:d=0.14:a=0.9:seed=3" -af "highpass=f=1800,lowpass=f=9000,afade=t=in:d=0.005,afade=t=out:st=0.02:d=0.12" -ac 2 -ar 48000 "$O/paper-flick.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=brown:d=0.25:a=1:seed=11" -af "lowpass=f=900,highpass=f=60,afade=t=in:d=0.003,afade=t=out:st=0.03:d=0.2,volume=2.2" -ac 2 -ar 48000 "$O/paper-tap.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=pink:d=0.6:a=0.8:seed=5" -af "bandpass=f=3800:w=2500,tremolo=f=9:d=0.9,afade=t=in:d=0.03,afade=t=out:st=0.4:d=0.2,volume=1.3" -ac 2 -ar 48000 "$O/marker.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=pink:d=1.6:a=0.7:seed=9" -f lavfi -i "sine=f=80:d=1.6" -filter_complex "[0:a]bandpass=f=1800:w=1600,volume=0.8[n];[1:a]volume=0.5[s];[n][s]amix=inputs=2,afade=t=in:d=1.4:curve=exp,afade=t=out:st=1.45:d=0.15,aformat=channel_layouts=stereo" -ar 48000 "$O/riser.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=pink:d=0.5:a=0.8:seed=2" -af "bandpass=f=900:w=1400,afade=t=in:d=0.2,afade=t=out:st=0.25:d=0.25,volume=1.2" -ac 2 -ar 48000 "$O/whoosh.wav"
ffmpeg -v error -y -f lavfi -i "sine=f=520:d=0.09" -af "asetrate=48000*1.0,afade=t=in:d=0.004,afade=t=out:st=0.02:d=0.07,volume=0.9" -ac 2 -ar 48000 "$O/pop.wav"
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=white:d=0.035:a=0.8:seed=6" -af "highpass=f=2500,afade=t=out:st=0.005:d=0.03,volume=0.8" -ac 2 -ar 48000 "$O/key-press.wav"
echo "paper-slide paper-flick paper-tap marker riser whoosh pop key-press -> $O"
