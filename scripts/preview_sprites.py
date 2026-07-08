"""Render in-context previews of the two sprites at their component sizes
so placement/scale can be eyeballed without a browser."""
from PIL import Image, ImageDraw

def scaled_to_h(im, h):
    w = round(im.width * h / im.height)
    return im.resize((w, h), Image.LANCZOS)

# ---- STAND sprite as it sits on the card front (right side) ----
# card main area ~ 520x372 light panel with pink watermark rings
card = Image.new("RGBA", (520, 372), (247, 246, 243, 255))
d = ImageDraw.Draw(card)
cx, cy = 430, 150
for r, col in [(150, (241, 205, 209, 180)), (108, (247, 246, 243, 255)),
               (66, (241, 205, 209, 180)), (28, (247, 246, 243, 255))]:
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
stand = scaled_to_h(Image.open("public/sprites/hari_stand.png").convert("RGBA"), 252)
# right:0 bottom:0 within a right-aligned 150px box near the right edge
sx = card.width - stand.width - 4
sy = card.height - stand.height - 2
card.alpha_composite(stand, (max(0, sx), max(0, sy)))
card.save("public/sprites/_preview_card_stand.png")
print("card stand preview:", card.size, "sprite:", stand.size)

# ---- SIT sprite inside the hero framed portrait ----
sit = scaled_to_h(Image.open("public/sprites/hari_sit.png").convert("RGBA"), 192)
pad = 12
frame = Image.new("RGBA", (sit.width + pad * 2, sit.height + pad * 2), (7, 11, 20, 255))
fd = ImageDraw.Draw(frame)
fd.rectangle((0, 0, frame.width - 1, frame.height - 1), outline=(40, 46, 58, 255), width=1)
frame.alpha_composite(sit, (pad, pad))
frame.save("public/sprites/_preview_hero_sit.png")
print("hero sit preview:", frame.size, "sprite:", sit.size)
