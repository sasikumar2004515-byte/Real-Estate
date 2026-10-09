import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqs } from '../../data/site'

function MiniFaq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="panel panel-ivory miniFaq">
      <div>
        <p className="nx-kicker">Frequently asked</p>
        <h2>Questions, answered.</h2>
        <p className="miniFaq-note">Quick answers about projects, site visits and booking.</p>
        <Link to="/faq" className="nx-btn nx-btn-dark">View all FAQs <i>→</i></Link>
      </div>
      <ul>
        {faqs.slice(0, 5).map((f, i) => (
          <li key={f.question} className={i === open ? 'open' : ''}>
            <button aria-expanded={i === open} onClick={() => setOpen(i === open ? -1 : i)}>
              {f.question}<i>{i === open ? '–' : '+'}</i>
            </button>
            <div><p>{f.answer}</p></div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MiniFaq
