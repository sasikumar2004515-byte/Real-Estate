import Reveal from '../Reveal'

function GalleryIntro() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

      <Reveal>
        <div className="mx-auto max-w-[640px] text-center">

          <p className="font-['Inter'] text-[12px] font-medium uppercase tracking-[0.2em] text-[#6B6F76]">
            A slower look
          </p>

          <p className="mt-5 font-['Inter'] text-base font-normal leading-[1.7] text-[#1C1F26]">
            Every frame is an invitation to pause — to notice the materials, the light, the proportions and the small details that make a place feel like home.
          </p>

        </div>
      </Reveal>

    </section>
  )
}

export default GalleryIntro