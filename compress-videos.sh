#!/bin/bash

# Video Compression Script for Lakshmi Trails
# This script will compress your hero videos for optimal web performance
# Target: <10MB desktop, <5MB mobile for better Core Web Vitals

echo "🎬 Starting video compression for Lakshmi Trails..."
echo "Target sizes: Desktop <10MB, Mobile <5MB"
echo ""

# Create backup directory
mkdir -p public/assets/videos/originals
echo "📁 Created backup directory: public/assets/videos/originals"

# Function to backup and compress
compress_video() {
    local input_file="$1"
    local output_file="$2"
    local crf="$3"
    local max_bitrate="$4"
    local description="$5"
    
    echo "🔄 Compressing $description..."
    echo "   Input: $input_file"
    echo "   Output: $output_file"
    echo "   Quality: CRF $crf, Max bitrate: $max_bitrate"
    
    # Backup original if not already backed up
    backup_file="public/assets/videos/originals/$(basename "$input_file")"
    if [ ! -f "$backup_file" ]; then
        cp "$input_file" "$backup_file"
        echo "   ✅ Backed up original to: $backup_file"
    fi
    
    # Compress with ffmpeg
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf "$crf" \
        -maxrate "$max_bitrate" \
        -bufsize $((max_bitrate * 2)) \
        -c:a aac \
        -b:a 96k \
        -ac 2 \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -preset medium \
        -y "$output_file"
    
    if [ $? -eq 0 ]; then
        old_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
        new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
        
        if [ -n "$old_size" ] && [ -n "$new_size" ]; then
            old_mb=$((old_size / 1024 / 1024))
            new_mb=$((new_size / 1024 / 1024))
            savings=$(((old_size - new_size) * 100 / old_size))
            echo "   ✅ Compressed: ${old_mb}MB → ${new_mb}MB (${savings}% reduction)"
        else
            echo "   ✅ Compression completed"
        fi
        
        # Replace original with compressed version
        mv "$output_file" "$input_file"
        echo "   📦 Replaced original with compressed version"
    else
        echo "   ❌ Compression failed"
        return 1
    fi
    echo ""
}

# Compress desktop videos (target: ~8-9MB)
compress_video \
    "public/assets/videos/lakshmi-trails-hero.mp4" \
    "public/assets/videos/lakshmi-trails-hero-compressed.mp4" \
    "28" \
    "2000k" \
    "Desktop MP4 (1920x1080)"

compress_video \
    "public/assets/videos/lakshmi-trails-hero.webm" \
    "public/assets/videos/lakshmi-trails-hero-compressed.webm" \
    "30" \
    "1800k" \
    "Desktop WebM (1920x1080)"

# Compress mobile videos (target: ~3-4MB)  
compress_video \
    "public/assets/videos/lakshmi-trails-hero-720p.mp4" \
    "public/assets/videos/lakshmi-trails-hero-720p-compressed.mp4" \
    "30" \
    "1200k" \
    "Mobile MP4 (1280x720)"

compress_video \
    "public/assets/videos/lakshmi-trails-hero-720p.webm" \
    "public/assets/videos/lakshmi-trails-hero-720p-compressed.webm" \
    "32" \
    "1000k" \
    "Mobile WebM (1280x720)"

echo "🎉 Video compression complete!"
echo ""
echo "📊 Summary:"
echo "   - Original videos backed up to public/assets/videos/originals/"
echo "   - Compressed videos should be significantly smaller"
echo "   - Desktop videos target: <10MB each"
echo "   - Mobile videos target: <5MB each"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the videos on your site to ensure quality is acceptable"
echo "   2. If quality is too low, re-run with lower CRF values (e.g., 26 instead of 28)"
echo "   3. If files are still too large, increase CRF values (e.g., 30 instead of 28)"
echo "   4. Commit the changes: git add . && git commit -m 'Optimize video files for web performance'"
echo ""
echo "💡 CRF Scale: Lower = Better Quality/Larger Size, Higher = Lower Quality/Smaller Size"
echo "   - CRF 23-28: High quality (recommended for hero videos)"
echo "   - CRF 28-32: Good quality, smaller files"
echo "   - CRF 32-35: Lower quality, very small files"