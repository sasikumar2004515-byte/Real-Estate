import Wave from '../Wave'

const steps = [
  ['Discover', 'We read the site first: surroundings, access and orientation.'],
  ['Design', 'Layouts are planned around daylight, ventilation and daily use.'],
  ['Build', 'Construction is tracked stage by stage until completion.'],
  ['Handover', 'Homes are handed over with a walkthrough and the documents in place.'],
]

function Process() {
  return (
    <section className="lxp" data-own>
      <div className="lx-wrap">
        <Wave className="lxp-head">
          <p className="lx-kicker lx-kicker--dark">Our process</p>
          <h2>From vision to a home.</h2>
        </Wave>
        <ol className="lxp-track" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {steps.map(([name, text], i) => (
            <Wave as="li" d={i} className="lxp-step" key={name}>
              <span className="lxp-num">{String(i + 1).padStart(2, '0')}</span>
              {i < steps.length - 1 && <span className="lxp-arrow" aria-hidden="true">→</span>}
              <div className="lxp-card">
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            </Wave>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
