import { Link } from 'react-router-dom'

function CtaBand({ image, title, text, primary, secondary, items }) {
  return (
    <section
      className="panel cta"
      style={{
        backgroundImage: `linear-gradient(rgba(11,26,46,.68),rgba(11,26,46,.68)),url(${image})`,
      }}
    >
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="cta-buttons">
          <Link to={primary.to} className="nx-btn">
            {primary.label} <i>→</i>
          </Link>
          <Link to={secondary.to} className="nx-btn nx-btn-ghost">
            {secondary.label}
          </Link>
        </div>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default CtaBand
