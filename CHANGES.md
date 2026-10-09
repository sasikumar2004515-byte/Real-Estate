# Notes

- Home hero: 18s film, 271 HD frames in `public/hero`, drawn to a canvas as you scroll. Buttons come in right after the last frame.
- Gallery films: landscape clips in `public/video` (full film plus three short ones). Play opens full screen.
- Smooth scrolling is in `src/scripts/smooth.js`.
- To change the hero film, export new frames to `public/hero` (f001.webp, f002.webp ...) and update `FRAMES`, `FRAME_W` and `FRAME_H` at the top of `src/components/ScrollHero.jsx`.
