import useInView from '../hooks/useInView'

// Fades up when scrolled into view. "d" staggers siblings, "kind" picks the motion.
function Wave({ as: Tag = 'div', d = 0, kind = 'up', className = '', style, children, ...rest }) {
  const [ref, seen] = useInView()
  return (
    <Tag
      ref={ref}
      className={`lx-wave lx-wave--${kind}${seen ? ' is-in' : ''}${className ? ' ' + className : ''}`}
      style={{ '--wd': `${d * 110}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Wave
