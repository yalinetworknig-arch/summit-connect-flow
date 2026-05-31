## Refactor "Partners From Our Previous Edition"

Edit `src/components/home/Partners.tsx`:

1. **Merge groups** — delete the separate "Title Sponsor" and "Partners" headings. Combine HP + U.S. Mission Nigeria + U.S. Consulate General Lagos + UNFPA into a single `partners` array.

2. **Convert to carousel** — replace the two `Group` grids with an auto-scrolling marquee using the existing `embla-carousel-react` + `embla-carousel-autoplay` (already in the project via shadcn `Carousel`). Loop infinitely, slow drift, pauses on hover, swipeable on mobile. Show ~2 logos on mobile (428px), 4 on desktop.

3. **Show the real logos** — remove the `grayscale` / `hover:grayscale-0` filter so each brand renders in its true colours. Keep the white rounded plate behind transparent SVGs so dark-on-light logos stay legible on the dark background. Keep `object-contain`, `max-h-[80px]`.

4. Keep section heading "Partners From Our Previous Edition" and the surrounding section padding/background untouched.

No other files change.