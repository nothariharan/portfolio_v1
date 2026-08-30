# MOBILEEEE CARD FINALLY EXISTS 🗣️🗣️

last time phones were just getting a shrunk desktop trainer card and everything was breaking all over the place now the whole thing flips into a real portrait layout which is where most of the hours went into

basically the card used to pretend it was mobile by scaling the gba shell down and that never worked becoz the chrome spacing flip hit targets and honors art were all sized for landscape so on a phone it felt like looking through a tiny window at a desk site lol

## WHAT SHIPPED

### REAL MOBILE SHELL ( not a zoom hack )
front face got its own phone composition

- FOCUS as a proper 2x2 instead of crushing four tiles sideways
- EXP + CURRENTLY stacked under STACK instead of that weird cream canyon from `mt-auto`
- CORE / INFRA labels nudged left so they dont float in the middle of nowhere
- TAP TO FLIP bar at the bottom ( badge strip stays desktop )

DATA FILE back also got a real narrow pass

- tabs go PROJ / EXP / HONORS / SKILLS so they dont wrap into mush
- honors stickers sit in a 2×2 instead of a crushed 4-up
- skills become a bigger stacked grid
- experience stops overlapping itself on tall thin viewports

shell size morphs soft when u rotate or cross the breakpoint so it doesnt hard-cut mid flip so thats there

### FLIP WAS BEING WEIRD AF
single tap was flipping twice becoz pointerup + the ghost click after touch were both arming the flip so now its one arm + a hard cooldown for the whole animation

also buttons on the back were flipping the card with them 🥀

OPEN PROOF · tabs · stickers · hari.md · project links all used to bubble into the flip handler so u tap proof and the whole card yeets around

now controls + a little near-miss margin dont flip and empty chrome / honor copy / description panels still do which is what u actually want on mobile when ur thumb is hunting for free space

tokens furnace had a full-bleed invisible github link over the whole painted art so tapping the logos took u to github for no reason — killed that. furnace art is view only now

### HONORS ON A PHONE
YC banner was cropping the building crown so shifted object-position a bit lower in the same frame ( no bigger no smaller just move the art )

hackathon highlights used to jam two tiny win chips into a crushed grid and the bottom row was getting clipped so that became one clean **VIEW ALL PROJECTS HERE** button that dumps into `/portfolio?tab=projects`

honor titles also stopped using Press Start for long lines becoz they looked horizontally stretched when forced wide — card font now so “YC Startup School '26” reads normal

### LITTLE SIDE QUESTS ( still counts )
browser tab stays `hariharan - welcome!! :D` while u are looking

switch away and it goes `sure u saw everything?` then after 30s it loops short silly titles so the tab itself is kind of a mini game :DD

also shipped a proper OG banner (1200×630) from my black/white pixel banner but cleaner so when ppl paste `hariharann.me` the preview isnt a text only ghost town

link preview title is the niche one — **N. Hariharan — solution for your problems :DD**  
desc is `UI/UX | Product | Application | Systems Developer · likes having fun`  
tab title stays welcome so discord and chrome arent fighting each other

## COOKING RN 🍽️

image weight is still the villain

theres a lot of honor heroes stickers logos sprites on that card and first open on mobile still feels heavy even after the layout finally makes sense

next pass is probably

- avif / webp everywhere the front still cheats with fat pngs
- lazy the back face until u actually flip
- stop shipping dead 1–2mb honor experiments in public/
- preload only first paint chrome

still needs to be done includes

asset compression across the card  
defer honor / project sprites until flip  
maybe a lighter mobile hero set so portrait doesnt pull desktop weight  
more sprite polish later ig

[ inspired from pokemon cards + phone thumbs being less precise than a mouse hopefully the flip cooldown saves a few rage taps 🥀🥀 ]

live at [hariharann.me](https://hariharann.me) · rotate to portrait · flip · poke the DATA FILE · HONORS on a real phone this time

give me some ideas people 👀 if u want the mobile card to load snappier without killing the pixel look

thx for readin :DDDDD
