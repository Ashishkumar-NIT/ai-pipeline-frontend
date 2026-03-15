export function Input({
  id,
  label,
  type = "text",
  placeholder,
  ...props
}) {
  return (
    <div className="flex flex-col gap-3 w-full group">
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60 transition-colors group-focus-within:text-celestique-dark"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="flex h-12 w-full border-b border-celestique-taupe bg-transparent px-0 py-2 text-sm text-celestique-dark placeholder:text-celestique-dark/30 focus:outline-none focus:border-celestique-dark transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}