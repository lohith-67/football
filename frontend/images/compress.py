from PIL import Image
import os

img_path = 'stadium-hero.jpg'
out_path = 'stadium-hero.webp'

if os.path.exists(img_path):
    with Image.open(img_path) as img:
        img.save(out_path, 'webp', quality=80)
        print(f"Compressed {img_path} to {out_path}")
else:
    print("Image not found")
