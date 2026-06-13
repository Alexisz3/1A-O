"""
Optimiza todas las imágenes en public/images/months/
Crea versiones comprimidas en public/images/months-optimized/
- Covers: max 1200px de ancho, JPEG calidad 80
- Fotos de galería: max 800px de ancho, JPEG calidad 75
- Thumbnails: max 400px de ancho, JPEG calidad 70
Tus originales NO se tocan.
"""
import os
from pathlib import Path
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

SRC = Path("public/images/months")
DST = Path("public/images/months-opt")

COVER_MAX = 1200
PHOTO_MAX = 800
THUMB_MAX = 400

COVER_QUALITY = 80
PHOTO_QUALITY = 75
THUMB_QUALITY = 70

processed = 0
skipped = 0
total_original = 0
total_optimized = 0

for month_dir in sorted(SRC.iterdir()):
    if not month_dir.is_dir():
        continue
    
    out_dir = DST / month_dir.name
    out_dir.mkdir(parents=True, exist_ok=True)
    
    # Also create thumb subfolder
    thumb_dir = out_dir / "thumb"
    thumb_dir.mkdir(exist_ok=True)
    
    for img_file in sorted(month_dir.iterdir()):
        if not img_file.is_file():
            continue
        ext = img_file.suffix.lower()
        if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.heic'):
            continue
        
        try:
            img = Image.open(img_file)
            # Handle EXIF rotation
            img = ImageOps.exif_transpose(img)
            # Convert to RGB (in case of RGBA or palette modes)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            original_size = img_file.stat().st_size
            total_original += original_size
            
            is_cover = img_file.stem.lower() == 'cover'
            max_w = COVER_MAX if is_cover else PHOTO_MAX
            quality = COVER_QUALITY if is_cover else PHOTO_QUALITY
            
            # Resize main version
            w, h = img.size
            if w > max_w:
                ratio = max_w / w
                new_size = (max_w, int(h * ratio))
                img_resized = img.resize(new_size, Image.LANCZOS)
            else:
                img_resized = img.copy()
            
            # Save main optimized version as .jpg
            out_path = out_dir / f"{img_file.stem}.jpg"
            img_resized.save(out_path, "JPEG", quality=quality, optimize=True)
            total_optimized += out_path.stat().st_size
            
            # Save thumbnail version
            thumb_w = THUMB_MAX
            w2, h2 = img.size
            if w2 > thumb_w:
                ratio2 = thumb_w / w2
                thumb_size = (thumb_w, int(h2 * ratio2))
                img_thumb = img.resize(thumb_size, Image.LANCZOS)
            else:
                img_thumb = img.copy()
            
            thumb_path = thumb_dir / f"{img_file.stem}.jpg"
            img_thumb.save(thumb_path, "JPEG", quality=THUMB_QUALITY, optimize=True)
            total_optimized += thumb_path.stat().st_size
            
            processed += 1
            print(f"  OK {month_dir.name}/{img_file.name} ({original_size/1024:.0f}KB -> {out_path.stat().st_size/1024:.0f}KB + thumb)")
            
        except Exception as e:
            skipped += 1
            print(f"  SKIP {month_dir.name}/{img_file.name}: {e}")

print(f"\n{'='*50}")
print(f"Procesadas: {processed} imágenes")
print(f"Saltadas: {skipped}")
print(f"Tamaño original: {total_original/1024/1024:.1f} MB")
print(f"Tamaño optimizado: {total_optimized/1024/1024:.1f} MB")
print(f"Ahorro: {(total_original - total_optimized)/1024/1024:.1f} MB ({(1 - total_optimized/total_original)*100:.0f}%)")
