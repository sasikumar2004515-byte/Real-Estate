function HairLine({
  className = '',
  width = '100%',
  immediate = false,
}) {
  return (
    <div
      className={`h-px overflow-hidden bg-[#E7E2D8] ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-[#C9A96E] transition-transform duration-1000"
        style={{
          transform: immediate
            ? 'scaleX(1)'
            : 'scaleX(1)',
          transitionTimingFunction:
            'cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  )
}

export default HairLine