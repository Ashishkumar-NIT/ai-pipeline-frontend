"use client";

export function Toggle({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-[#374151] cursor-pointer"
          onClick={() => onChange(!checked)}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22C55E] ${
          checked ? "bg-[#22C55E]" : "bg-[#E5E7EB]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0.5"
          } mt-0.5`}
        />
      </button>
    </div>
  );
}
