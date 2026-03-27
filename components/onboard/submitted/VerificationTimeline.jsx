export function VerificationTimeline() {
  return (
    <div className="flex flex-col items-start w-full max-w-[240px] mx-auto mt-6 mb-2">
      
      {/* Step 1 */}
      <div className="flex items-start gap-5 w-full relative">
        <div className="flex flex-col items-center">
          <div className="w-[28px] h-[28px] shrink-0 rounded-full bg-[#22C55E] flex items-center justify-center text-white z-10">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-[16px] h-[16px]"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
          </div>
          <div className="w-[2px] h-[34px] bg-[#D1D5DB]" />
        </div>
        <div className="pt-1">
          <span className="text-[15px] font-medium text-[#6B7280]">Account created</span>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start gap-5 w-full relative">
        <div className="flex flex-col items-center">
          <div className="w-[28px] h-[28px] shrink-0 rounded-full bg-[#22C55E] flex items-center justify-center text-white z-10">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-[16px] h-[16px]"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
          </div>
          <div className="w-[2px] h-[34px] bg-[#D1D5DB]" />
        </div>
        <div className="pt-1">
          <span className="text-[15px] font-medium text-[#6B7280]">Details submitted</span>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start gap-5 w-full relative">
        <div className="flex flex-col items-center">
          <div className="w-[28px] h-[28px] shrink-0 rounded-full border-[2px] border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] z-10">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[16px] h-[16px]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div className="pt-1">
          <span className="text-[15px] font-[700] text-[#111827]">Under verification</span>
        </div>
      </div>

    </div>
  );
}
