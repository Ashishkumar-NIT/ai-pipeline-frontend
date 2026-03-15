export default function StatCard({ icon, title, value, change }) {
  // , positive = true
  return (
    <div className="group rounded-xl bg-white p-6 shadow-sm border border-celestique-border hover:shadow-md transition-all duration-200">
      {/* Top row: icon + arrow */}
      <div className="display-flex  items-start justify-between mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-celestique-cream text-celestique-muted">
          {icon}
        </div>
        {/* <span
          className={`flex items-center gap-1 text-xs font-medium 
            ${positive ? "text-emerald-600" : "text-rose-500"}`}
        >
          {positive ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M6 10V2M6 2L2 6M6 2l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M6 2v8M6 10L2 6M6 10l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {change}
        </span> */}
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-celestique-dark">{value}</p>
      {/* Title */}
      <p className="mt-1 text-sm text-celestique-muted">{title}</p>
    </div>
  );
}
