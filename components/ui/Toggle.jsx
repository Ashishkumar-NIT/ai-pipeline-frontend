"use client";

export function Toggle({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between group">
      {label && (
        <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60 transition-colors group-hover:text-celestique-dark cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
          checked ? "bg-celestique-dark" : "bg-celestique-taupe hover:bg-celestique-taupe/80"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-celestique-cream shadow-sm ring-0 transition duration-300 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}