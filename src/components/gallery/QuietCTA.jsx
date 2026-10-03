import { Link } from 'react-router-dom'

import MaskText from '../MaskText'

function QuietCTA() {
  return (
    <section className="bg-[#FAF6EE] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

      <div className="mx-auto max-w-[760px] text-center">

        <p className="font-['Inter'] text-[12px] font-medium uppercase tracking-[0.2em] text-[#6B6F76]">
          Your next chapter
        </p>

        <div className="mt-4">

          <MaskText
            as="h2"
            lines={[
              'Come and see it',
              'in person'
            ]}
            className="font-['Manrope'] text-[28px] font-medium leading-[40px] tracking-[-0.025em] text-[#1C1F26] sm:text-[36px]"
          />

        </div>

        <p className="mx-auto mt-5 max-w-[560px] font-['Inter'] text-base font-normal leading-[1.7] text-[#6B6F76]">
          Some spaces are better experienced than explained.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">

          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#C9A96E] px-7 font-['Inter'] text-[14px] font-semibold text-[#0B1A2E] transition-[transform,opacity] duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1A2E] focus-visible:ring-offset-4"
          >
            Schedule a Visit
          </Link>

          <Link
            to="/projects"
            className="font-['Inter'] text-[14px] font-semibold text-[#1C1F26] underline decoration-[#1C1F26]/25 underline-offset-4 transition-opacity duration-300 hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
          >
            Explore Projects
          </Link>

        </div>

      </div>

    </section>
  )
}

export default QuietCTA