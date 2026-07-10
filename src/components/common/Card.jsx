function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-slate-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;