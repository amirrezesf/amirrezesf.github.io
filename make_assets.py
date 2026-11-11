# make_assets.py
# pip install pillow
import json
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

SOURCE_LIGHT = "logo-light.png"   # <- version for light backgrounds
SOURCE_DARK = "logo-dark.png"     # <- version for dark backgrounds
OG_SOURCE = "dark"                 # which one the single OG image is built from
OUT = Path("assets")
OUT.mkdir(exist_ok=True)

sources = {
    "light": Image.open(SOURCE_LIGHT).convert("RGBA"),
    "dark": Image.open(SOURCE_DARK).convert("RGBA"),
}


def center_square(img):
    side = min(img.size)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    return img.crop((left, top, left + side, top + side))


# ---------- Favicons: one set per theme ----------
for theme, src in sources.items():
    sq = center_square(src)
    sq.resize((16, 16), Image.LANCZOS).save(OUT / f"favicon-{theme}-16x16.png", optimize=True)
    sq.resize((32, 32), Image.LANCZOS).save(OUT / f"favicon-{theme}-32x32.png", optimize=True)
    sq.resize((256, 256), Image.LANCZOS).save(
        OUT / f"favicon-{theme}.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)]
    )

# ---------- Single-file assets (cannot be dual) ----------
# Pick one version. The dark one is often the safer choice for icons because
# iOS and Android often place them on dark or colored backgrounds.
single = center_square(sources[OG_SOURCE])
single.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)
single.resize((192, 192), Image.LANCZOS).save(OUT / "icon-192.png", optimize=True)
single.resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png", optimize=True)

# ---------- Open Graph 1200x630 (single file) ----------
OG_W, OG_H = 1200, 630
og_src = sources[OG_SOURCE].convert("RGB")
bg = ImageOps.fit(og_src, (OG_W, OG_H), Image.LANCZOS, centering=(0.5, 0.35))
bg = bg.filter(ImageFilter.GaussianBlur(28))
bg = Image.eval(bg, lambda v: int(v * 0.55))
fg = ImageOps.contain(og_src, (OG_W, OG_H), Image.LANCZOS)
og = bg.copy()
og.paste(fg, ((OG_W - fg.width) // 2, (OG_H - fg.height) // 2))
og.save(OUT / "og-image.jpg", "JPEG", quality=88, optimize=True, progressive=True)

# ---------- In-page images: web-sized copies per theme ----------
for theme, src in sources.items():
    web = src.copy()
    web.thumbnail((1000, 1000), Image.LANCZOS)
    web.save(OUT / f"photo-{theme}.webp", "WEBP", quality=85)

# ---------- Manifest ----------
manifest = {
    "name": "Amir Esfandyiari",
    "short_name": "Amir",
    "icons": [
        {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
    ],
    "theme_color": "#0f172a",
    "background_color": "#0f172a",
    "display": "standalone",
}
(OUT / "site.webmanifest").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

print("Done. Files in:", OUT.resolve())
for p in sorted(OUT.iterdir()):
    print(f"  {p.name:30} {p.stat().st_size / 1024:.0f} KB")