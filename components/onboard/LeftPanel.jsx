export function LeftPanel({ heading, description }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-6 md:gap-8 w-full max-w-[320px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#2E2927] flex items-center justify-center text-white font-bold tracking-wider text-[clamp(12px,1.2vw,14px)] shadow-sm shrink-0">
          JI
        </div>
        <span className="text-[clamp(13px,1.4vw,14px)] font-bold text-[#6B7280] tracking-wide">Jewels India</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <h1 className="text-[clamp(22px,2.5vw,32px)] leading-[1.2] font-extrabold text-[#111827]">
          {heading}
        </h1>
        <p className="text-[clamp(13px,1.3vw,14px)] text-[#9CA3AF] leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
