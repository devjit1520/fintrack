function Card({ children, className = "" }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
        hover:shadow-2xl
        hover:shadow-blue-500/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;