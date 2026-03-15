export function InputWithSuffix({ id, label, suffix, helperText, ...props }) {
  return (
    <div className="flex flex-col gap-3 w-full group">
      {label && (
        <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60 transition-colors group-focus-within:text-celestique-dark">
          {label}
        </label>
      )}
      <div className="flex items-center border-b border-celestique-taupe transition-colors duration-300 focus-within:border-celestique-dark">
        <input
          id={id}
          className="flex h-12 w-full bg-transparent px-0 py-2 text-sm text-celestique-dark placeholder:text-celestique-dark/30 focus:outline-none disabled:opacity-50"
          {...props}
        />
        <span className="inline-flex h-12 items-center px-2 text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60">
          {suffix}
        </span>
      </div>
      {helperText && <p className="text-[9px] uppercase tracking-[0.1em] text-celestique-dark/40 mt-1">{helperText}</p>}
    </div>
  );
}