// type: 'mp4' (own file, best for luxury - no logos) | 'youtube' (src = video ID) | 'tour' (src = embed URL)
// Own videos live in: public/videos/  (replace film-01.mp4 ... with your real films, same name, and update duration).
// Current files are placeholder films made from your project images.
const films = [
  {
    id: 'film-01',
    title: 'The Collection',
    type: 'mp4',
    duration: '00:21',
    poster: '/images/about/about-hero.webp',
    src: '/videos/film-01.mp4',
  },
  {
    id: 'film-02',
    title: 'A Walk Through the Residence',
    type: 'mp4',
    duration: '00:17',
    poster: '/images/gallery/gallery-interior.webp',
    src: '/videos/film-02.mp4',
  },
  {
    id: 'film-03',
    title: 'Immersive Residence Tour',
    type: 'mp4',
    duration: '00:17',
    poster: '/images/gallery/gallery-pool.webp',
    src: '/videos/film-03.mp4',
  },
  {
    id: 'film-04',
    title: 'Material & Light',
    type: 'mp4',
    duration: '00:17',
    poster: '/images/projects/serenity-villas.webp',
    src: '/videos/film-04.mp4',
  },
]

export default films
