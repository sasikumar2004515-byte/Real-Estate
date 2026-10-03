# NIVORA - Static Real Estate Website (React + Vite)

Pages: Home, About, Projects, Project Showcase (`/projects/:id`), Gallery, Locations, Contact, FAQ, Privacy, Terms, 404.

## Run
```
npm install
npm run dev        # development
npm run build      # production build -> dist/
npm run preview    # test the production build
```

## Change content (no code needed in most cases)
| What | Where |
|---|---|
| Brand, phone, WhatsApp, email, address, map position, social links | `src/data/site.js` -> `site` |
| Projects (name, status, price, highlights, image) | `src/data/site.js` -> `projects` |
| Locations and map points | `src/data/site.js` -> `locations`, `locationPoints` |
| FAQ, testimonials | `src/data/site.js` |
| Gallery photos and chapters | `src/data/galleryChapters.js` |
| Films (own MP4 files) | `src/data/films.js` + `public/videos/` |
| Brochure PDFs | `public/brochures/<project-id>.pdf` (same name as project id) |
| Images | `public/images/...` (WebP, max 1920px wide) |

## Before going live
1. **Enquiry form:** set `formEndpoint` in `src/data/site.js` (Formspree, Netlify Forms or your API). Empty = demo mode (nothing is sent).
2. **Analytics:** set `analyticsId` (e.g. `G-XXXXXXXXXX`). It loads only after the visitor accepts cookies.
3. **Domain:** replace `https://www.nivora.com` in `site.url`, `public/robots.txt`, `public/sitemap.xml`.
4. **Legal:** review `Privacy.jsx` and `Terms.jsx` with your legal advisor.
5. **Testimonials:** replace placeholder text with approved customer feedback only.
6. **Videos / gallery photos:** the included films are placeholders made from project images. Replace with real films.
7. Use HTTPS on your host. `public/_redirects` handles page refresh on Netlify (for other hosts, redirect all routes to `index.html`).
