# 🎬 Video Optimization Guide for Lakshmi Trails

## Current Status
- **Desktop MP4**: 27MB (❌ Too large - target: <10MB)
- **Desktop WebM**: 12MB (⚠️ Close but can be optimized - target: <10MB)
- **Mobile MP4**: 13MB (❌ Too large - target: <5MB)
- **Mobile WebM**: 6.3MB (⚠️ Close but can be optimized - target: <5MB)

## 🎯 Optimization Targets
- **Desktop videos**: <10MB each (ideally 7-9MB)
- **Mobile videos**: <5MB each (ideally 3-4MB)
- **Quality**: Maintain visual quality for hero section

---

## Method 1: Install FFmpeg (Recommended)

### Install FFmpeg on macOS:
```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Or using MacPorts
sudo port install ffmpeg
```

### Run Compression Script:
```bash
./compress-videos.sh
```

---

## Method 2: Online Video Compressors (Easy)

### 🌐 Free Online Tools:
1. **CloudConvert** (https://cloudconvert.com/mp4-converter)
   - Upload your videos
   - Set quality to 85-90%
   - Set max bitrate: 2000kbps (desktop), 1200kbps (mobile)

2. **Compress.com** (https://www.compress.com/compress-video)
   - Drag and drop videos
   - Choose "High Quality" preset
   - Download compressed versions

3. **Online-Convert** (https://video.online-convert.com/compress-mp4)
   - Upload videos
   - Set video bitrate: 2000kbps (desktop), 1200kbps (mobile)
   - Audio bitrate: 128kbps

### Settings for Online Tools:
- **Desktop Videos (1920x1080)**:
  - Video Bitrate: 2000-2500 kbps
  - Audio Bitrate: 128 kbps
  - Frame Rate: Keep original (likely 30fps)

- **Mobile Videos (1280x720)**:
  - Video Bitrate: 1200-1500 kbps
  - Audio Bitrate: 96 kbps
  - Frame Rate: Keep original

---

## Method 3: Video Editing Software

### Adobe Premiere Pro / After Effects:
- Export settings:
  - Format: H.264
  - Preset: YouTube 1080p HD / YouTube 720p HD
  - Bitrate: VBR, 1 pass
  - Target bitrate: 8-10 Mbps (desktop), 5-6 Mbps (mobile)

### DaVinci Resolve (Free):
- Export settings:
  - Codec: H.264
  - Quality: 85-90%
  - Bitrate: 8000 kbps (desktop), 5000 kbps (mobile)

### Handbrake (Free):
- Download: https://handbrake.fr/
- Preset: "Web > Gmail Large 3 Minutes 720p30"
- Custom bitrate: 2000 kbps (desktop), 1200 kbps (mobile)

---

## Method 4: macOS Built-in Compression

### Using Automator:
1. Open **Automator** → New Document → Quick Action
2. Add "Encode Media" action
3. Settings:
   - Setting: Custom
   - Video: H.264, Quality 85%
   - Audio: AAC, 128 kbps
4. Save as "Compress Video"
5. Right-click videos → Quick Actions → Compress Video

---

## 🚀 After Compression

### 1. Replace Files:
Replace the current video files with compressed versions:
- `lakshmi-trails-hero.mp4` (target: ~8MB)
- `lakshmi-trails-hero.webm` (target: ~7MB)
- `lakshmi-trails-hero-720p.mp4` (target: ~4MB)
- `lakshmi-trails-hero-720p.webm` (target: ~3MB)

### 2. Test Quality:
- Preview videos locally to ensure quality is acceptable
- Check they play properly on mobile and desktop
- Verify autoplay functionality works

### 3. Commit Changes:
```bash
git add public/assets/videos/
git commit -m "Optimize hero videos for better Core Web Vitals performance

- Desktop videos: 27MB → ~8MB (70% reduction)
- Mobile videos: 13MB → ~4MB (69% reduction)  
- Maintained visual quality for hero section
- Improved LCP and page load speed"

git push origin main
```

### 4. Monitor Impact:
After deployment, check:
- Core Web Vitals in Google PageSpeed Insights
- Vercel Analytics for load time improvements
- User experience on mobile devices

---

## 💡 Pro Tips

### Quality vs Size Balance:
- **CRF 23-26**: Excellent quality, larger files
- **CRF 28-30**: Good quality, balanced size (recommended)
- **CRF 32-35**: Lower quality, very small files

### Bitrate Guidelines:
- **4K (3840x2160)**: 15-25 Mbps
- **1080p (1920x1080)**: 6-10 Mbps ✅ Your target
- **720p (1280x720)**: 3-6 Mbps ✅ Your target
- **480p (854x480)**: 1-3 Mbps

### Alternative Optimization:
If videos are still too large after compression:
1. **Reduce resolution**: 1920x1080 → 1600x900
2. **Lower frame rate**: 30fps → 24fps
3. **Shorter duration**: Trim to most essential seconds
4. **Consider poster image**: Use high-quality image with play button

---

## 📊 Expected Performance Gains

### Before Optimization:
- **Total video weight**: ~58MB
- **Mobile LCP**: 4-6 seconds
- **Desktop LCP**: 3-4 seconds

### After Optimization:
- **Total video weight**: ~22MB (62% reduction)
- **Mobile LCP**: 2-3 seconds ✅
- **Desktop LCP**: 1.5-2.5 seconds ✅

### Core Web Vitals Impact:
- **LCP (Largest Contentful Paint)**: Significantly improved
- **FCP (First Contentful Paint)**: Faster
- **Speed Index**: Better scores
- **Mobile usability**: Enhanced user experience