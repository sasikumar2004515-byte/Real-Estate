import useInView from '../hooks/useInView'

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
