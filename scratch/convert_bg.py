import os
from PIL import Image

uploaded_dir = r'C:\Users\LENOVO\.gemini\antigravity\brain\9c10fd36-99d1-42fe-857a-44f5c6706f97\.user_uploaded'
out_path = r'c:\Users\LENOVO\Desktop\Inmobiliaria Montaño\public\hero-bg.webp'

files = [os.path.join(uploaded_dir, f) for f in os.listdir(uploaded_dir)]
files.sort(key=os.path.getmtime, reverse=True)

latest_file = files[0]
print(f"Converting latest user image: {latest_file}")

img = Image.open(latest_file).convert('RGB')
img.save(out_path, 'WEBP', quality=88, optimize=True)

print(f"Successfully saved optimized WebP to {out_path}!")
