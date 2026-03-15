export function Button({
  type = "button",
  variant = "primary",
  children,
  className = "",
  loading = false,
  ...props
}) {
  const baseStyles =
    "group relative inline-flex items-center justify-center text-[11px] uppercase tracking-widest font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-14 px-10 w-full shadow-sm active:translate-y-0.5";
  
  const variants = {
    primary: "bg-celestique-dark text-celestique-cream hover:bg-celestique-dark/90 hover:shadow-md",
    outline:
      "border-2 border-celestique-dark bg-transparent text-celestique-dark hover:bg-celestique-dark hover:text-celestique-cream hover:shadow-md",
    ghost: "hover:bg-celestique-taupe/20 text-celestique-dark",
  };
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className={`transition-all duration-300 flex items-center justify-center gap-3 ${loading ? "opacity-0 invisible" : "opacity-100 visible"}`}>
        {children}
        {type === "submit" && <span className="transition-transform group-hover:translate-x-1">&rarr;</span>}
      </span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-celestique-taupe border-t-celestique-cream rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
