# @angusthenontechnical — TikTok context for Reflector POC

Source profile: https://www.tiktok.com/@angusthenontechnical

Extracted with local `tools/tiktok/tiktok-extractor` (yt-dlp + faster-whisper `base`). Zero paid APIs.

Pulled: latest **5** public VOD clips (deduped by title from flat playlist).

## Index

| # | Video ID | Title | Duration (s) | Transcript chars | Paths |
|---|----------|-------|--------------|------------------|-------|
| 1 | [7686905063905758477](https://www.tiktok.com/@angusthenontechnical/video/7686905063905758477) | Bit of a risky intro on this one  #ai #buildwithai #vibecoding  | 74 | 1730 | `7686905063905758477/summary.md`, `7686905063905758477/transcript.txt`; raw under `raw/7686905063905758477/` |
| 2 | [7686607531833134349](https://www.tiktok.com/@angusthenontechnical/video/7686607531833134349) | What could go wrong with this idea?  #ai #buildwithai #vibecoding #lo... | 61 | 1300 | `7686607531833134349/summary.md`, `7686607531833134349/transcript.txt`; raw under `raw/7686607531833134349/` |
| 3 | [7686595189573553421](https://www.tiktok.com/@angusthenontechnical/video/7686595189573553421) | for sponsoring this post. Would highly recommend you try their api.  ... | 79 | 1691 | `7686595189573553421/summary.md`, `7686595189573553421/transcript.txt`; raw under `raw/7686595189573553421/` |
| 4 | [7686594812442594573](https://www.tiktok.com/@angusthenontechnical/video/7686594812442594573) | Much appreciation for Fish Audio for sponsoring this post. Would high... | 77 | 1666 | `7686594812442594573/summary.md`, `7686594812442594573/transcript.txt`; raw under `raw/7686594812442594573/` |
| 5 | [7686237088764792078](https://www.tiktok.com/@angusthenontechnical/video/7686237088764792078) | Roy Lee is genuinely hilarious - even if he faked a bunch of investor... | 66 | 1523 | `7686237088764792078/summary.md`, `7686237088764792078/transcript.txt`; raw under `raw/7686237088764792078/` |

## URLs

- https://www.tiktok.com/@angusthenontechnical/video/7686905063905758477
- https://www.tiktok.com/@angusthenontechnical/video/7686607531833134349
- https://www.tiktok.com/@angusthenontechnical/video/7686595189573553421
- https://www.tiktok.com/@angusthenontechnical/video/7686594812442594573
- https://www.tiktok.com/@angusthenontechnical/video/7686237088764792078

## Layout

```
angusthenontechnical/
├── INDEX.md
├── 7686905063905758477/
│   ├── summary.md      # AI-ready consolidated report
│   ├── transcript.txt
│   ├── transcript.srt
│   └── metadata.json
├── 7686607531833134349/
│   ├── summary.md      # AI-ready consolidated report
│   ├── transcript.txt
│   ├── transcript.srt
│   └── metadata.json
├── 7686595189573553421/
│   ├── summary.md      # AI-ready consolidated report
│   ├── transcript.txt
│   ├── transcript.srt
│   └── metadata.json
├── 7686594812442594573/
│   ├── summary.md      # AI-ready consolidated report
│   ├── transcript.txt
│   ├── transcript.srt
│   └── metadata.json
├── 7686237088764792078/
│   ├── summary.md      # AI-ready consolidated report
│   ├── transcript.txt
│   ├── transcript.srt
│   └── metadata.json
└── raw/<id>/           # also includes video.mp4 + audio.wav
```

## Notes

- Profile listing via `yt-dlp --flat-playlist` succeeded (impersonation warning only; no bot wall).
- TikTok returned near-duplicate entries per post; kept unique titles (first ID of each pair).
- Frames/OCR not run (`--frames` skipped) — transcript + metadata only.
- Large binaries (`video.mp4`, `audio.wav`) live only under `raw/` to keep context browsing light.

