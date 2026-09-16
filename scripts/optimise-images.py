"""Optional asset preparation: python -m pip install Pillow; python scripts/optimise-images.py.

The generated assets and manifest are committed; normal builds need only Node.js.
Original photographs remain in src/assets/pictures.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'src/assets/pictures'
OUTPUT = ROOT / 'site/public/assets/pictures'
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = {}
for source in sorted(SOURCE.iterdir()):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    with Image.open(source) as original:
        img = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
        max_width = 520 if source.name == 'PWPlogo.png' else 1600
        img.thumbnail((max_width, 2000), Image.Resampling.LANCZOS)
        # The build separately preserves original public URLs for incoming links.
        # New pages use the smaller WebP variants below.
        variants = []
        for width in sorted({min(img.width, w) for w in (480, 960, 1600)}):
            resized = img.resize((width, round(img.height * width / img.width)), Image.Resampling.LANCZOS)
            name = f'{source.stem}-{source.suffix[1:].lower()}-{width}.webp'
            resized.save(OUTPUT / name, format='WEBP', quality=80, method=6)
            variants.append({'src': '/assets/pictures/' + name, 'width': width})
        manifest['/assets/pictures/' + source.name] = {'width': img.width, 'height': img.height, 'variants': variants}
with Image.open(SOURCE / 'smalllogo.png') as logo:
    logo.thumbnail((48, 48), Image.Resampling.LANCZOS)
    logo.save(ROOT / 'site/public/favicon.png', optimize=True)
(ROOT / 'site/images.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared {len(manifest)} responsive images.')
