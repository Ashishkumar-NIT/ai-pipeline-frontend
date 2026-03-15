export function Input({
  id,
  label,
  type = "text",
  placeholder,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#374151]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="h-11 w-full border border-[#e5e5e5] rounded-lg px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
