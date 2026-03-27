export function LeftPanel() {
  return (
    <div className="flex flex-col items-start gap-8 max-w-[400px]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#3A3331] rounded-2xl flex items-center justify-center font-bold text-white tracking-wider text-xl">
          JI
        </div>
        <span className="font-bold text-[18px] text-[#000000]">Jewels India</span>
      </div>
      
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#000000] leading-tight">
          Let&apos;s get to know you
        </h1>
        <p className="text-[14px] text-[#9CA3AF] leading-relaxed max-w-[340px]">
          We need a few details to verify who you are. This keeps your account and your business safe.
        </p>
      </div>
    </div>
  );
}
