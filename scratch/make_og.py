from PIL import Image

logo_path = r'c:\Users\LENOVO\Desktop\Inmobiliaria Montaño\public\logo.png'
og_out_1 = r'c:\Users\LENOVO\Desktop\Inmobiliaria Montaño\public\og-logo.png'
og_out_2 = r'c:\Users\LENOVO\Desktop\Inmobiliaria Montaño\src\app\opengraph-image.png'

logo = Image.open(logo_path).convert('RGBA')
width, height = 1200, 630

# Background canvas
bg = Image.new('RGBA', (width, height), (255, 255, 255, 255))

max_w, max_h = 750, 480
aspect = logo.height / logo.width
target_w = max_w
target_h = int(target_w * aspect)

if target_h > max_h:
    target_h = max_h
    target_w = int(target_h / aspect)

logo_resized = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
paste_x = (width - target_w) // 2
paste_y = (height - target_h) // 2

bg.paste(logo_resized, (paste_x, paste_y), logo_resized)
bg.convert('RGB').save(og_out_1, 'PNG')
bg.convert('RGB').save(og_out_2, 'PNG')

print('OpenGraph share image 1200x630 generated successfully!')
